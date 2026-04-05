import { Component } from '@angular/core';
import { ChatbotService } from './chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {

  constructor(public chat: ChatbotService) { }

  toggleChat() {
    this.chat.toggle();
  }

}
