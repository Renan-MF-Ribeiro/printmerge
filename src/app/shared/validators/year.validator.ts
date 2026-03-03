import { AbstractControl, ValidationErrors } from '@angular/forms';

export function yearValidator(control: AbstractControl): ValidationErrors | null {
  const year = Number(control.value);
  if (isNaN(year) || year < 2020 || year > 2050) {
    return { invalidYear: 'Ano deve estar entre 2020 e 2050' };
  }
  return null;
}
