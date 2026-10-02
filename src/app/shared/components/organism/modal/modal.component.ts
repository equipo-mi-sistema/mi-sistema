import {
  Component,
  HostListener,
  computed,
  input,
  model,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atomics/icon.component';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop con desenfoque suave -->
        <div
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
          (click)="onBackdropClick()"
        ></div>

        <!-- Contenedor del Modal -->
        <div
          [class]="modalClasses()"
          class="relative w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 transition-all transform animate-scaleUp"
        >
          <!-- Header con Título Visible -->
          @if (title() || showCloseButton()) {
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div class="flex items-center gap-2.5">
                @if (title()) {
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {{ title() }}
                  </h3>
                }
                <ng-content select="[modal-title]"></ng-content>
              </div>

              @if (showCloseButton()) {
                <button
                  type="button"
                  (click)="close()"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-auto"
                  aria-label="Cerrar modal"
                >
                  <app-icon name="close" size="sm"></app-icon>
                </button>
              }
            </div>
          }

          <!-- Body -->
          <div class="p-6 text-sm text-slate-600 max-h-[75vh] overflow-y-auto">
            <ng-content></ng-content>
          </div>

          <!-- Footer proyectado -->
          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 empty:hidden">
            <ng-content select="[modal-footer]"></ng-content>
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  isOpen = model<boolean>(false);
  title = input<string>('');
  size = input<ModalSize>('md');
  closeOnBackdrop = input<boolean>(true);
  closeOnEsc = input<boolean>(true);
  showCloseButton = input<boolean>(true);

  closed = output<void>();

  modalClasses = computed(() => {
    const sizeMap: Record<ModalSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl'
    };
    return sizeMap[this.size()];
  });

  @HostListener('document:keydown.escape')
  onEscKey(): void {
    if (this.isOpen() && this.closeOnEsc()) {
      this.close();
    }
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }
}
