using flight_reservation_api.Controllers;
using flight_reservation_api.Services.FlightBookingService.Data;
using flight_reservation_api.Services.FlightBookingService.Models;
using flight_reservation_api.Services.FlightBookingService.Services;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace flight_reservation_api;

public class FlightReservationControllerTests
{
    private readonly Mock<IFlightBookingService> _flightBookingServiceMock;
    private readonly Mock<IValidator<CreateFlightReservationDto>> _createValidatorMock;
    private readonly Mock<IValidator<UpdateFlightReservationDto>> _updateValidatorMock;
    private readonly FlightReservationController _controller;

    public FlightReservationControllerTests()
    {
        _flightBookingServiceMock = new Mock<IFlightBookingService>();
        _createValidatorMock = new Mock<IValidator<CreateFlightReservationDto>>();
        _updateValidatorMock = new Mock<IValidator<UpdateFlightReservationDto>>();

        _controller = new FlightReservationController(
            _flightBookingServiceMock.Object,
            _updateValidatorMock.Object,
            _createValidatorMock.Object);
    }

    [Fact]
    public void GetFlightReservations_ReturnsOkWithReservations()
    {
        // Arrange
        var reservations = new List<FlightReservationDto>
        {
            new FlightReservationDto(Guid.NewGuid(), "John Doe", "FL123", DateTime.UtcNow, DateTime.UtcNow.AddHours(2),
                TicketType.Economic)
        };
        _flightBookingServiceMock.Setup(s => s.GetAllFlightReservations()).Returns(reservations);

        // Act
        var result = _controller.GetFlightReservations();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(reservations, okResult.Value);
    }

    [Fact]
    public void GetFlightReservation_NotFoundWhenReservationDoesNotExist()
    {
        // Arrange
        _flightBookingServiceMock.Setup(s => s.GetFlightReservationById(It.IsAny<Guid>()))
            .Returns<FlightReservationDto>(null);

        // Act
        var result = _controller.GetFlightReservation(Guid.NewGuid());

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task CreateFlightReservationAsync_BadRequestWhenValidationFails()
    {
        // Arrange
        var dto = new CreateFlightReservationDto("", "", DateTime.UtcNow, DateTime.UtcNow.AddHours(2),
            TicketType.Economic);
        var validationErrors = new List<ValidationFailure> { new ValidationFailure("Field", "Error") };
        _createValidatorMock.Setup(v => v.ValidateAsync(dto, default))
            .ReturnsAsync(new ValidationResult(validationErrors));

        // Act
        var result = await _controller.CreateFlightReservationAsync(dto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(validationErrors, badRequestResult.Value);
    }


    [Fact]
    public async Task CreateFlightReservationAsync_CreatesAndReturnsReservation()
    {
        // Arrange
        var dto = new CreateFlightReservationDto("Jane Smith", "FL456", DateTime.UtcNow, DateTime.UtcNow.AddHours(3),
            TicketType.Business);
        var createdReservation = new FlightReservationDto(Guid.NewGuid(), dto.FullName, dto.FlightNumber,
            dto.DepartureDate, dto.ArrivalDate, dto.TicketType);
        _createValidatorMock.Setup(v => v.ValidateAsync(dto, default)).ReturnsAsync(new ValidationResult());
        _flightBookingServiceMock.Setup(s => s.CreateFlightReservationAsync(dto)).ReturnsAsync(createdReservation);

        // Act
        var result = await _controller.CreateFlightReservationAsync(dto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(createdReservation, okResult.Value);
    }

    [Fact]
    public async Task UpdateFlightReservationAsync_UpdatesSuccessfully()
    {
        // Arrange
        var dto = new UpdateFlightReservationDto(Guid.NewGuid(), "Charlie Davis", "FL101", DateTime.UtcNow,
            DateTime.UtcNow.AddHours(5), TicketType.Business);
        var updatedReservation = new FlightReservationDto(dto.Id, dto.FullName, dto.FlightNumber, dto.DepartureDate,
            dto.ArrivalDate, dto.TicketType);
        _updateValidatorMock.Setup(v => v.ValidateAsync(dto, default)).ReturnsAsync(new ValidationResult());
        _flightBookingServiceMock.Setup(s => s.UpdateFlightReservationAsync(dto)).ReturnsAsync(updatedReservation);

        // Act
        var result = await _controller.UpdateFlightReservationAsync(dto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(updatedReservation, okResult.Value);
    }

    [Fact]
    public async Task DeleteFlightReservationAsync_DeletesSuccessfully()
    {
        // Arrange
        var id = Guid.NewGuid();
        _flightBookingServiceMock.Setup(s => s.DeleteFlightReservationAsync(id)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.DeleteFlightReservationAsync(id);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task ClearFlightReservationsAsync_DeletesAllReservations()
    {
        // Arrange
        _flightBookingServiceMock.Setup(s => s.ClearFlightReservationAsync()).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.ClearFlightReservationsAsync();

        // Assert
        Assert.IsType<NoContentResult>(result);
    }
}