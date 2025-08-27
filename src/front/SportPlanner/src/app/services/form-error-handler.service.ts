import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export interface FieldError {
  field: string;
  message: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormErrorHandlerService {

  /**
   * Get user-friendly error message for a form control
   */
  getFieldErrorMessage(control: AbstractControl | null, fieldName: string): string | null {
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    const errors = control.errors;
    const fieldDisplayName = this.getFieldDisplayName(fieldName);

    // Handle common validation errors
    if (errors['required']) {
      return `${fieldDisplayName} es obligatorio`;
    }

    if (errors['email']) {
      return 'Ingresa un email válido';
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${fieldDisplayName} debe tener al menos ${requiredLength} caracteres`;
    }

    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `${fieldDisplayName} no puede exceder ${requiredLength} caracteres`;
    }

    if (errors['min']) {
      const min = errors['min'].min;
      return `${fieldDisplayName} debe ser mayor o igual a ${min}`;
    }

    if (errors['max']) {
      const max = errors['max'].max;
      return `${fieldDisplayName} debe ser menor o igual a ${max}`;
    }

    if (errors['pattern']) {
      return this.getPatternErrorMessage(fieldName, errors['pattern']);
    }

    if (errors['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }

    if (errors['passwordStrength']) {
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
    }

    if (errors['uniqueEmail']) {
      return 'Este email ya está registrado';
    }

    if (errors['uniqueName']) {
      return 'Este nombre ya está en uso';
    }

    // Handle custom validation errors
    if (errors['custom']) {
      return errors['custom'].message || `${fieldDisplayName} no es válido`;
    }

    // Default error message
    return `${fieldDisplayName} no es válido`;
  }

  /**
   * Get all error messages for a form
   */
  getFormErrors(form: FormGroup): FieldError[] {
    const errors: FieldError[] = [];

    Object.keys(form.controls).forEach(fieldName => {
      const control = form.get(fieldName);
      const errorMessage = this.getFieldErrorMessage(control, fieldName);
      
      if (errorMessage) {
        const errorType = this.getFirstErrorType(control?.errors || null);
        errors.push({
          field: fieldName,
          message: errorMessage,
          type: errorType
        });
      }
    });

    return errors;
  }

  /**
   * Check if a field has a specific error
   */
  hasFieldError(control: AbstractControl | null, errorType: string): boolean {
    return !!(control && control.errors && control.errors[errorType] && control.touched);
  }

  /**
   * Check if a field is invalid and touched
   */
  isFieldInvalid(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Mark all fields in a form as touched to trigger validation display
   */
  markAllFieldsAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(fieldName => {
      const control = form.get(fieldName);
      if (control) {
        control.markAsTouched();
        
        // Handle nested form groups
        if (control instanceof FormGroup) {
          this.markAllFieldsAsTouched(control);
        }
      }
    });
  }

  /**
   * Get CSS classes for form field based on validation state
   */
  getFieldClasses(control: AbstractControl | null, baseClasses: string = ''): string {
    const classes = [baseClasses];
    
    if (control) {
      if (control.valid && control.touched) {
        classes.push('border-success-500 focus:border-success-500 focus:ring-success-500');
      } else if (control.invalid && control.touched) {
        classes.push('border-error-500 focus:border-error-500 focus:ring-error-500');
      } else {
        classes.push('border-secondary-300 focus:border-primary-600 focus:ring-primary-600');
      }
    }
    
    return classes.filter(Boolean).join(' ');
  }

  /**
   * Handle server validation errors and apply them to the form
   */
  handleServerValidationErrors(form: FormGroup, serverErrors: any): void {
    if (typeof serverErrors === 'object' && serverErrors !== null) {
      Object.keys(serverErrors).forEach(fieldName => {
        const control = form.get(fieldName);
        if (control) {
          const errorMessage = Array.isArray(serverErrors[fieldName]) 
            ? serverErrors[fieldName][0] 
            : serverErrors[fieldName];
          
          control.setErrors({
            server: { message: errorMessage }
          });
          control.markAsTouched();
        }
      });
    }
  }

  /**
   * Clear server validation errors from a form
   */
  clearServerErrors(form: FormGroup): void {
    Object.keys(form.controls).forEach(fieldName => {
      const control = form.get(fieldName);
      if (control && control.errors) {
        delete control.errors['server'];
        
        // If no other errors, set to null
        if (Object.keys(control.errors).length === 0) {
          control.setErrors(null);
        }
      }
    });
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      'name': 'El nombre',
      'email': 'El email',
      'password': 'La contraseña',
      'confirmPassword': 'La confirmación de contraseña',
      'firstName': 'El nombre',
      'lastName': 'El apellido',
      'sport': 'El deporte',
      'category': 'La categoría',
      'gender': 'El género',
      'level': 'El nivel',
      'description': 'La descripción',
      'phone': 'El teléfono',
      'address': 'La dirección',
      'birthDate': 'La fecha de nacimiento'
    };

    return displayNames[fieldName] || `El campo ${fieldName}`;
  }

  private getPatternErrorMessage(fieldName: string, patternError: any): string {
    const patternMessages: Record<string, string> = {
      'email': 'Ingresa un email válido',
      'phone': 'Ingresa un número de teléfono válido',
      'password': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    };

    return patternMessages[fieldName] || 'El formato no es válido';
  }

  private getFirstErrorType(errors: ValidationErrors | null): string {
    if (!errors) return '';
    return Object.keys(errors)[0];
  }
}