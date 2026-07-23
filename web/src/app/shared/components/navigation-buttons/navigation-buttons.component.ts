import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation-buttons',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-buttons.component.html',
  styleUrl: './navigation-buttons.component.less'
})
export class NavigationButtonsComponent {}
