import {TicketType} from '../constants/ticket-type';


export interface UpdateFlightReservationModel {
  id: string;
  fullName: string;
  flightNumber: string;
  departureDate: Date,
  arrivalDate: Date,
  ticketType: TicketType
}
