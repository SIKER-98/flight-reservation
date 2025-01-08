import {Component, inject, OnDestroy} from '@angular/core';
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
import {flightNumberValidator, nameSurnameValidator, noLeadingTrailingSpacesValidator} from '../../validators';
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
export class FlightReservationDialogComponent implements OnDestroy {
  private subscription = new Subscription()
  protected readonly TicketType = TicketType;

  form: FormGroup;
  data: FlightReservationModel = inject(MAT_DIALOG_DATA);

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
      name: 'invalidCharacters',
      message: 'Pole zawiera niepoprawne znaki'
    }
  ]

  constructor(private dialogRef: MatDialogRef<FlightReservationDialogComponent>,
              private flightReservationService: FlightReservationService,
              private fb: FormBuilder) {
    this.form = fb.group({
      fullName: [this.data?.fullName || '', [Validators.required, noLeadingTrailingSpacesValidator(), nameSurnameValidator()]],
      flightNumber: [this.data?.flightNumber || '', [Validators.required, flightNumberValidator(), noLeadingTrailingSpacesValidator()]],
      departureDate: [this.data?.departureDate ? new Date(this.data.departureDate).toISOString().split('T')[0] : '', [Validators.required]],
      departureTime: [this.data?.departureDate ? new Date(this.data.departureDate).toISOString().split('T')[1].slice(0, 5) : '', [Validators.required]],
      arrivalDate: [this.data?.arrivalDate ? new Date(this.data.arrivalDate).toISOString().split('T')[0] : '', [Validators.required]],
      arrivalTime: [this.data?.arrivalDate ? new Date(this.data.arrivalDate).toISOString().split('T')[1].slice(0, 5) : '', [Validators.required]],
      ticketType: [this.data?.ticketType || 1, [Validators.required]],
    })

    this.form.get("departureDate")?.disable();
    this.form.get("arrivalDate")?.disable();
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
