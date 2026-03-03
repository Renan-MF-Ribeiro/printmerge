import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdvState } from '../../state/sdv.state';
import { CorelStatusBadgeComponent } from '../../../../shared/components/corel-status-badge/corel-status-badge.component';
import { AgendaRow } from '../../../../core/models/agenda-row.model';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [CommonModule, CorelStatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './preview-panel.component.html',
  styleUrls: ['./preview-panel.component.scss']
})
export class PreviewPanelComponent {
  protected state = inject(SdvState);

  get columns(): (keyof AgendaRow)[] {
    return ['dia1', 'semana1', 'mes1', 'frase1', 'dia2', 'semana2', 'mes2', 'frase2',
            'dia1v', 'semana1v', 'mes1v', 'frase1v', 'dia2v', 'semana2v', 'mes2v', 'frase2v'];
  }
}
