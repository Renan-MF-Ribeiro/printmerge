import { AgendaConfig } from '../models/agenda-config.model';
import { AgendaRow } from '../models/agenda-row.model';

export interface AgendaStrategy {
  generate(config: AgendaConfig, phrases: string[]): AgendaRow[];
}
