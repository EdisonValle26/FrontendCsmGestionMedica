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

  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.form?.reset();
      this.buildForm();
    }
  }

  buildForm() {
    const group: any = {};

    this.fields.forEach(field => {

      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      group[field.name] = [
        this.data?.[field.name] ?? '',
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

    this.submitForm.emit(this.form.value);
  }
}
