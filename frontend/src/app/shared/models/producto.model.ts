export class ProductoModel {
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
  isProductInCart?: boolean;

  constructor(c?: ProductoModel) {
    if (c?.id !== undefined) {
      this.id = c.id;
    }

    this.idArticulo = c?.idArticulo || '';
    this.idProveedor = c?.idProveedor || '';
    this.idCategoria = c?.idCategoria || 0;
    this.nombre = c?.nombre || '';
    this.precio = c?.precio || 0;
    this.descripcion = c?.descripcion || '';
    this.stock = c?.stock || 0;
    this.imagen1 = c?.imagen1 || '';
    this.imagen2 = c?.imagen2 || '';
  }
}
