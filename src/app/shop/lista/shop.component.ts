import { TipoProduto } from './../models/tipoProduto';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Marca } from '../models/marca';
import { Produto } from '../models/produtos';
import { Tamanho } from '../models/tamanho';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  imagens: string = environment.imagensUrl;
  tamanhos: Tamanho[];
  marcas: Marca[];
  tipoProdutos: TipoProduto[];
  tipoProdutosSelected: string[];

  constructor(
    private produtosService: ShopService,
  ) { }

  public produtos: Produto[];

  ngOnInit(): void {
    this.obterProdutos();
     this.produtosService.obterTamanhos()
    .subscribe({
      next: (tamanho) => {this.tamanhos = tamanho}
    });
    this.produtosService.obterMarcas()
    .subscribe({
      next: (marca) => {this.marcas = marca}
    });
    this.produtosService.obterTipoProdutos()
    .subscribe({
      next: (tipoProdutos) => {this.tipoProdutos = tipoProdutos}
    })

    this.tipoProdutosSelected = new Array<string>();
  }

  obterProdutos(){
    this.produtosService.obterTodos()
      .subscribe({
        next: (produto) => {this.produtos = produto} ,
        error: (falha) => {},
        complete: () => {}
      })
  }

  getTipoProdutoId(e: any, id:string){
    if(e.target.checked){
      this.tipoProdutosSelected.push(id);
    }else{
      this.tipoProdutosSelected = this.tipoProdutosSelected.filter(i => i!=id)
    }
    if(this.tipoProdutosSelected.length != 0){
      //this.tipoProdutosSelected.forEach(
     //  t => this.produtos = this.produtos.filter(p => p.tipoProdutoId==t))
      this.produtos = this.produtos.filter(p => this.tipoProdutosSelected.forEach(t => t==p.tipoProdutoId))
    }else{
      this.obterProdutos();
    }
  }

}
