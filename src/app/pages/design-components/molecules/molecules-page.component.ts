import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../../shared/components/atomics';
import {
  StatCardComponent,
  UserProfileComponent,
  NavItemComponent
} from '../../../shared/components/molecules';

@Component({
  selector: 'app-molecules-page',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    StatCardComponent,
    UserProfileComponent,
    NavItemComponent
  ],
  templateUrl: './molecules-page.component.html'
})
export class MoleculesPageComponent {
  navItemClicked = 'Ninguno';

  onNavItemClick(name: string): void {
    this.navItemClicked = name;
  }
}
