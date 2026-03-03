import { AgendaType } from '../enums/agenda-type.enum';
import { DayFormat } from '../enums/day-format.enum';
import { ExportFormat } from '../enums/export-format.enum';
import { Separator } from '../enums/separator.enum';
import { TemplateType } from '../enums/template-type.enum';

export interface AgendaConfig {
  type: AgendaType;
  year: number;
  weekDays: number[]; // 0=Sunday, 1=Monday, ... 6=Saturday
  months: number[]; // 1-12
  dayFormat: DayFormat;
  exportFormat: ExportFormat;
  separator: Separator;
  template: TemplateType;
  fileName: string;
  multipleYears: boolean;
}
