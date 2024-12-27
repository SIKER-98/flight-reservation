import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function flightNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const regex = /^[a-zA-Z]{2,3}\d{1,4}$/;

    if (!value) {
      return null;
    }

    if (regex.test(value)) {
      return null;
    }

    return {invalidFlightNumber: true};
  };
}
