import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
    isOpen = false;

    toggle() {
        this.isOpen = !this.isOpen;
    }

    open() {
        this.isOpen = true;
    }
}