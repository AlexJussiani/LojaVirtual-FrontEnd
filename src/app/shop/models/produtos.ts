export class Produto {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  valorTotal: number;
  valorDesconto: number;
  valorVenda: number;
  dataCadastro: Date;
  imagem: string;
  imagemUpload: string;
  genero: number;
  tipoDesconto: number;
  imagens: Imagem[];
  tipoProdutoId: string;
  marcaId: string;
  corId: string;
  tamanhoId: string;
}

export class Imagem{
  id: string;
  produtoId: string;
  nome: string;
}
