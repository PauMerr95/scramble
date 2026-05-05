import { Component, effect, inject} from '@angular/core';
import { IconQueryGenome } from '../../../icons/icon-query-genome';
import { IconQueryGene } from '../../../icons/icon-query-gene';
import { IconQueryVirus } from '../../../icons/icon-query-virus';
import { IconQueryProkaryot } from '../../../icons/icon-query-prokaryot';
import { IconQueryOrganelle } from '../../../icons/icon-query-organelle';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { LayoutService } from '../../../../services/layout-service';

@Component({
  selector: 'app-query',
  imports: [IconQueryGene, IconQueryGenome, IconQueryProkaryot, IconQueryVirus, IconQueryOrganelle, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './query.html',
  styleUrl: './query.scss',
})
export class Query {
  readonly router = inject(Router);
  readonly lyt = inject(LayoutService);

  hoverGenome: boolean = false;
  hoverGene: boolean = false;
  hoverProkaryot: boolean = false;
  hoverVirus: boolean = false;
  hoverOrganelle: boolean = false;

  constructor() {
    effect(() => {
      if (this.lyt.sidePaneState() === "Query") {
        this.router.navigate(["/query"]);
      }
    });
  }
}
