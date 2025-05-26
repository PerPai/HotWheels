export class ArticuloModel {
  id?: number;
  idArticulo: string;
  idProveedor: string;
  idCategoria: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen1: string;
  imagen2: string;

  constructor(c?: ArticuloModel) {
    if (this.id !== undefined) {
      this.id = c?.id;
    }

    this.idArticulo = c !== undefined ? c.idArticulo : '';
    this.idProveedor = c !== undefined ? c.idProveedor : '';
    this.idCategoria = c !== undefined ? c.idCategoria : 0;
    this.nombre = c !== undefined ? c.nombre : '';
    this.precio = c !== undefined ? c.precio : 0;
    this.descripcion = c !== undefined ? c.descripcion : '';
    this.stock = c !== undefined ? c.stock : 0;
    this.imagen1 = c !== undefined ? c.imagen1 : '';
    this.imagen2 = c !== undefined ? c.imagen2 : '';
  }
}
