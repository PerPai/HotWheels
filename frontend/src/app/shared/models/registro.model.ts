export class RegistroModel {
  id?: number;
  idPersona: string;
  nombre: string;
  apellidoUno: string;
  apellidoDos: string;
  correo: string;
  celular: string;
  passwF?: string;

  constructor(c?: RegistroModel) {
    if (this.id !== undefined) {
      this.id = c?.id;
    }
    this.idPersona = c != undefined ? c.idPersona : '';
    this.nombre = c != undefined ? c.nombre : '';
    this.apellidoUno = c != undefined ? c.apellidoUno : '';
    this.apellidoDos = c != undefined ? c.apellidoDos : '';
    this.correo = c != undefined ? c.correo : '';
    this.celular = c != undefined ? c.celular : '';
    this.passwF = c != undefined ? c?.passwF : '';
  }
}
