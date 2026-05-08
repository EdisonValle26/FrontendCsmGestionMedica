import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Input() isOpen = true;
  @Output() toggle = new EventEmitter<void>();

  user: any;

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isExactRoute(route: string): boolean {
    return route === '/dashboard';
  }
}