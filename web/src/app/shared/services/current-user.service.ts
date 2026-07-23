import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly fallbackUser: User = {
    id: 1,
    name: 'Олег',
    email: 'oleg@example.com',
    role: 'admin'
  };

  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private readonly userApiService: UserApiService) {}

  loadCurrentUser(userId: number): void {
    this.setCurrentUser(this.fallbackUser);

    this.userApiService.getUser(userId).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next(this.fallbackUser)
    });
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
}
