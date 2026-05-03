import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatbotService } from './chatbot.service';


@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  @ViewChild('chatBody') chatBody!: ElementRef;
  @ViewChild('chatInput') chatInput!: ElementRef;

  messages: any[] = [];
  inputText: string = '';
  sessionId: string = 'user-' + Date.now();

  isTyping: boolean = false;

  constructor(public chat: ChatbotService) { }

  ngOnInit() {
    this.messages.push({
      from: 'bot',
      text: 'Hola 👋 ¿En qué puedo ayudarte?'
    });
  }

  toggleChat() {
    this.chat.toggle();

    if (this.chat.isOpen) {
      this.scrollAfterRender();
    }
  }

  send() {
    if (!this.inputText.trim()) return;

    // USER
    this.messages.push({
      from: 'user',
      text: this.inputText
    });

    this.scrollAfterRender();

    const userMessage = this.inputText;
    this.inputText = '';

    this.isTyping = true;
    this.scrollAfterRender();

    this.chat.sendMessage(userMessage, this.sessionId)
      .subscribe(res => {

        this.isTyping = false;
        this.focusInput();

        this.messages.push({
          from: 'bot',
          text: res.response || 'Sin respuesta'
        });

        this.scrollAfterRender();
      });
  }

  scrollAfterRender() {
    setTimeout(() => {
      if (this.isUserNearBottom()) {
        this.scrollToBottom();
      }
    }, 0);
  }

  scrollToBottom() {
    try {
      this.chatBody.nativeElement.scrollTo({
        top: this.chatBody.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    } catch (err) { }
  }

  isUserNearBottom(): boolean {
    const threshold = 100;

    const position = this.chatBody.nativeElement.scrollTop +
      this.chatBody.nativeElement.clientHeight;

    const height = this.chatBody.nativeElement.scrollHeight;

    return position > height - threshold;
  }

  handleKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  focusInput() {
    setTimeout(() => {
      this.chatInput?.nativeElement.focus();
    }, 0);
  }
}
