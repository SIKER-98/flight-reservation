import {TicketType} from '../constants/ticket-type';

export interface CreateFlightReservationModel{
  fullName: string;
  flightNumber: string;
  departureDate: Date,
  arrivalDate: Date,
  ticketType: TicketType
}
