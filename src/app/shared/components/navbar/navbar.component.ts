import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  activeSection: string = 'inicio';

  setActive(section: string) {
    this.activeSection = section;
  }

}
