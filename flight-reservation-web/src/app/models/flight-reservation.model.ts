import {TicketType} from '../constants/ticket-type';


export interface FlightReservationModel {
  id: string;
  fullName: string;
  flightNumber: string;
  departureDate: Date,
  arrivalDate: Date,
  ticketType: TicketType
}
