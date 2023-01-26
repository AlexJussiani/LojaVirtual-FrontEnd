import { ShopRoutingModule } from './shop.route';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './lista/shop.component';
import { ShopService } from './services/shop.service';
import { ShopAppComponent } from './shop.app.component';
import { AdicionarComponent } from './adicionar/adicionar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ShopAppComponent,
    ShopComponent,
    AdicionarComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[
    ShopService
  ]
})
export class ShopModule { }
