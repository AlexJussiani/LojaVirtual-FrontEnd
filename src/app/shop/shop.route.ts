import { ShopComponent } from './lista/shop.component';
import { ShopAppComponent } from './shop.app.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdicionarComponent } from './adicionar/adicionar.component';

const shopRouterConfig: Routes = [
  {
    path: '', component: ShopAppComponent,
    children: [
      { path: 'listar-todos', component: ShopComponent},
      { path: 'adicionar', component: AdicionarComponent}
    ]
  }
];

@NgModule({
  imports: [
      RouterModule.forChild(shopRouterConfig)
  ],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
