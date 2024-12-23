using flight_reservation_api.Services.FlightBookingService.Mappers;
using flight_reservation_api.Services.FlightBookingService.Models;
using flight_reservation_api.Services.FlightBookingService.Validators;
using FluentValidation;

namespace flight_reservation_api.Services.FlightBookingService.Services;

public static class ServiceRegistrator
{
    public static void AddFlightBookingService(this IServiceCollection services)
    {
        services.AddSingleton<FlightReservationMapper>();

        services.AddScoped<IValidator<CreateFlightReservationDto>, CreateFlightReservationDtoValidator>();
        services.AddScoped<IValidator<UpdateFlightReservationDto>, UpdateFlightReservationDtoValidator>();
        services.AddScoped<IFlightBookingService, FlightBookingService>();
    }
}