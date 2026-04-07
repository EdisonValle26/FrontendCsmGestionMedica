import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-container',
  standalone: false,
  templateUrl: './modal-container.component.html',
  styleUrl: './modal-container.component.css'
})
export class ModalContainerComponent {
  @Input() title = '';
  @Input() open = false;

  @Output() close = new EventEmitter<void>();
}
