using System.Text.RegularExpressions;
using flight_reservation_api.Services.FlightBookingService.Models;
using FluentValidation;

namespace flight_reservation_api.Services.FlightBookingService.Validators;

public class CreateFlightReservationDtoValidator : AbstractValidator<CreateFlightReservationDto>
{
    public CreateFlightReservationDtoValidator()
    {
        RuleFor(reservation => reservation.TicketType)
            .IsInEnum();

        RuleFor(reservation => reservation.FlightNumber)
            .NotEmpty()
            .Matches(new Regex("^[A-Z]{2,3}\\d{1,4}$"));

        RuleFor(reservation => reservation.ArrivalDate)
            .LessThan(reservation => reservation.DepartureDate);
    }
}