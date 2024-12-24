using flight_reservation_api.Services.FlightBookingService.Models;
using flight_reservation_api.Services.FlightBookingService.Services;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

namespace flight_reservation_api.Controllers;

[ApiController]
[Route("api/flightReservation")]
public class FlightReservationController : ControllerBase
{
    private readonly IFlightBookingService _flightBookingService;
    private readonly IValidator<CreateFlightReservationDto> _createFlightReservationDtoValidator;
    private readonly IValidator<UpdateFlightReservationDto> _updateFlightReservationDtoValidator;

    public FlightReservationController(IFlightBookingService flightBookingService,
        IValidator<UpdateFlightReservationDto> updateFlightReservationDtoValidator,
        IValidator<CreateFlightReservationDto> createFlightReservationDtoValidator)
    {
        _flightBookingService = flightBookingService;
        _updateFlightReservationDtoValidator = updateFlightReservationDtoValidator;
        _createFlightReservationDtoValidator = createFlightReservationDtoValidator;
    }

    [HttpGet]
    [ProducesResponseType<List<FlightReservationDto>>(StatusCodes.Status200OK)]
    public IActionResult GetFlightReservations()
    {
        return Ok(_flightBookingService.GetAllFlightReservations());
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<FlightReservationDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetFlightReservation(Guid id)
    {
        var getResult = _flightBookingService.GetFlightReservationById(id);

        if (getResult is null)
        {
            return NotFound();
        }

        return Ok(getResult);
    }

    [HttpPost]
    [ProducesResponseType<FlightReservationDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<List<ValidationFailure>>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateFlightReservationAsync(CreateFlightReservationDto dto)
    {
        var validationResult = await _createFlightReservationDtoValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var createResult = await _flightBookingService.CreateFlightReservationAsync(dto);
        return Ok(createResult);
    }

    [HttpPut]
    [ProducesResponseType<FlightReservationDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<List<ValidationFailure>>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateFlightReservationAsync(UpdateFlightReservationDto dto)
    {
        var validationResult = await _updateFlightReservationDtoValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var updateResult = await _flightBookingService.UpdateFlightReservationAsync(dto);

        if (updateResult is null)
        {
            return NotFound();
        }

        return Ok(updateResult);
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> ClearFlightReservationsAsync()
    {
        await _flightBookingService.ClearFlightReservationAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteFlightReservationAsync(Guid id)
    {
        await _flightBookingService.DeleteFlightReservationAsync(id);
        return NoContent();
    }
}