import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WelcomeBannerComponent } from '../../shared/components/organism';
import { IconComponent, BadgeComponent } from '../../shared/components/atomics';

@Component({
  selector: 'app-design-components',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    WelcomeBannerComponent,
    IconComponent,
    BadgeComponent
  ],
  templateUrl: './design-components.component.html'
})
export class DesignComponentsComponent {
  tabs = [
    { label: 'Átomos (Atomics)', route: 'atomicos', icon: 'cube', badge: 'Nivel 1' },
    { label: 'Moléculas (Molecules)', route: 'moleculas', icon: 'extension', badge: 'Nivel 2' },
    { label: 'Organismos (Organisms)', route: 'organismos', icon: 'palette', badge: 'Nivel 3' }
  ];
}
