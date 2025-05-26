import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CarritoService } from 'src/app/shared/services/carrito.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  usuario: string = '';
  rol: number = 0; 

  srvAuth = inject(AuthService);
  srvCarrito = inject(CarritoService);

  public totalItem: number = 0;

  constructor() {
    this.srvAuth.usrActual.subscribe((res) => {
      this.usuario = res.nombre;
      this.rol = res.idRol; 
      console.log(res);
    });
  }

  ngOnInit(): void {
    this.srvCarrito.getProducts().subscribe((res) => {
      this.totalItem = res.length;
    });
  }

  onSalir() {
    this.srvAuth.logout();
  }

  mostrarSeccionShop(): boolean {
    return this.rol === 1;
  }

  mostrarSeccionCrudProductos(): boolean {
    return this.rol === 3;
  }
}
