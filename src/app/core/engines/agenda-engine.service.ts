import { Injectable } from '@angular/core';
import { AgendaConfig } from '../models/agenda-config.model';
import { AgendaRow } from '../models/agenda-row.model';
import { AgendaType } from '../enums/agenda-type.enum';
import { OneDayPerPageStrategy } from '../strategies/one-day-per-page.strategy';
import { TwoDaysPerPageStrategy } from '../strategies/two-days-per-page.strategy';
import { WeeklyStrategy } from '../strategies/weekly.strategy';
import { AgendaStrategy } from '../strategies/agenda-strategy.interface';

@Injectable({ providedIn: 'root' })
export class AgendaEngine {
  constructor(
    private oneDayStrategy: OneDayPerPageStrategy,
    private twoDaysStrategy: TwoDaysPerPageStrategy,
    private weeklyStrategy: WeeklyStrategy
  ) {}

  generate(config: AgendaConfig, phrases: string[]): AgendaRow[] {
    const strategy = this.getStrategy(config.type);
    const rows = strategy.generate(config, phrases);
    return this.insertMonthSeparators(rows);
  }

  private getStrategy(type: AgendaType): AgendaStrategy {
    switch (type) {
      case AgendaType.TWO_DAYS_PER_PAGE: return this.twoDaysStrategy;
      case AgendaType.WEEKLY: return this.weeklyStrategy;
      default: return this.oneDayStrategy;
    }
  }

  private insertMonthSeparators(rows: AgendaRow[]): AgendaRow[] {
    const result: AgendaRow[] = [];
    let currentMonth = '';

    for (const row of rows) {
      const rowMonth = row.mes1 || row.mes2;
      if (rowMonth && rowMonth !== currentMonth) {
        currentMonth = rowMonth;
        result.push(this.createSeparatorRow(rowMonth));
      }
      result.push(row);
    }
    return result;
  }

  private createSeparatorRow(monthName: string): AgendaRow {
    // dia1 uses {MonthName} format — CorelDRAW Print Merge treats curly-brace
    // values as section markers, used here to visually separate months in the output.
    return {
      dia1: `{${monthName}}`,
      semana1: '',
      mes1: '',
      frase1: '',
      dia2: '',
      semana2: '',
      mes2: '',
      frase2: '',
      dia1v: '',
      semana1v: '',
      mes1v: '',
      frase1v: '',
      dia2v: '',
      semana2v: '',
      mes2v: '',
      frase2v: ''
    };
  }
}
