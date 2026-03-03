import { Injectable } from '@angular/core';
import { AgendaConfig } from '../models/agenda-config.model';
import { AgendaRow } from '../models/agenda-row.model';
import { AgendaStrategy } from './agenda-strategy.interface';
import { DayFormat } from '../enums/day-format.enum';

const WEEK_DAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

@Injectable({ providedIn: 'root' })
export class WeeklyStrategy implements AgendaStrategy {
  generate(config: AgendaConfig, phrases: string[]): AgendaRow[] {
    const rows: AgendaRow[] = [];
    const fmt = (d: number) => config.dayFormat === DayFormat.PADDED
      ? String(d).padStart(2, '0') : String(d);

    let phraseIndex = 0;
    const firstDay = new Date(config.year, 0, 1);
    let current = new Date(firstDay);
    while (current.getDay() !== 1) {
      current.setDate(current.getDate() + 1);
    }

    while (current.getFullYear() <= config.year) {
      const weekStart = new Date(current);
      if (config.months.includes(weekStart.getMonth() + 1)) {
        const mon = weekStart;
        const sun = new Date(weekStart);
        sun.setDate(weekStart.getDate() + 6);

        const phrase = phrases.length > 0 ? phrases[phraseIndex % phrases.length] : '';
        phraseIndex++;

        rows.push({
          dia1: fmt(mon.getDate()),
          semana1: WEEK_DAYS_PT[mon.getDay()],
          mes1: MONTHS_PT[mon.getMonth()],
          frase1: phrase,
          dia2: fmt(sun.getDate()),
          semana2: WEEK_DAYS_PT[sun.getDay()],
          mes2: MONTHS_PT[sun.getMonth()],
          frase2: '',
          dia1v: fmt(mon.getDate()),
          semana1v: WEEK_DAYS_PT[mon.getDay()],
          mes1v: MONTHS_PT[mon.getMonth()],
          frase1v: phrase,
          dia2v: fmt(sun.getDate()),
          semana2v: WEEK_DAYS_PT[sun.getDay()],
          mes2v: MONTHS_PT[sun.getMonth()],
          frase2v: ''
        });
      }
      current.setDate(current.getDate() + 7);
    }
    return rows;
  }
}
