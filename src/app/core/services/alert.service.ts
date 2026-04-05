import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    state?: 'enter' | 'exit';
}

@Injectable({ providedIn: 'root' })
export class AlertService {

    private alertSubject = new Subject<AlertMessage>();

    alert$ = this.alertSubject.asObservable();

    show(type: AlertMessage['type'], message: string) {
        this.alertSubject.next({ type, message });
    }

    success(msg: string) {
        this.show('success', msg);
    }

    error(msg: string) {
        this.show('error', msg);
    }

    warning(msg: string) {
        this.show('warning', msg);
    }

    info(msg: string) {
        this.show('info', msg);
    }
}