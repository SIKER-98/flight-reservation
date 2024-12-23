namespace flight_reservation_api.Services.FlightBookingService.Data;

public class FlightReservation
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required string FullName { get; set; }

    public required string FlightNumber { get; set; }

    public DateTime DepartureDate { get; set; }

    public DateTime ArrivalDate { get; set; }

    public TicketType TicketType { get; set; }
}