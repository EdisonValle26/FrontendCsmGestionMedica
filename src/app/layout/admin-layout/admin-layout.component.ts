import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  isSidebarOpen = true;

  currentSection = 'Dashboard';

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  changeSection(name: string) {

    this.currentSection = name;

  }
}
