export class ProveedorModel {
  id?: number;
  idProveedor: string;
  nombre: string;
  telefono: string;
  correo: string;

  constructor(c?: ProveedorModel) {
    if (this.id !== undefined) {
      this.id = c?.id;
    }
    this.idProveedor = c != undefined ? c.idProveedor : '';
    this.nombre = c != undefined ? c.nombre : '';
    this.telefono = c != undefined ? c.telefono : '';
    this.correo = c != undefined ? c.correo : '';
  }
}
