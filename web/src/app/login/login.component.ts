import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CurrentUserService } from '../shared/services/current-user.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
})
export class LoginComponent {
  readonly form;

  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly currentUserService: CurrentUserService,
    private readonly router: Router,
  ) {
    this.form = this.fb.nonNullable.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isFieldInvalid(fieldName: 'login' | 'password'): boolean {
    const field = this.form.controls[fieldName];
    return field.invalid && (field.touched || field.dirty);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Please fix validation errors before signing in.';
      return;
    }

    const { login, password } = this.form.getRawValue();

    this.loading = true;
    this.errorMessage = '';

    this.currentUserService
      .login(login.trim(), password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
      next: (user: User) => {
        const targetRoute = user.role === 'admin' || user.role === 'manager' ? '/admin' : '/shop';
        this.router.navigate([targetRoute]);
      },
      error: () => {
        this.errorMessage = 'Invalid credentials. Please check your login and password.';
      },
    });
  }
}
