import {TicketType} from '../constants';

export interface UpdateFlightReservationModel {
  id: string;
  fullName: string;
  flightNumber: string;
  departureDate: Date,
  arrivalDate: Date,
  ticketType: TicketType
}
