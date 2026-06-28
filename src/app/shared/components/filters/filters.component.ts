import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { FilterField } from '../../../core/interface/filter-field.interface';

@Component({
  selector: 'app-filters',
  standalone: false,
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  @Input() filters: FilterField[] = [];
  @Output() filterChange = new EventEmitter<any>();

  form!: FormGroup;

  ngOnInit() {
    const group: any = {};

    this.filters.forEach(f => {
      group[f.name] = new FormControl(
        f.value ?? f.defaultValue ?? ''
      );
    });

    this.form = new FormGroup(group);

    this.form.valueChanges
      .pipe(debounceTime(400))
      .subscribe(val => {
        this.filterChange.emit(val);
      });
  }

  clear() {

    const values: any = {};

    this.filters.forEach(f => {
      values[f.name] = f.defaultValue ?? '';
    });

    this.form.reset(values);
  }
}
