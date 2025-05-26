import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  public cartItemList: any[] = [];
  public productList = new BehaviorSubject<any[]>([]);

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItemList = JSON.parse(storedCart);
      this.productList.next(this.cartItemList);
    }
  }

  getProducts(): Observable<any[]> {
    return this.productList.asObservable();
  }

  setProducts(product: any) {
    this.cartItemList = product;
    this.saveCartToStorage();
    this.productList.next(this.cartItemList);
  }

  addtoCart(product: any) {
    const existingProduct = this.cartItemList.find(
      (p: any) => p.id === product.id
    );

    if (existingProduct) {
      existingProduct.cantidad += product.cantidad;
    } else {
      this.cartItemList.push(product);
    }

    this.saveCartToStorage();
    this.productList.next(this.cartItemList);
    console.log(this.cartItemList);
  }

  private saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItemList));
  }

  getTotalPrice(): number {
    let grandTotal = 0;
    this.cartItemList.map((a: any) => {
      a.subtotal = a.precio * a.cantidad;
      grandTotal += a.subtotal;
    });
    return grandTotal;
  }

  updateCartItemQuantity(productId: number, newQuantity: number) {
    const item = this.cartItemList.find((p: any) => p.id === productId);
    if (item) {
      item.cantidad = newQuantity;
    }
    this.saveCartToStorage();
    this.productList.next(this.cartItemList);
    this.getTotalPrice();
  }

  removeCartItem(product: any) {
    const index = this.cartItemList.findIndex((p: any) => p.id === product.id);
    if (index !== -1) {
      this.cartItemList.splice(index, 1);
    }
    this.saveCartToStorage();
    this.productList.next(this.cartItemList);
    this.getTotalPrice();
  }

  removeAllCart() {
    this.cartItemList = [];
    this.saveCartToStorage();
    this.productList.next(this.cartItemList);
    this.getTotalPrice();
  }

  isProductInCart(productId: number): Observable<boolean> {
    return this.productList
      .asObservable()
      .pipe(
        map((products) => products.some((product) => product.id === productId))
      );
  }
}
