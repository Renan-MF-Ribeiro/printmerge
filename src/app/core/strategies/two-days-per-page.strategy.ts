import { Injectable } from '@angular/core';
import { AgendaConfig } from '../models/agenda-config.model';
import { AgendaRow } from '../models/agenda-row.model';
import { AgendaStrategy } from './agenda-strategy.interface';
import { DayFormat } from '../enums/day-format.enum';

const WEEK_DAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

@Injectable({ providedIn: 'root' })
export class TwoDaysPerPageStrategy implements AgendaStrategy {
  generate(config: AgendaConfig, phrases: string[]): AgendaRow[] {
    const rows: AgendaRow[] = [];
    const validDays: Array<{ day: number; month: number; weekDay: number }> = [];

    for (const month of config.months) {
      const daysInMonth = new Date(config.year, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(config.year, month - 1, day);
        const weekDay = date.getDay();
        if (!config.weekDays.includes(weekDay)) continue;
        validDays.push({ day, month, weekDay });
      }
    }

    let phraseIndex = 0;
    for (let i = 0; i < validDays.length; i += 2) {
      const d1 = validDays[i];
      const d2 = validDays[i + 1];

      const fmt = (d: number) => config.dayFormat === DayFormat.PADDED
        ? String(d).padStart(2, '0') : String(d);

      const p1 = phrases.length > 0 ? phrases[phraseIndex % phrases.length] : '';
      phraseIndex++;
      const p2 = d2 ? (phrases.length > 0 ? phrases[phraseIndex % phrases.length] : '') : '';
      if (d2) phraseIndex++;

      rows.push({
        dia1: fmt(d1.day),
        semana1: WEEK_DAYS_PT[d1.weekDay],
        mes1: MONTHS_PT[d1.month - 1],
        frase1: p1,
        dia2: d2 ? fmt(d2.day) : '',
        semana2: d2 ? WEEK_DAYS_PT[d2.weekDay] : '',
        mes2: d2 ? MONTHS_PT[d2.month - 1] : '',
        frase2: p2,
        dia1v: fmt(d1.day),
        semana1v: WEEK_DAYS_PT[d1.weekDay],
        mes1v: MONTHS_PT[d1.month - 1],
        frase1v: p1,
        dia2v: d2 ? fmt(d2.day) : '',
        semana2v: d2 ? WEEK_DAYS_PT[d2.weekDay] : '',
        mes2v: d2 ? MONTHS_PT[d2.month - 1] : '',
        frase2v: p2
      });
    }
    return rows;
  }
}
