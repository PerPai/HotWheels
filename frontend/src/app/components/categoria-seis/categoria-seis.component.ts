import { Component, inject, OnInit } from '@angular/core';
import { ProductoModel } from 'src/app/shared/models/producto.model';
import { CarritoService } from 'src/app/shared/services/carrito.service';
import { ProductoService } from 'src/app/shared/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-seis',
  templateUrl: './categoria-seis.component.html',
  styleUrls: ['./categoria-seis.component.css']
})
export class CategoriaSeisComponent {
  filtro: any;
  productos: ProductoModel[] = [];
  productoSeleccionado: ProductoModel = new ProductoModel();
  srvCarrito = inject(CarritoService);
  
  constructor(
    private srvProducto: ProductoService
    
  ) {}

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar(): void {
    this.filtro = { idArticulo: '', nombre: '', idCategoria: 6 };
    this.srvProducto.filtrar(this.filtro, 1, 50).subscribe((data) => {
      console.log('Datos recibidos:', data);
      this.productos = Object(data)['datos'];
      this.productos.forEach((producto: ProductoModel) => {
        this.srvCarrito.isProductInCart(producto.id!).subscribe((inCart) => {
          producto.isProductInCart = inCart;
        });
        Object.assign(producto, { cantidad: 1, total: producto.precio });
      });
    });
  }

  mostrarModal(producto: ProductoModel): void {
    this.productoSeleccionado = producto;
  }

  addtoCart(productoSeleccionado: ProductoModel): void {
    this.srvCarrito.addtoCart(productoSeleccionado);
    Swal.fire({
      icon: 'success',
      title: 'Product added to cart',
      showConfirmButton: false,
      timer: 1500
    });
    
  }
}
