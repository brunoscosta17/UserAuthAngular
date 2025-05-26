import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { AuthHttpService } from './auth-http.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authHttp = inject(AuthHttpService);
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  constructor() {
    const saved = localStorage.getItem('user');
    if (saved) this._user.set(JSON.parse(saved));

    effect(() => {
      const current = this._user();
      if (current) {
        localStorage.setItem('user', JSON.stringify(current));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    });
  }

  login(user: User, token: string, refreshToken?: string) {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    this._user.set(user);
  }

  logout() {
    this._user.set(null);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  refreshToken(): Promise<boolean> {
  const user = this._user();
  const refreshToken = localStorage.getItem('refreshToken');
  const email = user?.email;

  if (!refreshToken || !email) return Promise.resolve(false);

  return lastValueFrom(this.authHttp.refreshToken(email, refreshToken))
    .then(data => {
      this.login(data.user, data.token, data.refreshToken);
      return true;
    })
    .catch(() => false);
}

}
