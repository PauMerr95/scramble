import { Component, effect, inject} from '@angular/core';
import { IconQueryGenome } from '../../icons/icon-query-genome';
import { IconQueryGene } from '../../icons/icon-query-gene';
import { IconQueryVirus } from '../../icons/icon-query-virus';
import { IconQueryProkaryot } from '../../icons/icon-query-prokaryot';
import { IconQueryOrganelle } from '../../icons/icon-query-organelle';
import { LayoutService } from '../../../services/layout-service';
import { QueryMainPage } from './query-main-page/query-main-page';
import { QueryGenomePage } from './query-genome-page/query-genome-page';
import { QueryGenePage } from './query-gene-page/query-gene-page';
import { QueryProkaryotPage } from './query-prokaryot-page/query-prokaryot-page';
import { QueryVirusPage } from './query-virus-page/query-virus-page';
import { QueryOrganellePage } from './query-organelle-page/query-organelle-page';
import { queryGenomeGrid, queryMainGrid, queryGeneGrid,
         queryProkaryotGrid, queryVirusGrid, queryOrganelleGrid } from '../../../move-grids/mv-grids-sidePane';

@Component({
  selector: 'app-query',
  imports: [IconQueryGene, IconQueryGenome, IconQueryProkaryot, IconQueryVirus, IconQueryOrganelle,
            QueryGenePage, QueryGenomePage, QueryProkaryotPage, QueryVirusPage, QueryOrganellePage,
            QueryMainPage
   ],
  templateUrl: './query.html',
  styleUrl: './query.scss',
})
export class Query {
  readonly lyt = inject(LayoutService);

  hoverGenome: boolean = false;
  hoverGene: boolean = false;
  hoverProkaryot: boolean = false;
  hoverVirus: boolean = false;
  hoverOrganelle: boolean = false;
  
  constructor() {
    effect(() => {
      if (this.lyt.sidePaneState() !== "Query") {
        setTimeout(this.resetQueryWindow, 5000);
      }
      switch (this.lyt.queryPage()) {
        case 'Genome':    this.lyt.loadGrid(queryGenomeGrid);     break;
        case 'Gene':      this.lyt.loadGrid(queryGeneGrid);       break;
        case 'Prokaryot': this.lyt.loadGrid(queryProkaryotGrid);  break;
        case 'Virus':     this.lyt.loadGrid(queryVirusGrid);      break;
        case 'Organelle': this.lyt.loadGrid(queryOrganelleGrid);  break;
        case 'QueryMain': this.lyt.loadGrid(queryMainGrid);       break;
      }
    });
  }

   resetQueryWindow = () => {
    if (this.lyt.sidePaneState() !== "Query") this.lyt.changeQueryPage("QueryMain");
   }


}
