import { AbstractControl, ValidationErrors } from "@angular/forms";

export class NoSpaceValidator {
  static noSpaceValidations(control: AbstractControl): ValidationErrors | null {
    const controlValue = control.value as string;

    // Check if control value is valid and contains spaces
    if (controlValue && controlValue.indexOf(' ') >= 0) {
      return { noSpaceValidator: true };
    }
    return null;
  }
}
