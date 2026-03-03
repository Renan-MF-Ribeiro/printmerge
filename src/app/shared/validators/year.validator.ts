import { AbstractControl, ValidationErrors } from '@angular/forms';

const MIN_YEAR = 2020;
const MAX_YEAR = 2050;

export function yearValidator(control: AbstractControl): ValidationErrors | null {
  const year = Number(control.value);
  if (isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return { invalidYear: `Ano deve estar entre ${MIN_YEAR} e ${MAX_YEAR}` };
  }
  return null;
}
