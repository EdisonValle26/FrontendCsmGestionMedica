import { Component } from '@angular/core';
import { ChatbotService } from '../../shared/components/chatbot/chatbot.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false,
})
export class HomeComponent {
  constructor(public chat: ChatbotService) { }
  
}