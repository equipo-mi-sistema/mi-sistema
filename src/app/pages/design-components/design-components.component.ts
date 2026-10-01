import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  IconComponent
} from '../../shared/components/atomics';
import { StatCardComponent } from '../../shared/components/molecules';
import { EmptyStateCardComponent, WelcomeBannerComponent } from '../../shared/components/organism';

@Component({
  selector: 'app-design-components',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    StatCardComponent,
    EmptyStateCardComponent,
    WelcomeBannerComponent
  ],
  templateUrl: './design-components.component.html'
})
export class DesignComponentsComponent {
  sampleClickCount = 0;

  onButtonClick(label: string) {
    this.sampleClickCount++;
    console.log(`Botón clickeado: ${label}`);
  }
}
