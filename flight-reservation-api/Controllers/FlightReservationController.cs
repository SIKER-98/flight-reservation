using flight_reservation_api.Services.FlightBookingService.Models;
using flight_reservation_api.Services.FlightBookingService.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace flight_reservation_api.Controllers;

[ApiController]
[Route("api/flightReservation")]
public class FlightReservationController : ControllerBase
{
    private readonly FlightBookingService _flightBookingService;
    private readonly IValidator<CreateFlightReservationDto> _createFlightReservationDtoValidator;
    private readonly IValidator<UpdateFlightReservationDto> _updateFlightReservationDtoValidator;

    public FlightReservationController(FlightBookingService flightBookingService,
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
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateFlightReservationAsync(CreateFlightReservationDto dto)
    {
        var validationResult = await _createFlightReservationDtoValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest();
        }

        var createResult = _flightBookingService.CreateFlightReservation(dto);
        return Ok(createResult);
    }

    [HttpPut]
    [ProducesResponseType<FlightReservationDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateFlightReservation(UpdateFlightReservationDto dto)
    {
        var validationResult = await _updateFlightReservationDtoValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest();
        }

        _flightBookingService.UpdateFlightReservation(dto);
        return Ok();
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public IActionResult ClearFlightReservations()
    {
        _flightBookingService.ClearFlightReservation();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public IActionResult DeleteFlightReservation(Guid id)
    {
        _flightBookingService.DeleteFlightReservation(id);
        return NoContent();
    }
}