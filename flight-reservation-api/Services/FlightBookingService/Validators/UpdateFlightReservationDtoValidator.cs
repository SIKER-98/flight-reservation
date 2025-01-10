using System.Text.RegularExpressions;
using flight_reservation_api.Services.FlightBookingService.Models;
using FluentValidation;

namespace flight_reservation_api.Services.FlightBookingService.Validators;

public class UpdateFlightReservationDtoValidator : AbstractValidator<UpdateFlightReservationDto>
{
    public UpdateFlightReservationDtoValidator()
    {
        RuleFor(reservation => reservation.FullName)
            .NotEmpty()
            .Matches(@"^\p{L}+(?:[-' ]\p{L}+)*\s+\p{L}+(?:[-' ]\p{L}+)*(?:\s+\p{L}+(?:[-' ]\p{L}+)*)?$")
            .WithMessage("Niepoprawne imię i nazwisko");

        RuleFor(reservation => reservation.TicketType)
            .IsInEnum()
            .WithMessage("Niepoprawny typ biletu");

        RuleFor(reservation => reservation.FlightNumber)
            .NotEmpty()
            .Matches(new Regex("^[a-zA-Z]{2,3}\\d{1,4}$"))
            .WithMessage("Niepoprawny numer lotu");

        RuleFor(reservation => reservation.DepartureDate)
            .LessThan(reservation => reservation.ArrivalDate)
            .WithMessage("Data przylotu nie może być wcześniej niż data wylotu");

        RuleFor(reservation => reservation.DepartureDate)
            .NotEmpty().WithMessage("Data wylotu jest wymagana")
            .Must(BeWithinValidRange).WithMessage("Data wylotu spoza zakresu");

        RuleFor(reservation => reservation.ArrivalDate)
            .NotEmpty().WithMessage("Data przylotu jest wymagana")
            .Must(BeWithinValidRange).WithMessage("Data przylotu spoza zakresu");
    }

    private bool BeWithinValidRange(DateTime date)
    {
        var year2000 = new DateTime(2000, 1, 1);
        var tenYearsFromNow = DateTime.Now.AddYears(10);

        return date >= year2000 && date <= tenYearsFromNow;
    }
}