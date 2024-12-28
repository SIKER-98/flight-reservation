import { Component } from '@angular/core';
import {FlightReservationListComponent} from './components';

@Component({
  selector: 'app-root',
  imports: [FlightReservationListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Menadżer rezerwacji lotniczych';
}
