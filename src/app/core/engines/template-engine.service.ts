import { Injectable } from '@angular/core';
import { TemplateType } from '../enums/template-type.enum';
import { AgendaConfig } from '../models/agenda-config.model';

export interface TemplateConfig {
  headerColumns: string[];
  includeVerso: boolean;
  pageEstimateMultiplier: number;
}

@Injectable({ providedIn: 'root' })
export class TemplateEngine {
  create(config: AgendaConfig): TemplateConfig {
    switch (config.template) {
      case TemplateType.EXECUTIVO:
        return { headerColumns: this.getColumns(), includeVerso: true, pageEstimateMultiplier: 1.0 };
      case TemplateType.ESCOLAR:
        return { headerColumns: this.getColumns(), includeVerso: false, pageEstimateMultiplier: 0.8 };
      default:
        return { headerColumns: this.getColumns(), includeVerso: true, pageEstimateMultiplier: 1.2 };
    }
  }

  getColumns(): string[] {
    return ['dia1', 'semana1', 'mes1', 'frase1', 'dia2', 'semana2', 'mes2', 'frase2',
            'dia1v', 'semana1v', 'mes1v', 'frase1v', 'dia2v', 'semana2v', 'mes2v', 'frase2v'];
  }
}
