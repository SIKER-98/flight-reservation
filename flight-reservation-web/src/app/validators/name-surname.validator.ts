import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function nameSurnameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // walidowanie wieloczłonowych imion i nazwisk w różnych językach uwzględniając myślniki, spacje i apostrofy
    const regex = /^\p{L}+(?:[-' ]\p{L}+)*\s+\p{L}+(?:[-' ]\p{L}+)*(?:\s+\p{L}+(?:[-' ]\p{L}+)*)?$/u

    if (!value) {
      return null;
    }

    if (regex.test(value)) {
      return null;
    }

    return {invalidCharacters: true};
  };
}
