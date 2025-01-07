﻿using System.Text.RegularExpressions;
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
    }
}