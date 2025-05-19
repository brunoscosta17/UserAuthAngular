import { computed, effect, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
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

    return fetch('https://localhost:7026/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, refreshToken })
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data?.token) return false;
        this.login(data.user, data.token, data.refreshToken);
        return true;
      })
      .catch(() => false);
  }
}
