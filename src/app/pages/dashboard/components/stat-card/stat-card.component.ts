import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: false,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {

  @Input() title!: string;
  @Input() value!: string;
  @Input() icon!: string;
  @Input() color: 'blue' | 'green' | 'purple' | 'red' = 'blue';

  getColor() {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600'

    };

    return colors[this.color];
  }

  getBorderColor() {
    switch (this.color) {
      case 'blue':
        return 'border-t-blue-500';
      case 'green':
        return 'border-t-green-500';
      case 'purple':
        return 'border-t-purple-500';
      case 'red':
        return 'border-t-red-500';
      default:
        return 'border-t-gray-300';
    }
  }
}