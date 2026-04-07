import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '../../../core/interface/table-column.interface';

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();
}
