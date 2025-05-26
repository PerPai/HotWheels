import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/shared/services/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  public products: any[] = [];
  public grandTotal: number = 0;

  constructor(private srvCarrito: CarritoService) {}

  updateQuantity(item: any, value: number) {
    if (item) {
      item.cantidad = value;
      this.srvCarrito.setProducts(this.products);
    }
  }

  ngOnInit(): void {
    this.srvCarrito.getProducts().subscribe((res) => {
      this.products = res;
      this.updateGrandTotal();
    });
  }

  updateGrandTotal() {
    this.grandTotal = this.srvCarrito.getTotalPrice();
  }

  removeItem(item: any): void {
    this.srvCarrito.removeCartItem(item);
    this.updateGrandTotal();
  }

  emptyCart(): void {
    this.srvCarrito.removeAllCart();
    this.updateGrandTotal();
  }
}
