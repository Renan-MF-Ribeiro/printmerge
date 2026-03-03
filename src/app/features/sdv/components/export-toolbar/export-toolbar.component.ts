import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdvState } from '../../state/sdv.state';
import { FileExportService } from '../../../../core/services/file-export.service';

@Component({
  selector: 'app-export-toolbar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="export-toolbar">
      <button class="btn-back" (click)="backToConfig()">← Configurações</button>
      <button class="btn-export" [disabled]="state.totalRecords() === 0" (click)="export()">
        📥 Exportar {{ state.config().exportFormat }}
      </button>
      <span class="file-name" *ngIf="state.totalRecords() > 0">
        {{ state.config().fileName }}.{{ state.config().exportFormat.toLowerCase() }}
      </span>
    </div>
  `,
  styles: [
    `
      .export-toolbar {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        background: #f7f9fc;
        border-top: 1px solid #e2e8f0;
      }
      .btn-export {
        padding: 10px 24px;
        background: #3182ce;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
      }
      .btn-export:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .btn-export:hover:not(:disabled) {
        background: #2b6cb0;
      }
      .btn-back {
        padding: 10px 18px;
        background: transparent;
        color: #718096;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        font-size: 13px;
      }
      .btn-back:hover {
        background: #edf2f7;
        color: #2d3748;
      }
      .file-name {
        font-size: 13px;
        color: #718096;
        margin-left: auto;
      }
    `,
  ],
})
export class ExportToolbarComponent {
  protected state = inject(SdvState);
  private exportService = inject(FileExportService);

  export(): void {
    const config = this.state.config();
    this.exportService.export(
      this.state.generatedRows(),
      config.exportFormat,
      config.separator,
      config.fileName,
    );
    this.state.setView('config');
  }

  protected backToConfig(): void {
    this.state.setView('config');
  }
}
