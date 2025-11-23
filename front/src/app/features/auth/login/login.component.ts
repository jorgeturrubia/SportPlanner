import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule, CommonModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string | null = null;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    async onSubmit() {
        if (this.loginForm.invalid) return;

        this.isLoading = true;
        this.errorMessage = null;

        const { email, password } = this.loginForm.value;

        try {
            const { error } = await this.authService.signIn(email, password);
            
            if (error) {
                this.errorMessage = error.message;
            } else {
                this.router.navigate(['/dashboard']);
            }
        } catch (err: any) {
            this.errorMessage = 'Ocurrió un error inesperado.';
            console.error(err);
        } finally {
            this.isLoading = false;
        }
    }
}
