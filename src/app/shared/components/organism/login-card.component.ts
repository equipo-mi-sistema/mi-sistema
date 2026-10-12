import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginHeaderComponent } from '../../../shared/components/molecules/login-header.component';
import { AlertComponent } from '../../../shared/components/molecules/alert.component';
import { SecurityDisclaimerComponent } from '../../../shared/components/molecules/security-disclaimer.component';
import { GoogleButtonComponent } from '../../../shared/components/atomics/google-button.component';

@Component({
  selector: 'app-login-card',
  standalone: true,
  imports: [
    CommonModule,
    LoginHeaderComponent,
    SecurityDisclaimerComponent,
    GoogleButtonComponent,
    AlertComponent
  ],
  template: `
    <div class="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col space-y-7 transition-all duration-300">
      <!-- Header de Login -->
      <app-login-header></app-login-header>

      <!-- Mensaje de alerta si falla la autenticación o rechazo Zero-Trust -->
      @if (errorMessage()) {
        <app-alert
          variant="danger"
          title="Acceso Denegado"
          [message]="errorMessage()!"
          [dismissible]="false"
          class="animate-fadeIn"
        ></app-alert>
      }

      <!-- Google SSO CTA -->
      <div class="space-y-3">
        <app-google-button
          [loading]="loading()"
          (onClick)="onGoogleLogin.emit()"
        ></app-google-button>
        <p class="text-center text-[11px] text-slate-400">
          Autenticación delegada exclusivamente mediante Google Identity Platform
        </p>
      </div>

      <!-- Separador sutil -->
      <div class="relative flex items-center justify-center">
        <div class="w-full border-t border-slate-200/70"></div>
      </div>

      <!-- Disclaimer de Seguridad -->
      <app-security-disclaimer></app-security-disclaimer>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease-out forwards;
    }
  `]
})
export class LoginCardComponent {
  loading = input<boolean>(false);
  errorMessage = input<string | null>(null);
  onGoogleLogin = output<void>();
}
