using System.Text.Json;
using AutoMapper;
using flight_reservation_api.Services.FlightBookingService.Data;
using flight_reservation_api.Services.FlightBookingService.Models;

namespace flight_reservation_api.Services.FlightBookingService.Services;

public interface IFlightBookingService
{
    List<FlightReservationDto> GetAllFlightReservations();
    FlightReservationDto? GetFlightReservationById(Guid id);
    Task<FlightReservationDto> CreateFlightReservationAsync(CreateFlightReservationDto dto);
    Task<FlightReservationDto?> UpdateFlightReservationAsync(UpdateFlightReservationDto dto);
    Task DeleteFlightReservationAsync(Guid id);
    Task ClearFlightReservationAsync();
}

public class FlightBookingService : IFlightBookingService
{
    private const string DatabaseDir = "db";
    private const string DatabasePath = "db/flightReservations.json";
    private static List<FlightReservation> _flightReservations = LoadFlightReservations();

    private readonly IMapper _flightReservationMapper;

    public FlightBookingService(IMapper flightReservationMapper)
    {
        _flightReservationMapper = flightReservationMapper;
    }

    /// <summary>
    /// Pobranie danych o rezerwacji lotniczych z pliku
    /// </summary>
    /// <returns>Rezerwacje lotnicze</returns>
    private static List<FlightReservation> LoadFlightReservations()
    {
        if (!File.Exists(DatabasePath))
        {
            return [];
        }

        var jsonData = File.ReadAllText(DatabasePath);
        return JsonSerializer.Deserialize<List<FlightReservation>>(jsonData) ?? [];
    }

    /// <summary>
    /// Aktualizacja pliku z rezerwacjami
    /// </summary>
    private async Task SaveFlightReservationsAsync()
    {
        if (!Directory.Exists(DatabaseDir))
        {
            Directory.CreateDirectory(DatabaseDir);
        }

        var jsonData = JsonSerializer.Serialize(_flightReservations);
        await File.WriteAllTextAsync(DatabasePath, jsonData);
    }

    /// <summary>
    /// Pobranie listy rezerwacji lotniczych
    /// </summary>
    /// <returns>Lista rezerwacji lotniczych</returns>
    public List<FlightReservationDto> GetAllFlightReservations()
    {
        return _flightReservationMapper.Map<List<FlightReservationDto>>(_flightReservations);
    }

    /// <summary>
    /// Pobranie informacji o konkretnej rezerwacji
    /// </summary>
    /// <param name="id">Identyfikator rezerwacji</param>
    /// <returns>Wyszukana rezerwacja lub null</returns>
    public FlightReservationDto? GetFlightReservationById(Guid id)
    {
        var flightReservation = _flightReservations.FirstOrDefault(reservation => reservation.Id == id);

        if (flightReservation is null)
        {
            return null;
        }

        return _flightReservationMapper.Map<FlightReservationDto>(flightReservation);
    }

    /// <summary>
    /// Tworzenie nowej rezerwacji
    /// </summary>
    /// <param name="dto">Dane potrzebne do utworzenia rezerwacji</param>
    /// <returns>Utworzona rezerwacja</returns>
    public async Task<FlightReservationDto> CreateFlightReservationAsync(CreateFlightReservationDto dto)
    {
        var newFlightReservation = _flightReservationMapper.Map<FlightReservation>(dto);
        _flightReservations.Add(newFlightReservation);
        await SaveFlightReservationsAsync();
        return _flightReservationMapper.Map<FlightReservationDto>(newFlightReservation);
    }

    /// <summary>
    /// Aktualizacja informacji o rezerwacji
    /// </summary>
    /// <param name="dto">Dane potrzebne do aktualizacji rezerwacji</param>
    /// <returns>Zaktualizowany obiekt lub null</returns>
    public async Task<FlightReservationDto?> UpdateFlightReservationAsync(UpdateFlightReservationDto dto)
    {
        var flightReservationIndex = _flightReservations
            .FindIndex(reservation => reservation.Id == dto.Id);

        if (flightReservationIndex < 0)
        {
            return null;
        }

        var updatedFlightReservation = _flightReservationMapper.Map<FlightReservation>(dto);
        _flightReservations[flightReservationIndex] = updatedFlightReservation;
        await SaveFlightReservationsAsync();

        return _flightReservationMapper.Map<FlightReservationDto>(updatedFlightReservation);
    }

    /// <summary>
    /// Usunięcie konkretnej rezerwacji
    /// </summary>
    /// <param name="id">Identyfikator rezerwacji</param>
    public async Task DeleteFlightReservationAsync(Guid id)
    {
        _flightReservations = _flightReservations.Where(reservation => reservation.Id != id).ToList();
        await SaveFlightReservationsAsync();
    }

    /// <summary>
    /// Usunięcie rezerwacji
    /// </summary>
    public async Task ClearFlightReservationAsync()
    {
        _flightReservations = [];
        await SaveFlightReservationsAsync();
    }
}