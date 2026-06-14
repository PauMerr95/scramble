import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../../services/layout-service';

@Component({
  selector: 'app-query-main-page',
  imports: [],
  templateUrl: './query-main-page.html',
  styleUrl: './query-main-page.scss',
})
export class QueryMainPage {
  readonly lyt = inject(LayoutService);
}
