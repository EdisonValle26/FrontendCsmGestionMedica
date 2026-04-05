import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  standalone: false,
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent {

  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  confirmAction() {
    this.confirm.emit();
  }

  getIcon() {
    const icons = {
      success: 'fa-check-circle text-green-500',
      error: 'fa-times-circle text-red-500',
      warning: 'fa-exclamation-triangle text-yellow-500',
      info: 'fa-info-circle text-blue-500'
    };

    return icons[this.type];
  }
}