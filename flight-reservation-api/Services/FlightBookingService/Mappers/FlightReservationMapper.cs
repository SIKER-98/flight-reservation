using AutoMapper;
using flight_reservation_api.Services.FlightBookingService.Data;
using flight_reservation_api.Services.FlightBookingService.Models;

namespace flight_reservation_api.Services.FlightBookingService.Mappers;

public class FlightReservationMapper : Profile
{
    public FlightReservationMapper()
    {
        CreateMap<CreateFlightReservationDto, FlightReservation>()
            .ForMember(reservation => reservation.Id, opt => opt.Ignore());
        CreateMap<UpdateFlightReservationDto, FlightReservation>();
        CreateMap<FlightReservation, FlightReservationDto>();
        CreateMap<FlightReservation[], FlightReservationDto[]>();
    }
}