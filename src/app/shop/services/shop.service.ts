import { TipoProduto } from './../models/tipoProduto';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { BaseService } from "src/app/services/base.service";
import { Marca } from "../models/marca";
import { Produto } from "../models/produtos";
import { Cor } from '../models/cor';
import { Tamanho } from '../models/tamanho';
import { Paged } from '../models/paged';
import { Filtro } from '../models/filtros';


@Injectable()
export class ShopService extends BaseService{

  constructor(private http: HttpClient) { super()}

  obterTodos(): Observable<Produto[]>{
    return   this.http
         .get<Produto[]>(`${this.UrlServiceV1}catalogo/produtos`, this.ObterHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterTodosPaginado(pageSize: number, pageIndex: number, query?: string): Observable<Paged<Produto>>{
    return  this.http
         .get<Paged<Produto>>(`${this.UrlServiceV1}catalogo/paginado?ps=${pageSize}&page=${pageIndex}&q=${query}`, this.ObterHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterPorFiltroPaginado(filtro: Filtro[], pageSize: number, pageIndex: number, ordenacao?: number, query?: string): Observable<Paged<Produto>>{
    return  this.http
         .post<Paged<Produto>>(`${this.UrlServiceV1}catalogo/filtroPaginado?ps=${pageSize}&page=${pageIndex}&ordenacao=${ordenacao}&q=${query}`, filtro, this.ObterHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  novoProduto(produto: Produto): Observable<Produto> {
    return this.http
        .post(this.UrlServiceV1 + "catalogo/produtos", produto, this.ObterHeaderJson())
        .pipe(
          map(super.extractData),
          catchError(super.serviceError)
        );
  }

  obterMarcas(): Observable<Marca[]>{
    return   this.http
         .get<Marca[]>(`${this.UrlServiceV1}catalogo/marcas`, this.ObterHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterCores(): Observable<Cor[]>{
    return   this.http
         .get<Cor[]>(`${this.UrlServiceV1}catalogo/cores`, this.ObterHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterTamanhos(): Observable<Tamanho[]>{
    return   this.http
         .get<Tamanho[]>(`${this.UrlServiceV1}catalogo/tamanho`, this.ObterHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterTipoProdutos(): Observable<TipoProduto[]>{
    return   this.http
         .get<TipoProduto[]>(`${this.UrlServiceV1}catalogo/tipoProduto`, this.ObterHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }


}
