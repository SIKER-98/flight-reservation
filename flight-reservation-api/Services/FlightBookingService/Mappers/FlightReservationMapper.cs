using flight_reservation_api.Services.FlightBookingService.Data;
using flight_reservation_api.Services.FlightBookingService.Models;
using Riok.Mapperly.Abstractions;

namespace flight_reservation_api.Services.FlightBookingService.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class FlightReservationMapper
{
    internal partial FlightReservation ToFlightReservation(CreateFlightReservationDto dto);
    internal partial FlightReservation ToFlightReservation(UpdateFlightReservationDto dto);
    
    internal partial FlightReservationDto ToFlightReservationDto(FlightReservation flightReservation);

    internal partial FlightReservation ToFlightReservation(FlightReservationDto flightReservationDto);

    internal partial List<FlightReservationDto> ToFlightReservationDtos(
        IEnumerable<FlightReservation> flightReservations);

    internal partial List<FlightReservation> ToFlightReservationsDtos(
        IEnumerable<FlightReservationDto> flightReservationDtos);
}