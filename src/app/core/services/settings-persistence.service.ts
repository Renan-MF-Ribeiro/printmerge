import { Injectable } from '@angular/core';
import { AgendaConfig } from '../models/agenda-config.model';

const STORAGE_KEY = 'printmerge_config_v1';

@Injectable({ providedIn: 'root' })
export class SettingsPersistenceService {
  private readonly version = 'v1';

  save(config: AgendaConfig): void {
    const payload = { version: this.version, config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  restore(): AgendaConfig | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const payload = JSON.parse(raw);
      if (payload.version !== this.version) return null;
      return payload.config as AgendaConfig;
    } catch {
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
