export class RolesX {
  id?: Number;
  idRol?: string;
  nombreRol: string;
  descripcion: string;

  constructor(us?: RolesX) {
    if (this.id !== undefined) {
      this.id = us?.id;
    }
    this.idRol = us !== undefined ? us?.idRol : '';
    this.nombreRol = us !== undefined ? us.nombreRol : '';
    this.descripcion = us !== undefined ? us.descripcion : '';
  }
}
