import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: Tab2Page,
      },
      {
        path: 'map/:geo',
        loadChildren: () => import('../mapa/mapa.module').then(m => m.MapaPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/scan/history',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
