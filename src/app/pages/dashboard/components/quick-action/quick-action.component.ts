import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-quick-action',
  standalone: false,
  templateUrl: './quick-action.component.html',
  styleUrl: './quick-action.component.css'
})
export class QuickActionComponent {

  @Input() label!: string;
  @Input() icon!: string;

}
