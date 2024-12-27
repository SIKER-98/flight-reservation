import {TicketType} from '../constants';

export interface CreateFlightReservationModel{
  fullName: string;
  flightNumber: string;
  departureDate: Date,
  arrivalDate: Date,
  ticketType: TicketType
}
