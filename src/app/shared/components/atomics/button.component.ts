import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [title]="title()"
      [class]="buttonClasses()"
      (click)="clicked.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  title = input<string>('');

  clicked = output<MouseEvent>();

  buttonClasses = computed(() => {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none';

    const sizeMap: Record<ButtonSize, string> = {
      sm: 'px-2.5 py-1.5 text-xs gap-1.5',
      md: 'px-3.5 py-2 text-sm gap-2',
      lg: 'px-4 py-2.5 text-base gap-2.5',
      icon: 'p-2'
    };

    const variantMap: Record<ButtonVariant, string> = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20 active:bg-brand-800',
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300',
      outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100',
      ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200'
    };

    return `${base} ${sizeMap[this.size()]} ${variantMap[this.variant()]}`;
  });
}
