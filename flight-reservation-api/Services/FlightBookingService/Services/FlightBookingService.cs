using System.Text.Json;
using flight_reservation_api.Services.FlightBookingService.Data;
using flight_reservation_api.Services.FlightBookingService.Mappers;
using flight_reservation_api.Services.FlightBookingService.Models;

namespace flight_reservation_api.Services.FlightBookingService.Services;

public interface IFlightBookingService
{
}

public class FlightBookingService : IFlightBookingService
{
    private readonly string _databasePath = "./Data/flightReservations.json";
    private readonly FlightReservationMapper _flightReservationMapper;

    private List<FlightReservation> _flightReservations;


    public FlightBookingService(FlightReservationMapper flightReservationMapper)
    {
        _flightReservationMapper = flightReservationMapper;
        _flightReservations = LoadFlightReservations();
    }

    /// <summary>
    /// Loading file with flight reservations
    /// </summary>
    /// <returns>List of previous created reservations</returns>
    private List<FlightReservation> LoadFlightReservations()
    {
        if (!File.Exists(_databasePath))
        {
            return [];
        }

        var jsonData = File.ReadAllText(_databasePath);
        return JsonSerializer.Deserialize<List<FlightReservation>>(jsonData) ?? [];
    }

    /// <summary>
    /// Update file of flight reservations
    /// </summary>
    private void SaveFlightReservations()
    {
        if (!File.Exists(_databasePath))
        {
            File.Create(_databasePath);
        }

        var jsonData = JsonSerializer.Serialize(_flightReservations);
        File.WriteAllText(_databasePath, jsonData);
    }

    public List<FlightReservation> GetAllFlightReservations()
    {
        return _flightReservations;
    }

    public FlightReservation? GetFlightReservationById(Guid id)
    {
        return _flightReservations.FirstOrDefault(reservation => reservation.Id == id);
    }

    public FlightReservationDto CreateFlightReservation(CreateFlightReservationDto dto)
    {
        var newFlightReservation = _flightReservationMapper.ToFlightReservation(dto);
        _flightReservations.Add(newFlightReservation);
        return _flightReservationMapper.ToFlightReservationDto(newFlightReservation);
    }

    public FlightReservationDto? UpdateFlightReservation(UpdateFlightReservationDto dto)
    {
        var flightReservationIndex = _flightReservations
            .FindIndex(reservation => reservation.Id == dto.Id);

        if (flightReservationIndex < 0)
        {
            return null;
        }

        var updatedFlightReservation = _flightReservationMapper.ToFlightReservation(dto);
        _flightReservations[flightReservationIndex] = updatedFlightReservation;
        return _flightReservationMapper.ToFlightReservationDto(updatedFlightReservation);
    }

    public void DeleteFlightReservation(Guid id)
    {
        _flightReservations = _flightReservations.Where(reservation => reservation.Id != id).ToList();
    }

    public void ClearFlightReservation()
    {
        _flightReservations = [];
    }
}