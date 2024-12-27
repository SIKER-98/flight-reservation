import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noLeadingTrailingSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = control.value && control.value === control.value.trim();
    return isValid ? null : { noLeadingTrailingSpaces: true };
  };
}
