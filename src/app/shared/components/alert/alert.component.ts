import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: false,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() message: string = '';

  getStyles() {
    const styles = {
      success: 'bg-green-100 text-green-700 border-green-400',
      error: 'bg-red-100 text-red-700 border-red-400',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-400',
      info: 'bg-blue-100 text-blue-700 border-blue-400'
    };

    return styles[this.type];
  }

  getIcon() {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    return icons[this.type];
  }
}