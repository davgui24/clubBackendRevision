export interface IMensaje {
  id: string;
  message: string;
  visto: boolean;
}

export interface ICarga {
  peso: string;
  alto: string;
  ancho: string;
  largo: string;
}

export interface IPosition {
  latitude: string;
  longitude: string;
}




export interface ICarrera {
  idcarrera: number;
  origen: string;
  destino: string;
  descripcion: string;
  oferta: string;
  demanda: string;
  estado: string;
  codigo: string;
  avatarPasajero: string;
  avatarTransportador?: string;
  usuarioIdusuario: string;
  transportadorVehiculoUsuarioIdusuario?: string;
  transportadorVehiculoVehiculoPlaca?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  carga?: ICarga[];
}

export interface IVehiculo {
  placa: string;
  municipioVehiculo: string;
  soat: boolean;
  tecnomecanica: string;
  vigenciaSoat: string;
  vigenciaTecnomecanica: string;
  tipo: string;
  marca: string;
  modelo: string;
  color: string;
  fotovehiculo: string;
}

export interface ITrasportador {
  usuarioIdusuario: number;
  vehiculoPlaca: string;
}


export interface Iusuario {
  identificacion: number;
  email: string;
  password: string;
  nombres: string;
  avatar: string;
  municipio: string;
  telefono: string;
  terminos?: boolean;

  codigoLider?: string;
  codigoPasajero?: string;
  codigoTransportador?: string;
  codigo1?: string;
  codigo2?: string;

  posicion?: IPosition;
  cambioUsuario: boolean;

  habilitado: boolean;

  habilitadoPasajero?: boolean;
  habilitadoLider?: boolean;
  habilitadoTranspostador?: boolean;

  habilitadoMotoSpeedy?: boolean;
  habilitadoCarroSpeedy?: boolean;

  habilitadoCarroCarrera?: boolean;
  habilitadoCarroMensajeria?: boolean;
  habilitadoMotoCarrera?: boolean;
  habilitadoMotoMensajeria?: boolean;

  historicoPasajero?: number[];
  historicoMotoSpeedy?: number[];
  historicoCarroSpeedy?: number[];
  saldoMotoSpeedy?: number;
  saldoMotoCarroSpeedy?: number;
  motoOcupada?: boolean;
  carroOcupado?: boolean;
  usuarioIdLider?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  ultimoLogin: string;
  mensajeServidor?: IMensaje[];
}