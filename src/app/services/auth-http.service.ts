import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AuthHttpService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  register(data: { name: string; email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }

  refreshToken(email: string, refreshToken: string) {
    return this.http.post<any>(`${this.baseUrl}/refresh-token`, {
      email,
      refreshToken
    });
  }
}
