import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/lista/shop.component';

const routes: Routes = [
  { path: '', redirectTo: '/shop/listar-todos', pathMatch: 'full' },
  { path: 'shop',
    loadChildren:() => import('./shop/shop.module')
    .then(m => m.ShopModule)
  },
  { path: '**',
    loadChildren:() => import('./shop/shop.module')
    .then(m => m.ShopModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
