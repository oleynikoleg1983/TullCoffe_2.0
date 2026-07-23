import { Component, OnInit } from '@angular/core';
import { NavigationButtonsComponent } from '../navigation-buttons/navigation-buttons.component';
import { User } from '../../models/user.model';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavigationButtonsComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.less'
})
export class AppHeaderComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private readonly currentUserService: CurrentUserService) {}

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.currentUserService.loadCurrentUser(1);
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
