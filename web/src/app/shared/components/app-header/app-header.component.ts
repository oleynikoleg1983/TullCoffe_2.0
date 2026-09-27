import { Component, HostListener, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NavigationButtonsComponent } from '../navigation-buttons/navigation-buttons.component';
import { User } from '../../models/user.model';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, NavigationButtonsComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.less',
})
export class AppHeaderComponent implements OnInit {
  currentUser: User | null = null;
  readonly isAdmin$;
  isUserMenuOpen = false;

  constructor(
    private readonly currentUserService: CurrentUserService,
    private readonly router: Router,
  ) {
    this.isAdmin$ = this.currentUserService.currentUser$.pipe(
      map((user) => user?.role === 'admin'),
    );
  }

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    const clickedInsideUserMenu = target?.closest('.user-menu-wrapper');

    if (!clickedInsideUserMenu) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.isUserMenuOpen = false;
    this.currentUserService.clearCurrentUser();
    this.router.navigate(['/login']);
  }
}
