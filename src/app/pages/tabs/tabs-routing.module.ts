import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'scan',
    component: TabsPage,
    children: [
      {
        path: 'scanner',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'history',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule),
          },
          {
            path: 'map/:geo',
            loadChildren: () => import('../mapa/mapa.module').then(m => m.MapaPageModule)
          },
          {
            path: '**',
            redirectTo: '/scan/history',
          }
        ]
      },
      {
        path: '',
        redirectTo: '/scan/scanner',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/scan/scanner',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/scan/scanner',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
