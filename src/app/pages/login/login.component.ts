import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

    private fb: FormBuilder = inject(FormBuilder);
    private http: HttpClient = inject(HttpClient);
    private auth: AuthService = inject(AuthService);
    private router: Router = inject(Router);

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    this.http.post<any>('https://localhost:7026/api/auth/login', this.form.value)
      .subscribe({
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
