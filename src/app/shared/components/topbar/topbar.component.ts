import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  @Input() title = 'Dashboard';

  @Output() menuClick = new EventEmitter<void>();

  today = new Date();
}
