import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    registerForm: FormGroup;
    errorMessage: string | null = null;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    async onSubmit() {
        if (this.registerForm.invalid) return;

        this.isLoading = true;
        this.errorMessage = null;

        const { name, email, password } = this.registerForm.value;

        try {
            const { data, error } = await this.authService.signUp(email, password, name);
            
            if (error) {
                this.errorMessage = error.message;
            } else {
                // Check if we have a session (auto-login successful)
                const session = data?.session;
                
                if (session) {
                    // Auto-login successful, redirect to subscription
                    this.router.navigate(['/subscription']);
                } else {
                    // Email verification might be required
                    this.router.navigate(['/login'], { queryParams: { registered: true } });
                }
            }
        } catch (err: any) {
            this.errorMessage = 'Ocurrió un error inesperado.';
            console.error(err);
        } finally {
            this.isLoading = false;
        }
    }
}
