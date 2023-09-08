export interface IMovimentacoes {
    uuid: string
    tipo: TipoMovimentacao
    startedAt: string,
    finishedAt?: string
}

export interface IContainer {
    uuid: string,
    numContainer: string,
    tipo: TipoContainer,
    status: StatusContainer,
    categoria: CategoriaContainer,
    createdAt: string,
    updatedAt: string,
    movimentacoes: IMovimentacoes[]
}

export interface ICliente {
    uuid: string,
    name: string,
    createdAt: string,
    updatedAt: string
    containers: IContainer[]
}



export interface INewCliente {
    Cliente: string,
    Movimentacoes: INewMovimentacao[]
}

export interface INewMovimentacao {
    Tipo: TipoMovimentacao,
    Conteineres: INewContainer[]
}

export interface INewContainer {
    uuid: string,
    numContainer: string,
    tipo: TipoContainer,
    status: StatusContainer,
    categoria: CategoriaContainer,
    createdAt: string,
    updatedAt: string,
}

export type TipoMovimentacao = "EMBARQUE" | "DESCARGA" | "SCANNER" | "REPOSICIONAMENTO" | "PESAGEM" | "GATE_IN" | "GATE_OUT";

export type TipoContainer = "TIPO_40" | "TIPO_20"
export type StatusContainer = "CHEIO" | "VAZIO"
export type CategoriaContainer = "EXPORTACAO" | "IMPORTACAO"
