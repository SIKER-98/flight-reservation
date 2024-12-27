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
    }
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data: FlightReservationModel,
              private dialogRef: MatDialogRef<FlightReservationDialogComponent>,
              private flightReservationService: FlightReservationService,
              private fb: FormBuilder) {
    console.log(data)
    this.form = fb.group({
      fullName: [data?.fullName || '', [Validators.required]],
      flightNumber: [data?.flightNumber || '', [Validators.required]],
      departureDate: [data?.departureDate || new Date(), [Validators.required]],
      arrivalDate: [data?.arrivalDate || new Date(), [Validators.required]],
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
    if (this.data) {
      this.flightReservationService.updateFlightReservation({
        id: this.data.id,
        ...this.form.value
      } as UpdateFlightReservationModel)
        .subscribe(() => this.dialogRef.close(true));
      return
    } else {
      this.flightReservationService.createFlightReservation({
        ...this.form.value
      } as CreateFlightReservationModel)
        .subscribe(() => this.dialogRef.close(true));
    }
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
