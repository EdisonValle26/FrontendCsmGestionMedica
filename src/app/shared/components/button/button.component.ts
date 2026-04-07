import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'cancel' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() customClass: string = '';

  getClasses(): string {

    const base = 'px-4 py-2 rounded-lg transition shadow-md hover:scale-105';

    const styles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-black hover:bg-gray-300',
      outline: 'border border-blue-600 text-blue-600 hover:bg-blue-100',
      cancel: 'border border-red-600 text-red-600 hover:bg-red-100'
    };

    return `${base} ${styles[this.variant]}`;
  }
}
