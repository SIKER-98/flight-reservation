namespace flight_reservation_api.Services.FlightBookingService.Data;

public class FlightReservation
{
    /// <summary>
    /// Identyfikator lotu
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Imię i Nazwisko
    /// </summary>
    public required string FullName { get; init; }

    /// <summary>
    /// Numer lotu
    /// </summary>
    public required string FlightNumber { get; init; }

    /// <summary>
    /// Data wylotu
    /// </summary>
    public DateTime DepartureDate { get; set; }

    /// <summary>
    /// Data przylotu
    /// </summary>
    public DateTime ArrivalDate { get; set; }

    /// <summary>
    /// Typ biletu
    /// </summary>
    public TicketType TicketType { get; set; }
}