export interface IRuta {
    nombre: string;
    paraderos: IParadero[];
}

export interface IParadero {
    nombre: string;
    orden: number
}

export interface IRutaResponse {
    _id: string;
    nombre: string;
    paraderos: IParadero[];
}
