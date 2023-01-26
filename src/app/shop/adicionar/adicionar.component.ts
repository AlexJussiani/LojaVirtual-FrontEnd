import { TipoProduto } from './../models/tipoProduto';
import { CurrencyUtils } from './../../utils/currency-utils';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBaseComponent } from 'src/app/base-components/form-base.component';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/produtos';
import { ShopService } from '../services/shop.service';
import { Marca } from '../models/marca';
import { Cor } from '../models/cor';
import { Tamanho } from '../models/tamanho';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.css']
})
export class AdicionarComponent extends FormBaseComponent  implements OnInit {

  imagens: string = environment.imagensUrl;

  imageBase64: any;
  imagemPreview: any;
  imagemNome: string;
  imagemOriginalSrc: string;

  produto: Produto;
  marcas: Marca[];
  tipoProdutos: TipoProduto[];
  cores: Cor[];
  tamanhos: Tamanho[];
  errors: any[] = [];
  public produtoForm: FormGroup;

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  constructor(private fb: FormBuilder,
    private produtoService: ShopService,
    private router: Router,
    private toastr: ToastrService) {
      super();
      this.validationMessages = {
        marcaId: {
            required: 'Escolha a Marca',
        },
        tipoProdutoId: {
          required: 'Escolha o Tipo de Produto',
        },
        corId: {
          required: 'Escolha a cor do Produto',
        },
        tamanhoId: {
          required: 'Escolha o tamanho do produto',
        },
        nome: {
            required: 'Informe o Nome',
            minlength: 'Mínimo de 2 caracteres',
            maxlength: 'Máximo de 200 caracteres'
        },
        descricao: {
            required: 'Informe a Descrição',
            minlength: 'Mínimo de 2 caracteres',
            maxlength: 'Máximo de 1000 caracteres'
        },
        valorTotal: {
          required: 'Informe o Valor',
        },
        genero: {
          required: 'Informe o Genero',
        },
        tipoDesconto: {
          required: 'Informe o Tipo de Desconto',
        },
          desconto: {
            required: 'Informe o Desconto',
        },
        imagem: {
            required: 'Informe a Imagem',
        },
        valor: {
            required: 'Informe o Valor',
        }
    }

    super.configurarMensagensValidacaoBase(this.validationMessages);
    }

  ngOnInit(): void {
    this.produtoService.obterMarcas()
    .subscribe({
      next: (marca) => {this.marcas = marca}
    })
    this.produtoService.obterTipoProdutos()
    .subscribe({
      next: (tipoProduto) => {this.tipoProdutos = tipoProduto}
    })
    this.produtoService.obterCores()
    .subscribe({
      next: (cor) => {this.cores = cor}
    })
    this.produtoService.obterTamanhos()
    .subscribe({
      next: (tamanho) => {this.tamanhos = tamanho}
    })
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      valorTotal: ['', [Validators.required]],
      valorDesconto: ['', [Validators.required]],
      imagem: ['', [Validators.required]],
      imagemUpload: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      tipoDesconto: ['', [Validators.required]],
      tipoProdutoId: ['', [Validators.required]],
      marcaId: ['', [Validators.required]],
      corId: ['', [Validators.required]],
      tamanhoId: ['', [Validators.required]],
      ativo: [true]
    })

    this.imagemOriginalSrc = this.imagens + this.produto.imagem;
  }


  ngAfterViewInit(): void {
    this.configurarValidacaoFormulario(this.formInputElements)
  }

  protected configurarValidacaoFormulario(formInputElements: ElementRef[]) {
    super.configurarValidacaoFormularioBase(formInputElements, this.produtoForm);
  }

  adicionarProduto() {
   // if (this.produtoForm.dirty && this.produtoForm.valid) {
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);

      if (this.imageBase64) {
        this.produto.imagemUpload = this.imageBase64;
        this.produto.imagem = this.imagemNome;
      }
      this.produto.valorTotal = CurrencyUtils.StringParaDecimal(this.produto.valorTotal);
      this.produto.valorDesconto = CurrencyUtils.StringParaDecimal(this.produto.valorDesconto);
      this.produto.genero = Number(this.produto.genero);
      this.produto.tipoDesconto = Number(this.produto.tipoDesconto);

      console.log('teste: ', this.produto)
      this.produtoService.novoProduto(this.produto)
        .subscribe({
          next: (sucesso: any) => { this.processarSucesso(sucesso) },
          error: (falha: any) => { this.processarFalha(falha) }
        });
   //}
  }

    processarSucesso(response: any) {
      this.produtoForm.reset();
      this.errors = [];

      let toast = this.toastr.success('Produto cadastrado com sucesso!', 'Sucesso!');
      if (toast) {
        toast.onHidden.subscribe(() => {
          this.router.navigate(['/shop/adicionar']);
        });
      }
    }

    processarFalha(fail: any) {
      this.errors = fail.error.errors;
      this.toastr.error('Ocorreu um erro!', 'Opa :(');
    }

    upload(file: any) {
      this.imagemNome = file[0].name;

      var reader = new FileReader();
      reader.onload = this.manipularReader.bind(this);
      reader.readAsBinaryString(file[0]);
    }

    manipularReader(readerEvt: any) {
      var binaryString = readerEvt.target.result;
      this.imageBase64 = btoa(binaryString);
      this.imagemPreview = "data:image/jpeg;base64," + this.imageBase64;
    }
}
