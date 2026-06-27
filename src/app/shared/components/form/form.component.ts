import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField } from '../../../core/interface/form-field.interface';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnChanges {

  @Input() fields: FormField[] = [];
  @Input() data: any = null;
  @Input() mode: 'create' | 'edit' | 'view' = 'create';

  @Output() submitForm = new EventEmitter<any>();
  @Output() fieldChange = new EventEmitter<any>();

  form!: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.form?.reset();
      this.buildForm();
      if (this.mode === 'view') {
        this.form.disable();
      }
    }
  }

  onFieldChange(field: FormField, event: any) {
    this.fieldChange.emit({
      name: field.name,
      value: event.target.value
    });
  }

  buildForm() {

    const group: any = {};

    this.fields.forEach(field => {

      const validators = [];

      /* REQUIRED */
      if (field.required) {
        validators.push(Validators.required);
      }

      /* MIN LENGTH */
      if (field.minLength) {
        validators.push(
          Validators.minLength(field.minLength)
        );
      }

      /* MAX LENGTH */
      if (field.maxLength) {
        validators.push(
          Validators.maxLength(field.maxLength)
        );
      }

      /* INPUT TYPES */
      switch (field.inputType) {

        case 'number':
          validators.push(
            Validators.pattern(/^[0-9]*$/)
          );
          break;

        case 'decimal':
          validators.push(
            Validators.pattern(/^\d+(\.\d{1,2})?$/)
          );
          break;

        case 'email':
          validators.push(
            Validators.email
          );
          break;

        case 'letters':
          validators.push(
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
          );
          break;

        case 'alphanumeric':
          validators.push(
            Validators.pattern(/^[a-zA-Z0-9\s]*$/)
          );
          break;
      }
      const disabled = this.mode === 'edit' &&  field.disableOnEdit;

      group[field.name] = [
        {
          value: this.data?.[field.name] ?? '',
          disabled
        },
        validators
      ];
    });

    this.form = this.fb.group(group);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.form.getRawValue());
  }


  onInput(event: any, field: FormField) {

    let value = event.target.value;

    switch (field.inputType) {

      /* SOLO NÚMEROS */
      case 'number':
        value = value.replace(/[^0-9]/g, '');
        break;

      /* DECIMALES */
      case 'decimal':
        value = value.replace(/[^0-9.]/g, '');
        break;

      /* SOLO LETRAS */
      case 'letters':
        value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        break;

      /* ALFANUMÉRICO */
      case 'alphanumeric':
        value = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s#.,-]/g, '');
        break;
    }

    /* MAX LENGTH */
    if (field.maxLength) {
      value = value.substring(0, field.maxLength);
    }

    this.form.get(field.name)?.setValue(
      value,
      { emitEvent: false }
    );
  }
}
