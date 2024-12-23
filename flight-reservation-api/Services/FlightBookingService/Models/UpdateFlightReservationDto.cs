using flight_reservation_api.Services.FlightBookingService.Data;

namespace flight_reservation_api.Services.FlightBookingService.Models;

public record UpdateFlightReservationDto(
    Guid Id,
    string FullName,
    string FlightNumber,
    DateTime DepartureDate,
    DateTime ArrivalDate,
    TicketType TicketType);