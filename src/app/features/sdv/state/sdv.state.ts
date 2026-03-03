import { Injectable, signal, computed } from '@angular/core';
import { AgendaConfig } from '../../../core/models/agenda-config.model';
import { AgendaRow } from '../../../core/models/agenda-row.model';
import { CorelValidation } from '../../../core/models/corel-validation.model';
import { AgendaType } from '../../../core/enums/agenda-type.enum';
import { DayFormat } from '../../../core/enums/day-format.enum';
import { ExportFormat } from '../../../core/enums/export-format.enum';
import { Separator } from '../../../core/enums/separator.enum';
import { TemplateType } from '../../../core/enums/template-type.enum';

@Injectable({ providedIn: 'root' })
export class SdvState {
  readonly config = signal<AgendaConfig>({
    type: AgendaType.ONE_DAY_PER_PAGE,
    year: new Date().getFullYear() + 1,
    weekDays: [1, 2, 3, 4, 5],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    dayFormat: DayFormat.PADDED,
    exportFormat: ExportFormat.CSV,
    separator: Separator.SEMICOLON,
    template: TemplateType.COMERCIAL,
    fileName: 'agenda',
    multipleYears: true,
  });

  readonly generatedRows = signal<AgendaRow[]>([]);
  readonly validation = signal<CorelValidation | null>(null);
  readonly isGenerating = signal<boolean>(false);
  readonly view = signal<'config' | 'preview'>('config');

  readonly previewRows = computed(() => this.generatedRows().slice(0, 5));
  readonly totalRecords = computed(() => this.generatedRows().length);
  readonly estimatedPages = computed(() => {
    const rows = this.generatedRows();
    const dataRows = rows.filter((r) => !r.dia1.startsWith('{'));
    return Math.ceil(dataRows.length);
  });

  updateConfig(partial: Partial<AgendaConfig>): void {
    this.config.update((c) => ({ ...c, ...partial }));
  }

  setRows(rows: AgendaRow[]): void {
    this.generatedRows.set(rows);
  }

  setValidation(v: CorelValidation): void {
    this.validation.set(v);
  }

  setGenerating(value: boolean): void {
    this.isGenerating.set(value);
  }

  setView(v: 'config' | 'preview'): void {
    this.view.set(v);
  }
}
