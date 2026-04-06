import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  @Output() menuClick = new EventEmitter<void>();
}
