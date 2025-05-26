export class CategoriaModel {
  id?: number;
  idCategoria: string;
  nombre: string;
  descripcion: string;

  constructor(c?: CategoriaModel) {
    if (this.id !== undefined) {
      this.id = c?.id;
    }
    this.idCategoria = c != undefined ? c.idCategoria : '';
    this.nombre = c != undefined ? c.nombre : '';
    this.descripcion = c != undefined ? c.descripcion : '';
  }
}
