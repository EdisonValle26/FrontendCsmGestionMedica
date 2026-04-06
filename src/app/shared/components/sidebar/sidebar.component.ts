import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Input() isOpen = true;
  @Output() toggle = new EventEmitter<void>();

  userName = 'Dr. Andrés';
  role = 'Administrador';

  constructor(private router: Router) { }

  logout() {
    // aquí luego limpias token
    this.router.navigate(['/login']);
  }

}
