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

  /* PAGINACIÓN */
  @Input() total = 0;
  @Input() page = 1;
  @Input() take = 5;
  @Input() takeOptions: number[] = [5, 10, 25, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() takeChange = new EventEmitter<number>();
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(
      this.total / this.take
    );
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.pageChange.emit(
        this.page + 1
      );
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.pageChange.emit(
        this.page - 1
      );
    }
  }

  changeTake(event: Event) {
    const value = Number(
      (event.target as HTMLSelectElement).value
    );
    this.takeChange.emit(value);
  }

}