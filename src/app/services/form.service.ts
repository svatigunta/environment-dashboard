import { FormGroup, ValidationErrors } from '@angular/forms';

const BLOCKING_ERRORS = new Set(['required', 'maxlength', 'min', 'max', 'invalidTypeaheadObject']);

export function hasAnyBlockingErrors(formGroup: FormGroup | null | undefined): boolean {
  if (!formGroup?.controls) return false;

  const controls = formGroup.controls;
  for (const name in controls) {
    const control = controls[name];

    if (control.disabled) continue;

    const errors: ValidationErrors | null = control.errors;
    if (!errors) continue;

    for (const key in errors) {
      if (BLOCKING_ERRORS.has(key)) return true;
    }
  }
  return false;
}
