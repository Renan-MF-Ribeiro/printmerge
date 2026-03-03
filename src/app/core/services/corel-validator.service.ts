import { Injectable } from '@angular/core';
import { AgendaRow } from '../models/agenda-row.model';
import { CorelValidation, CorelStatus } from '../models/corel-validation.model';
import { TemplateEngine } from '../engines/template-engine.service';

@Injectable({ providedIn: 'root' })
export class CorelValidatorService {
  private readonly EXPECTED_COLUMNS = ['dia1', 'semana1', 'mes1', 'frase1', 'dia2', 'semana2',
    'mes2', 'frase2', 'dia1v', 'semana1v', 'mes1v', 'frase1v', 'dia2v', 'semana2v', 'mes2v', 'frase2v'];

  constructor(private templateEngine: TemplateEngine) {}

  validate(rows: AgendaRow[]): CorelValidation {
    const messages: string[] = [];
    let status: CorelStatus = 'compatible';

    if (rows.length === 0) {
      return { status: 'incompatible', messages: ['Nenhum dado gerado.'] };
    }

    const firstRow = rows[0];
    const actualKeys = Object.keys(firstRow);
    const expectedKeys = this.EXPECTED_COLUMNS;

    for (let i = 0; i < expectedKeys.length; i++) {
      if (actualKeys[i] !== expectedKeys[i]) {
        messages.push(`Coluna ${i + 1} esperada: "${expectedKeys[i]}", encontrada: "${actualKeys[i]}"`);
        status = 'incompatible';
      }
    }

    if (actualKeys.length !== expectedKeys.length) {
      messages.push(`Número de colunas incorreto: esperado ${expectedKeys.length}, encontrado ${actualKeys.length}`);
      status = 'incompatible';
    }

    if (status === 'compatible') {
      messages.push('Estrutura de colunas correta.');
      messages.push('Encoding UTF-8 com BOM será aplicado na exportação.');
    }

    if (rows.length > 5000) {
      messages.push(`Dataset grande (${rows.length} registros). Performance pode ser afetada.`);
      if (status === 'compatible') status = 'warning';
    }

    return { status, messages };
  }
}
