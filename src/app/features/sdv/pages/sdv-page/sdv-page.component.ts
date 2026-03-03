import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigSidebarComponent } from '../../components/config-sidebar/config-sidebar.component';
import { PreviewPanelComponent } from '../../components/preview-panel/preview-panel.component';
import { ExportToolbarComponent } from '../../components/export-toolbar/export-toolbar.component';

@Component({
  selector: 'app-sdv-page',
  standalone: true,
  imports: [CommonModule, ConfigSidebarComponent, PreviewPanelComponent, ExportToolbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sdv-page.component.html',
  styleUrls: ['./sdv-page.component.scss']
})
export class SdvPageComponent {}
