import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  CheckboxComponent,
  DividerComponent,
  IconComponent,
  InputComponent,
  SkeletonComponent,
  SpinnerComponent,
  TextareaComponent,
  ToggleComponent
} from '../../../shared/components/atomics';

@Component({
  selector: 'app-atomics-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    InputComponent,
    TextareaComponent,
    CheckboxComponent,
    SpinnerComponent,
    ToggleComponent,
    SkeletonComponent,
    DividerComponent
  ],
  templateUrl: './atomics-page.component.html'
})
export class AtomicsPageComponent {
  sampleClickCount = 0;
  lastButtonClicked = 'Ninguno';

  // Modelos interactivos de formulario
  inputTextValue = 'Juan Miguel';
  inputEmailValue = 'juan.miguel@empresa.com';
  inputErrorValue = 'Dato inválido';
  textareaValue = 'Este es un texto multilínea de ejemplo.';
  checkbox1 = true;
  checkbox2 = false;
  checkboxIndeterminate = true;

  // Toggles
  toggleActive = true;
  toggleMfa = false;

  onButtonClick(label: string): void {
    this.sampleClickCount++;
    this.lastButtonClicked = label;
  }
}
