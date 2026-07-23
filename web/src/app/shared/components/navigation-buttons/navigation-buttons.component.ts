import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation-buttons',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation-buttons.component.html'
})
export class NavigationButtonsComponent {}
