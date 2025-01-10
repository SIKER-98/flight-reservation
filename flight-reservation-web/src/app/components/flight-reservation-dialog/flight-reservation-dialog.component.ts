import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FlightReservationService} from '../../services';
import {
  CreateFlightReservationModel,
  FlightReservationModel,
  InputErrorModel,
  UpdateFlightReservationModel
} from '../../models';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {TicketType} from '../../constants';
import {
  dateRangeValidator,
  flightNumberValidator,
  nameSurnameValidator,
  noLeadingTrailingSpacesValidator
} from '../../validators';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';


@Component({
  selector: 'app-flight-reservation-dialog',
  templateUrl: 'flight-reservation-dialog.component.html',
  styleUrl: 'flight-reservation-dialog.component.scss',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    NgIf,
    MatSelect,
    MatOption,
    MatIcon,
    MatTooltip,
    MatTimepickerToggle,
    MatTimepicker,
    MatTimepickerInput,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ],
})
export class FlightReservationDialogComponent {
  protected readonly TicketType = TicketType;

  form!: FormGroup;
  data: FlightReservationModel = inject(MAT_DIALOG_DATA);
  minDate: Date = new Date(2000, 0, 1)
  maxDate: Date = new Date();

  formError: InputErrorModel[] = [
    {
      name: 'required',
      message: 'Pole nie może być puste'
    },
    {
      name: 'noLeadingTrailingSpaces',
      message: 'Pole nie może zawierać spacji na początku i końcu',
    },
    {
      name: 'invalidFlightNumber',
      message: 'Niepoprawny numer lotu'
    },
    {
      name: 'tooEarlyDate',
      message: 'Data przylotu musi być później niż data odlotu'
    },
    {
      name: 'invalidFlightNumber',
      message: 'Niepoprawny numer lotu'
    },
    {
      name: 'invalidFullName',
      message: 'Niepoprawne imię i nazwisko'
    },
    {
      name: 'invalidDateTimeOrder',
      message: 'Data wylotu nie może być później niż data przylotu'
    },
    {
      name: 'dateOutOfRange',
      message: 'Data spoza zakresu'
    }
  ]

  constructor(private dialogRef: MatDialogRef<FlightReservationDialogComponent>,
              private flightReservationService: FlightReservationService,
              private fb: FormBuilder) {
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10);

    this.form = this.fb.group({
      fullName: [this.data?.fullName || '', [Validators.required, noLeadingTrailingSpacesValidator(), nameSurnameValidator()]],
      flightNumber: [this.data?.flightNumber || '', [Validators.required, flightNumberValidator(), noLeadingTrailingSpacesValidator()]],
      departureDate: [this.data?.departureDate ? new Date(this.data.departureDate) : null, [Validators.required, dateRangeValidator()]],
      departureTime: [this.data?.departureDate ? new Date(this.data.departureDate) : null, [Validators.required]],
      arrivalDate: [this.data?.arrivalDate ? new Date(this.data.arrivalDate) : null, [Validators.required, dateRangeValidator()]],
      arrivalTime: [this.data?.arrivalDate ? new Date(this.data.arrivalDate) : null, [Validators.required]],
      ticketType: [this.data?.ticketType || 1, [Validators.required]],
    });
    this.form.get("departureDate")?.disable();
    this.form.get("arrivalDate")?.disable();
  }

  get departureDateControl() {
    return this.form.get('departureDate');
  }

  get arrivalDateControl() {
    return this.form.get('arrivalDate');
  }

  save(): void {
    if (this.form.invalid || this.dateTimeOrderValidator(this.form)) {
      return;
    }

    const payload = {
      ...this.form.value,
      departureDate: this.joinDateWithTime(this.form.getRawValue()['departureDate'], this.form.value.departureTime),
      arrivalDate: this.joinDateWithTime(this.form.getRawValue()['arrivalDate'], this.form.value.arrivalTime),
    }

    delete payload.departureTime;
    delete payload.arrivalTime;

    const apiCall = this.data
      ? this.flightReservationService.updateFlightReservation({
        id: this.data.id,
        ...payload
      } as UpdateFlightReservationModel)
      : this.flightReservationService.createFlightReservation(payload as CreateFlightReservationModel);

    apiCall.subscribe(() => this.dialogRef.close(true));
  }

  private joinDateWithTime(date: Date, time: Date): Date {
    const joinedDate = new Date();
    joinedDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    joinedDate.setHours(time.getHours(), time.getMinutes(), 0);
    return joinedDate;
  }

  close(): void {
    this.dialogRef.close();
  }

  getErrorMessage(errors: ValidationErrors | null | undefined): string | null {
    if (!errors) {
      return null
    }

    const formError = Object.keys(errors)[0]
    const errorMessage = this.formError.find(error => error.name === formError)

    if (!errorMessage) {
      return "Źle wypełnione pole"
    }

    return errorMessage.message
  }

  dateTimeOrderValidator(group: AbstractControl): ValidationErrors | null {
    if (!group.getRawValue()['departureDate'] || !group.get('departureTime')?.value || !group.getRawValue()['arrivalDate'] || !group.get('arrivalTime')?.value) {
      return null;
    }

    const departureDate = new Date(group.getRawValue()['departureDate']);
    const departureTime = new Date(group.get('departureTime')?.value);
    const arrivalDate = new Date(group.getRawValue()['arrivalDate']);
    const arrivalTime = new Date(group.get('arrivalTime')?.value);

    const departure = this.joinDateWithTime(departureDate, departureTime);
    const arrival = this.joinDateWithTime(arrivalDate, arrivalTime);

    if (departure >= arrival) {
      return {invalidDateTimeOrder: true};
    }

    return null;
  }

  updateDepartureDate(date: Date | null): void {
    if (date) {

      this.departureDateControl?.setValue(date);
      this.departureDateControl?.updateValueAndValidity();

      const arrivalControl = this.arrivalDateControl;
      arrivalControl?.updateValueAndValidity();
    }
  }

  updateArrivalDate(date: Date | null): void {
    if (date) {
      this.arrivalDateControl?.setValue(date);
      this.arrivalDateControl?.updateValueAndValidity();

      const departureControl = this.departureDateControl;
      departureControl?.updateValueAndValidity();
    }
  }
}
