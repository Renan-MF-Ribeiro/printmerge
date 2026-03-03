import { Injectable } from '@angular/core';
import { AgendaRow } from '../models/agenda-row.model';
import { ExportFormat } from '../enums/export-format.enum';
import { Separator } from '../enums/separator.enum';

const COLUMNS: (keyof AgendaRow)[] = ['dia1', 'semana1', 'mes1', 'frase1', 'dia2', 'semana2',
  'mes2', 'frase2', 'dia1v', 'semana1v', 'mes1v', 'frase1v', 'dia2v', 'semana2v', 'mes2v', 'frase2v'];

@Injectable({ providedIn: 'root' })
export class FileExportService {
  export(rows: AgendaRow[], format: ExportFormat, separator: Separator, fileName: string): void {
    const content = this.buildContent(rows, separator);
    const bom = '\uFEFF';
    const fullContent = bom + content;
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const ext = format === ExportFormat.CSV ? 'csv' : 'txt';
    this.triggerDownload(blob, `${fileName}.${ext}`);
  }

  buildContent(rows: AgendaRow[], separator: Separator): string {
    const header = COLUMNS.join(separator);
    const dataLines = rows.map(row =>
      COLUMNS.map(col => row[col]).join(separator)
    );
    return [header, ...dataLines].join('\r\n');
  }

  private triggerDownload(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }
}
