import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthHttpService } from '../../services/auth-http.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private nonNullableFb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private authHttp = inject(AuthHttpService);
  private router: Router = inject(Router);

  success = '';
  error = '';
  loading = false;

  form: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor() {
    this.form = this.nonNullableFb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authHttp.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.success = 'User successfully registered!';
        this.form.reset();
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Registration failed.';
        this.loading = false;
      },
    });
  }

}
