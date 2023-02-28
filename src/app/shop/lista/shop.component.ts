import { Observable } from 'rxjs';
import { TipoProduto } from './../models/tipoProduto';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Marca } from '../models/marca';
import { Produto } from '../models/produtos';
import { Tamanho } from '../models/tamanho';
import { ShopService } from '../services/shop.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paged } from '../models/paged';
import { Filtro } from '../models/filtros';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  imagens: string = environment.imagensUrl;
  tamanhos: Tamanho[];
  marcas: Marca[];
  filtros: Filtro[] = [];
  tipoProdutos: TipoProduto[];

  query = new FormControl();

  tipoProdutosSelected: string[] = new Array<string>();;
  marcasSelected: string[] = new Array<string>();;
  errors: any[] = []
  filtroSelecionado : number = 0;

  opcaoItemPorPagina = [6,9,12,15,18];
  public page = 1;
  public pageSize = 9;

  constructor(
    private produtosService: ShopService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  public paged: Paged<Produto>;
  public produtos: Produto[];

  ngOnInit(): void {
    this.query.setValue('')
    this.query.valueChanges
    .pipe(
      map(v =>  v.trim()),
      //filter(v => v.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(v => this.produtosService.obterPorFiltroPaginado(this.filtros,this.pageSize, this.page,this.filtroSelecionado, v))
    ).subscribe(page => {
      this.paged = page, this.produtos = this.paged.list
    });

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
  }

  obterProdutos(){
    this.spinner.show();
    this.produtosService.obterTodosPaginado(this.pageSize, this.page)
      .subscribe({
        next: (page) => {this.paged = page, this.produtos = this.paged.list, this.spinner.hide()} ,
        error: (falha) => {this.processarFalha(falha)},
        complete: () => {}
      })
  }

  obterProdutosFiltradoPaginado(){
    this.spinner.show();
    this.produtosService.obterPorFiltroPaginado(this.filtros,this.pageSize, this.page, this.filtroSelecionado, this.query.value)
    .subscribe({
      next: (page) => {this.paged = page, this.produtos = this.paged.list, this.spinner.hide()} ,
      error: (falha) => {this.processarFalha(falha)},
      complete: () => {}
    })
  }


  processarFalha(fail: any){

    this.spinner.hide();

    if(fail.status === 400)
      this.errors = fail.error.errors.Mensagens;
    else
     this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(',{
      progressAnimation: 'increasing',
      progressBar: true
    });
  }

  getTipoProdutoId(e: any, id:string){
    this.filtros = this.filtros.filter(t => t.tipoFiltro != 5)
    if(e.target.checked){
      this.tipoProdutosSelected.push(id);
    }else{
      this.tipoProdutosSelected = this.tipoProdutosSelected.filter(i => i!=id)
    }
    this.filtros = this.filtros.concat([{ tipoFiltro: 5, ids: this.tipoProdutosSelected}])
    this.obterProdutosFiltradoPaginado();
  }

  getMarcaId(e: any, id:string){
    this.filtros = this.filtros.filter(t => t.tipoFiltro != 3)
    if(e.target.checked){
      this.marcasSelected.push(id);
    }else{
      this.marcasSelected = this.marcasSelected.filter(i => i!=id)
    }
    this.filtros = this.filtros.concat([{ tipoFiltro: 3, ids: this.marcasSelected}])
    this.obterProdutosFiltradoPaginado();
  }

  pageChanged(event) {
    this.page = event;
    this.obterProdutosFiltradoPaginado();
  }

  ordenarProdutos(e: any){
    this.filtroSelecionado = e.target.value;
    this.obterProdutosFiltradoPaginado();
  }

  changeItemPerPage() {
    this.obterProdutosFiltradoPaginado();
  }
}
