import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-remote-fallback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8 text-amber-900 shadow-sm">
      <div class="flex items-start gap-4">
        <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-bold text-amber-950">Microfrontend Remoto No Conectado</h2>
          <p class="text-sm text-amber-800 leading-relaxed max-w-2xl">
            El módulo remoto <strong>administracion</strong> está configurado en su propio repositorio independiente.
            Para visualizarlo, inicia su servidor de desarrollo en el puerto configurado:
          </p>
          <div class="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-100/80 px-3 py-1.5 font-mono text-xs text-amber-900 border border-amber-200">
            <span>URL esperada:</span>
            <strong>http://localhost:4201/remoteEntry.json</strong>
          </div>
          <div class="pt-2">
            <a href="/" class="inline-flex items-center text-xs font-semibold text-amber-800 hover:text-amber-950 underline">
              &larr; Volver al Panel Principal
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RemoteFallbackComponent {}

export const FALLBACK_ROUTES: Routes = [
  {
    path: '',
    component: RemoteFallbackComponent
  }
];
