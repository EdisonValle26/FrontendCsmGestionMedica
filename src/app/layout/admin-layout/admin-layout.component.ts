import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  user: any;
  isSidebarOpen = true;
  currentSection = 'Dashboard';

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.user = this.auth.getUser();
    this.updateTitle();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  updateTitle() {
    const currentOption = this.user?.options?.find(
      (option: any) => option.route === this.router.url
    );

    this.currentSection = currentOption?.name || 'Dashboard';
  }
}
