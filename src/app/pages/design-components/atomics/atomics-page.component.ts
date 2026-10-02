import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  IconComponent
} from '../../../shared/components/atomics';

@Component({
  selector: 'app-atomics-page',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent
  ],
  templateUrl: './atomics-page.component.html'
})
export class AtomicsPageComponent {
  sampleClickCount = 0;
  lastButtonClicked = 'Ninguno';

  onButtonClick(label: string): void {
    this.sampleClickCount++;
    this.lastButtonClicked = label;
  }
}
