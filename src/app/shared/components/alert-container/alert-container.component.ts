import { Component, OnInit } from '@angular/core';
import { AlertMessage } from '../../../core/interface/alert-message.interface';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-alert-container',
  standalone: false,
  templateUrl: './alert-container.component.html',
  styleUrls: ['./alert-container.component.css']
})
export class AlertContainerComponent implements OnInit {

  alerts: AlertMessage[] = [];

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.alert$.subscribe(alert => {

      // estado inicial
      alert.state = 'enter';
      this.alerts.push(alert);

      // después de 3s → activar salida
      setTimeout(() => {
        alert.state = 'exit';
      }, 3000);

      // después de animación → eliminar (FIFO)
      setTimeout(() => {
        this.alerts = this.alerts.filter(a => a !== alert);
      }, 3500); // 3000 + duración animación
    });
  }
}
