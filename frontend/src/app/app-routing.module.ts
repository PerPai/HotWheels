import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { Roles } from './shared/models/roles';
import { Error403Component } from './components/error403/error403.component';
import { loginGuard } from './shared/guards/login.guard';
import { ProductoComponent } from './components/producto/producto.component';
import { RegisterComponent } from './components/register/register.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ArticuloComponent } from './components/articulo/articulo.component';
import { RolComponent } from './components/rol/rol.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { CambioPassComponent } from './components/cambio-pass/cambio-pass.component';
import { CategoriaUnoComponent } from './components/categoria-uno/categoria-uno.component';
import { CategoriaDosComponent } from './components/categoria-dos/categoria-dos.component';
import { CategoriaTresComponent } from './components/categoria-tres/categoria-tres.component';
import { CategoriaCuatroComponent } from './components/categoria-cuatro/categoria-cuatro.component';
import { CategoriaCincoComponent } from './components/categoria-cinco/categoria-cinco.component';
import { CategoriaSeisComponent } from './components/categoria-seis/categoria-seis.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'rol',
    component: RolComponent,
    canActivate: [authGuard],
    data: { roles: [Roles.Admin] },
  },
  {
    path: 'categoria',
    component: CategoriaComponent,
    canActivate: [authGuard],
    data: { roles: [Roles.Admin] },
  },
  {
    path: 'cliente',
    component: ClienteComponent,
    canActivate: [authGuard],
    data: { roles: [Roles.Admin] },
  },
  { path: 'productos', component: ProductoComponent, canActivate: [authGuard] },
  {
    path: 'proveedor',
    component: ProveedorComponent,
    canActivate: [authGuard],
    data: { roles: [Roles.Admin] },
  },
  {
    path: 'user',
    component: UsuarioComponent,
    canActivate: [authGuard],
    data: { roles: [Roles.Admin] },
  },
  {
    path: 'articulo',
    component: ArticuloComponent,
    canActivate: [authGuard],
    data: { roles: [Roles.Admin, Roles.Empleado] },
  },
  { path: 'carrito', component: CarritoComponent },
  { path: 'productos/control-remoto', component: CategoriaUnoComponent },
  { path: 'productos/exclusivo', component: CategoriaDosComponent },
  { path: 'productos/monster-truck', component: CategoriaTresComponent },
  { path: 'productos/coleccion', component: CategoriaCuatroComponent },
  { path: 'productos/articulos', component: CategoriaCincoComponent },
  { path: 'productos/entretenimiento', component: CategoriaSeisComponent },
  {
    path: 'changePassw',
    component: CambioPassComponent,
    canActivate: [authGuard],
  },
  { path: 'error403', canActivate: [authGuard], component: Error403Component },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
