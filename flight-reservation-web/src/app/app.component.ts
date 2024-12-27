import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FlightReservationListComponent} from './components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FlightReservationListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Menadżer rezerwacji lotniczych';
}
