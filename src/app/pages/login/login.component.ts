import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthHttpService } from '../../services/auth-http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private auth: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private authHttp: AuthHttpService = inject(AuthHttpService);
  private nonNullableFb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  loading = false;
  error: string | null = null;

  form: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor() {
  this.form = this.nonNullableFb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
}
  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;

    const { email, password } = this.form.getRawValue();
    if (!email || !password) return;

    this.authHttp.login({ email, password }).subscribe({
      next: (res) => {
        this.auth.login(res.user, res.token);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Login failed.';
        this.loading = false;
      }
    });
  }
}
