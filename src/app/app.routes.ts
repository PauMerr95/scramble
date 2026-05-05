import { Routes } from '@angular/router';
import { QueryMainPage } from './components/side-pane/query/routes/query-main-page/query-main-page';
import { QueryGenomePage } from './components/side-pane/query/routes/query-genome-page/query-genome-page';
import { QueryGenePage } from './components/side-pane/query/routes/query-gene-page/query-gene-page';
import { QueryProkaryotPage } from './components/side-pane/query/routes/query-prokaryot-page/query-prokaryot-page';
import { QueryVirusPage } from './components/side-pane/query/routes/query-virus-page/query-virus-page';
import { QueryOrganellePage } from './components/side-pane/query/routes/query-organelle-page/query-organelle-page';

export const routes: Routes = [
    {
        path: "query",
        component: QueryMainPage,
    },
    {
        path: "query/genome",
        component: QueryGenomePage,
    },
    {
        path: "query/gene",
        component: QueryGenePage,
    },
    {
        path: "query/prokaryot",
        component: QueryProkaryotPage,
    },
    {
        path: "query/virus",
        component: QueryVirusPage,
    },
    {
        path: "query/organelle",
        component: QueryOrganellePage,
    },
];
