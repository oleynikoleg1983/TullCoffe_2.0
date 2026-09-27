import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

interface LoginResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private readonly http: HttpClient) {}

  login(emailOrUsername: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', {
      email: emailOrUsername,
      username: emailOrUsername,
      password,
    });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/auth/me');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }
}
