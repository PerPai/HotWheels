export class RolesModel {
  id?: number;
  idRol: string;
  nombre: string;
  descripcion: string;

  constructor(c?: RolesModel) {
    if (this.id !== undefined) {
      this.id = c?.id;
    }

    this.idRol = c !== undefined ? c.idRol : '';
    this.nombre = c !== undefined ? c.nombre : '';
    this.descripcion = c !== undefined ? c.descripcion : '';
  }
}
