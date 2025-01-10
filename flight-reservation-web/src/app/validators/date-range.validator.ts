import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null

    const date = new Date(control.value);
    const year2000 = new Date(2000, 0, 1);
    const tenYearsFromNow = new Date();
    tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);

    if (date < year2000 || date > tenYearsFromNow) {
      return {dateOutOfRange: true};
    }

    return null;
  };
}
