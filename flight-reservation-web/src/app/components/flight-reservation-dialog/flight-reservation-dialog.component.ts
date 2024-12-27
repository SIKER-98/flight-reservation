import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
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
import {Subscription} from 'rxjs';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {flightNumberValidator, noLeadingTrailingSpacesValidator} from '../../validators';


@Component({
  selector: 'app-flight-reservation-dialog',
  templateUrl: 'flight-reservation-dialog.component.html',
  styleUrl: 'flight-reservation-dialog.component.scss',
  standalone: true,
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
    MatTimepicker,
    MatTimepickerToggle,
    MatTimepickerInput,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ],
})
export class FlightReservationDialogComponent implements OnDestroy {
  private subscription = new Subscription()
  protected readonly TicketType = TicketType;

  form: FormGroup;

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
    }
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data: FlightReservationModel,
              private dialogRef: MatDialogRef<FlightReservationDialogComponent>,
              private flightReservationService: FlightReservationService,
              private fb: FormBuilder) {
    this.form = fb.group({
      fullName: [data?.fullName || '', [Validators.required, noLeadingTrailingSpacesValidator()]],
      flightNumber: [data?.flightNumber || '', [Validators.required, flightNumberValidator(), noLeadingTrailingSpacesValidator()]],
      departureDate: [data?.departureDate ? new Date(data.departureDate).toISOString().split('T')[0] : '', [Validators.required]],
      departureTime: [data?.departureDate ? new Date(data.departureDate).toISOString().split('T')[1].slice(0, 5) : '', [Validators.required]],
      arrivalDate: [data?.arrivalDate ? new Date(data.arrivalDate).toISOString().split('T')[0] : '', [Validators.required]],
      arrivalTime: [data?.arrivalDate ? new Date(data.arrivalDate).toISOString().split('T')[1].slice(0, 5) : '', [Validators.required]],
      ticketType: [data?.ticketType || 1, [Validators.required]],
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const payload = {
      ...this.form.value,
      departureDate: new Date(`${this.form.value.departureDate}T${this.form.value.departureTime}`),
      arrivalDate: new Date(`${this.form.value.arrivalDate}T${this.form.value.arrivalTime}`),
    }
    delete payload.departureTime;
    delete payload.arrivalTime;

    console.log(this.form.value)
    const apiCall = this.data
      ? this.flightReservationService.updateFlightReservation({
        id: this.data.id,
        ...payload
      } as UpdateFlightReservationModel)
      : this.flightReservationService.createFlightReservation(payload as CreateFlightReservationModel);

    apiCall.subscribe(() => this.dialogRef.close(true));
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
}
