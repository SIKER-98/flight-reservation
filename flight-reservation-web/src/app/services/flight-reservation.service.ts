import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateFlightReservationModel, FlightReservationModel, UpdateFlightReservationModel} from '../models';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FlightReservationService {
  private apiUrl = 'http://localhost:5059/api/flightReservation';
  private http = inject(HttpClient);

  getFlightReservations(): Observable<FlightReservationModel[]> {
    return this.http.get<FlightReservationModel[]>(`${this.apiUrl}`);
  }

  getFlightReservation(id: string): Observable<FlightReservationModel> {
    return this.http.get<FlightReservationModel>(`${this.apiUrl}/${id}`);
  }

  createFlightReservation(data: CreateFlightReservationModel): Observable<FlightReservationModel> {
    return this.http.post<FlightReservationModel>(`${this.apiUrl}`, data);
  }

  updateFlightReservation(data: UpdateFlightReservationModel): Observable<FlightReservationModel> {
    return this.http.put<FlightReservationModel>(`${this.apiUrl}`, data);
  }

  deleteFlightReservation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  clearFlightReservations(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`);
  }
}
