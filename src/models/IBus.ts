export interface ISoat {
    numero: string;
    vence: string;
}

export interface IBus {
    placa: string;
    modelo: string;
    anno: number;
    soat: ISoat;
    esp32_id: string;
}

export interface IBusResponse extends IBus {
    _id: string;
    creado_en: string;
    actualizado: string;
    
}