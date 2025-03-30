
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';
  const errors: ValidationErrors = {};

  if (!/[a-z]/.test(value)) {
    errors['noLowercase'] = true;
  }

  if (!/[A-Z]/.test(value)) {
    errors['noUppercase'] = true;
  }

  if (!/[^a-zA-Z0-9]/.test(value)) {
    errors['noSpecial'] = true;
  }

  return Object.keys(errors).length ? errors : null;
}
