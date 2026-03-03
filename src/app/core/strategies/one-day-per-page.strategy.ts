import { Injectable } from '@angular/core';
import { AgendaConfig } from '../models/agenda-config.model';
import { AgendaRow } from '../models/agenda-row.model';
import { AgendaStrategy } from './agenda-strategy.interface';
import { DayFormat } from '../enums/day-format.enum';

const WEEK_DAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

@Injectable({ providedIn: 'root' })
export class OneDayPerPageStrategy implements AgendaStrategy {
  generate(config: AgendaConfig, phrases: string[]): AgendaRow[] {
    const rows: AgendaRow[] = [];
    let phraseIndex = 0;

    for (const month of config.months) {
      const daysInMonth = new Date(config.year, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(config.year, month - 1, day);
        const weekDay = date.getDay();
        if (!config.weekDays.includes(weekDay)) continue;

        const dayStr = config.dayFormat === DayFormat.PADDED
          ? String(day).padStart(2, '0')
          : String(day);

        const phrase = phrases.length > 0 ? phrases[phraseIndex % phrases.length] : '';
        phraseIndex++;

        rows.push({
          dia1: dayStr,
          semana1: WEEK_DAYS_PT[weekDay],
          mes1: MONTHS_PT[month - 1],
          frase1: phrase,
          dia2: '',
          semana2: '',
          mes2: '',
          frase2: '',
          dia1v: dayStr,
          semana1v: WEEK_DAYS_PT[weekDay],
          mes1v: MONTHS_PT[month - 1],
          frase1v: phrase,
          dia2v: '',
          semana2v: '',
          mes2v: '',
          frase2v: ''
        });
      }
    }
    return rows;
  }
}
