export interface AlertMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    state?: 'enter' | 'exit';
}
