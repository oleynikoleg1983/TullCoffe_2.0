import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'Олег',
      email: 'oleg@example.com',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Марія',
      email: 'maria@example.com',
      role: 'shop'
    }
  ];

  constructor(private readonly userApiService: UserApiService) {}

  getUsers(): Observable<User[]> {
    return this.userApiService.getUsers().pipe(catchError(() => of(this.users)));
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.userApiService.getUser(id).pipe(
      catchError(() => of(this.users.find((user) => user.id === id)))
    );
  }
}
