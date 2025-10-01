import { FormControl, FormGroup } from '@angular/forms';
import { hasAnyBlockingErrors } from './form-functions';

describe('form-functions', () => {
  describe('hasAnyBlockingErrors', () => {
    describe('null/undefined formGroup handling', () => {
      it('should return false when formGroup is null', () => {
        testWithExpectedResult(null, false, 'null formGroup');
      });

      it('should return false when formGroup is undefined', () => {
        testWithExpectedResult(undefined, false, 'undefined formGroup');
      });

      it('should return false when formGroup has no controls', () => {
        const formGroup = createFormGroup({});
        testWithExpectedResult(formGroup, false, 'empty formGroup');
      });
    });

    describe('no errors scenarios', () => {
      it('should return false when all controls have no errors', () => {
        const formGroup = createFormGroup({
          field1: new FormControl('value1'),
          field2: new FormControl('value2'),
        });
        testWithExpectedResult(formGroup, false, 'no errors');
      });

      it('should return false when controls have non-blocking errors', () => {
        const formGroup = createFormGroup({
          field1: new FormControl('value1'),
          field2: new FormControl('value2'),
        });
        setErrors(formGroup, 'field1', { customError: true });
        setErrors(formGroup, 'field2', { anotherError: true });
        testWithExpectedResult(formGroup, false, 'non-blocking errors');
      });
    });

    describe('blocking error types', () => {
      it('should return true for required error', () => {
        testBlockingError('required', true);
      });

      it('should return true for maxlength error', () => {
        testBlockingError('maxlength', { requiredLength: 5, actualLength: 10 });
      });

      it('should return true for min error', () => {
        testBlockingError('min', { min: 10, actual: 5 });
      });

      it('should return true for max error', () => {
        testBlockingError('max', { max: 10, actual: 15 });
      });

      it('should return true for invalidTypeaheadObject error', () => {
        testBlockingError('invalidTypeaheadObject', true);
      });
    });

    describe('non-blocking errors', () => {
      it('should return false for custom error', () => {
        testNonBlockingError('customError', true);
      });

      it('should return false for another error', () => {
        testNonBlockingError('anotherError', true);
      });
    });

    describe('complex scenarios', () => {
      it('should return true when multiple controls have blocking errors', () => {
        const formGroup = createFormGroup({
          field1: new FormControl(''),
          field2: new FormControl('value2'),
          field3: new FormControl('value3'),
        });
        setErrors(formGroup, 'field1', { required: true });
        setErrors(formGroup, 'field2', { maxlength: { requiredLength: 5, actualLength: 10 } });
        testWithExpectedResult(formGroup, true, 'multiple blocking errors');
      });

      it('should return true when a control has multiple errors including blocking ones', () => {
        const formGroup = createFormGroup({
          field1: new FormControl('value1'),
          field2: new FormControl('value2'),
        });
        setErrors(formGroup, 'field1', {
          customError: true,
          required: true,
          anotherError: true,
        });
        testWithExpectedResult(formGroup, true, 'mixed blocking and non-blocking errors');
      });

      it('should ignore disabled controls', () => {
        const formGroup = createFormGroup({
          field1: new FormControl(''),
          field2: new FormControl('value2'),
        });
        formGroup.get('field1')?.disable();
        setErrors(formGroup, 'field1', { required: true });
        testWithExpectedResult(formGroup, false, 'disabled control with blocking error');
      });

      it('should return true when disabled control has blocking error but enabled control has no errors', () => {
        const formGroup = createFormGroup({
          field1: new FormControl(''),
          field2: new FormControl('value2'),
        });
        formGroup.get('field1')?.disable();
        setErrors(formGroup, 'field1', { required: true });
        setErrors(formGroup, 'field2', { maxlength: { requiredLength: 5, actualLength: 10 } });
        testWithExpectedResult(
          formGroup,
          true,
          'disabled control ignored but enabled control has blocking error'
        );
      });
    });

    describe('FormControl value handling', () => {
      it('should handle undefined values correctly', () => {
        testFormControlValue(undefined, false);
        testFormControlValue(undefined, true, 'required', true);
        testFormControlValue(undefined, true, 'maxlength', { requiredLength: 5, actualLength: 10 });
        testFormControlValue(undefined, false, 'customError', true);
      });

      it('should handle null values correctly', () => {
        testFormControlValue(null, false);
        testFormControlValue(null, true, 'required', true);
        testFormControlValue(null, true, 'min', { min: 10, actual: 5 });
        testFormControlValue(null, false, 'customError', true);
      });

      it('should handle mixed undefined and null values with blocking errors', () => {
        const formGroup = createFormGroup({
          field1: new FormControl(undefined),
          field2: new FormControl(null),
          field3: new FormControl('value3'),
        });
        setErrors(formGroup, 'field1', { required: true });
        setErrors(formGroup, 'field2', { maxlength: { requiredLength: 5, actualLength: 10 } });
        testWithExpectedResult(formGroup, true, 'mixed undefined/null values with blocking errors');
      });
    });

    describe('edge cases', () => {
      it('should handle empty error objects', () => {
        const formGroup = createFormGroup({
          field1: new FormControl('value1'),
        });
        setErrors(formGroup, 'field1', {});
        testWithExpectedResult(formGroup, false, 'empty error object');
      });

      it('should handle controls with null errors', () => {
        const formGroup = createFormGroup({
          field1: new FormControl('value1'),
          field2: new FormControl('value2'),
        });
        setErrors(formGroup, 'field1', null);
        setErrors(formGroup, 'field2', null);
        testWithExpectedResult(formGroup, false, 'null errors');
      });
    });

    // Helper functions to reduce repetitive code
    const createFormGroup = (controls: Record<string, FormControl>) => new FormGroup(controls);

    const setErrors = (
      formGroup: FormGroup,
      fieldName: string,
      errors: Record<string, unknown> | null
    ) => {
      formGroup.get(fieldName)?.setErrors(errors);
    };

    const testWithExpectedResult = (
      formGroup: FormGroup | null | undefined,
      expectedResult: boolean,
      _description: string
    ) => {
      const result = hasAnyBlockingErrors(formGroup);
      expect(result).toBe(expectedResult);
    };

    const testBlockingError = (
      errorType: string,
      errorValue: unknown,
      expectedResult: boolean = true
    ) => {
      const formGroup = createFormGroup({
        field1: new FormControl('value1'),
        field2: new FormControl('value2'),
      });
      setErrors(formGroup, 'field1', { [errorType]: errorValue });
      testWithExpectedResult(
        formGroup,
        expectedResult,
        `should return ${expectedResult} when control has ${errorType} error`
      );
    };

    const testNonBlockingError = (errorType: string, errorValue: unknown) => {
      const formGroup = createFormGroup({
        field1: new FormControl('value1'),
        field2: new FormControl('value2'),
      });
      setErrors(formGroup, 'field1', { [errorType]: errorValue });
      testWithExpectedResult(
        formGroup,
        false,
        `should return false when control has non-blocking ${errorType} error`
      );
    };

    const testFormControlValue = (
      value: unknown,
      hasError: boolean,
      errorType: string = 'required',
      errorValue: unknown = true
    ) => {
      const formGroup = createFormGroup({
        field1: new FormControl(value),
        field2: new FormControl('value2'),
      });

      if (hasError) {
        setErrors(formGroup, 'field1', { [errorType]: errorValue });
      }

      const expectedResult = hasError;
      testWithExpectedResult(
        formGroup,
        expectedResult,
        `should return ${expectedResult} when FormControl has ${value} value${hasError ? ` with ${errorType} error` : ' and no errors'}`
      );
    };
  });
});
