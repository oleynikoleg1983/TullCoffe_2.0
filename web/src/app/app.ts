import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationButtonsComponent } from './shared/components/navigation-buttons/navigation-buttons.component';
import { CurrentUserService } from './shared/services/current-user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationButtonsComponent],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App implements OnInit {
  constructor(private readonly currentUserService: CurrentUserService) {}

  ngOnInit(): void {
    this.currentUserService.loadCurrentUser(1);
  }
}
