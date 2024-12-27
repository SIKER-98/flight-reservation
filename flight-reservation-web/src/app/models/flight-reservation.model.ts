import {TicketType} from '../constants';


export interface FlightReservationModel {
  id: string;
  fullName: string;
  flightNumber: string;
  departureDate: Date,
  arrivalDate: Date,
  ticketType: TicketType
}
