import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ROUTES } from '../../../core/config/api-routes';
import { environment } from '../../../core/config/environment';

@Injectable({ providedIn: 'root' })
export class ChatbotService {

    isOpen = false;

    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    toggle() {
        this.isOpen = !this.isOpen;
    }

    open() {
        this.isOpen = true;
    }

    sendMessage(message: string, sessionId: string) {
        return this.http.post<any>(
            `${this.baseUrl}${API_ROUTES.CHATBOT}`,
            {
                session_id: sessionId,
                message: message
            }
        );
    }
}