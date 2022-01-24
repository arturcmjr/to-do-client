import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatch(
  control: AbstractControl
): ValidationErrors | null {
  const passwordControl = control.parent?.get('password');
  if (!control.value) return null;
  const isMatching =
    !!control.value &&
    !!control.parent &&
    !!control.parent.value &&
    control.value === passwordControl?.value;
  return isMatching ? null : { notMatching: true };
}
