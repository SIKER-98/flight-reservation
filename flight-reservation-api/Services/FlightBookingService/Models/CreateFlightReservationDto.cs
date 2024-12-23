using flight_reservation_api.Services.FlightBookingService.Data;

namespace flight_reservation_api.Services.FlightBookingService.Models;

public record CreateFlightReservationDto(
    string FullName,
    string FlightNumber,
    DateTime DepartureDate,
    DateTime ArrivalDate,
    TicketType TicketType);