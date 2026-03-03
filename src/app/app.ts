import { Component } from '@angular/core';
import { SdvPageComponent } from './features/sdv/pages/sdv-page/sdv-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SdvPageComponent],
  template: '<app-sdv-page></app-sdv-page>'
})
export class AppComponent {}
