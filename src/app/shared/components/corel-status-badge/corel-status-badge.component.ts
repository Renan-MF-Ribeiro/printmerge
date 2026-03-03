import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorelValidation } from '../../../core/models/corel-validation.model';

@Component({
  selector: 'app-corel-status-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="corel-badge" [ngClass]="badgeClass">
      <span class="icon">{{ icon }}</span>
      <span class="label">{{ label }}</span>
    </div>
    <ul *ngIf="validation?.messages?.length" class="messages">
      <li *ngFor="let msg of validation?.messages">{{ msg }}</li>
    </ul>
  `,
  styles: [`
    .corel-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 4px; font-weight: 600; }
    .compatible { background: #d4edda; color: #155724; }
    .warning { background: #fff3cd; color: #856404; }
    .incompatible { background: #f8d7da; color: #721c24; }
    .messages { margin-top: 6px; padding-left: 16px; font-size: 12px; color: #555; }
  `]
})
export class CorelStatusBadgeComponent {
  @Input() validation: CorelValidation | null = null;

  get badgeClass(): string {
    return this.validation?.status ?? 'incompatible';
  }

  get icon(): string {
    switch (this.validation?.status) {
      case 'compatible': return '✔';
      case 'warning': return '⚠';
      default: return '❌';
    }
  }

  get label(): string {
    switch (this.validation?.status) {
      case 'compatible': return 'Compatível';
      case 'warning': return 'Atenção';
      default: return 'Incompatível';
    }
  }
}
