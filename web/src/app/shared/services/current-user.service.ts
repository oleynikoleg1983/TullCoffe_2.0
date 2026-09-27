import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserApiService } from './user-api.service';

const TOKEN_KEY = 'tull_coffee_token';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private readonly userApiService: UserApiService) {
    this.loadCurrentUser();
  }

  private setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(emailOrUsername: string, password: string): Observable<User> {
    return new Observable<User>((observer) => {
      this.userApiService.login(emailOrUsername, password).subscribe({
        next: ({ accessToken, user }) => {
          this.setToken(accessToken);
          this.setCurrentUser(user);
          observer.next(user);
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }

  loadCurrentUser(): void {
    const token = this.getToken();

    if (!token) {
      this.currentUserSubject.next(null);
      return;
    }

    this.userApiService.getCurrentUser().subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => {
        this.setToken(null);
        this.currentUserSubject.next(null);
      },
    });
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  clearCurrentUser(): void {
    this.setToken(null);
    this.currentUserSubject.next(null);
  }
}
