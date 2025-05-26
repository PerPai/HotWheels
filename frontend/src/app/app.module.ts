import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { Error403Component } from './components/error403/error403.component';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';
import { RefreshTokenInterceptor } from './shared/helpers/refresh-token.interceptor';
import { ProductoComponent } from './components/producto/producto.component';
import { RegisterComponent } from './components/register/register.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ArticuloComponent } from './components/articulo/articulo.component';
import { RolComponent } from './components/rol/rol.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { CambioPassComponent } from './components/cambio-pass/cambio-pass.component';
import { FormsModule } from '@angular/forms';
import { CategoriaUnoComponent } from './components/categoria-uno/categoria-uno.component';
import { CategoriaDosComponent } from './components/categoria-dos/categoria-dos.component';
import { CategoriaTresComponent } from './components/categoria-tres/categoria-tres.component';
import { CategoriaCuatroComponent } from './components/categoria-cuatro/categoria-cuatro.component';
import { CategoriaCincoComponent } from './components/categoria-cinco/categoria-cinco.component';
import { CategoriaSeisComponent } from './components/categoria-seis/categoria-seis.component';

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    Error403Component,
    ProductoComponent,
    RegisterComponent,
    CarritoComponent,
    ProveedorComponent,
    UsuarioComponent,
    RolComponent,
    CategoriaComponent,
    ArticuloComponent,
    CambioPassComponent,
    CategoriaUnoComponent,
    CategoriaDosComponent,
    CategoriaTresComponent,
    CategoriaCuatroComponent,
    CategoriaCincoComponent,
    CategoriaSeisComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    NgxPaginationModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(libreria: FaIconLibrary) {
    libreria.addIconPacks(fas);
  }
}
