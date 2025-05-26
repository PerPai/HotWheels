import { HttpClient } from '@angular/common/http';
import { Token } from '../models/token';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  retry,
  tap,
  map,
  catchError,
  of,
  BehaviorSubject,
} from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { UserModel } from '../models/usuario.model';
import { environment } from 'src/environments/environment.development';
//import { tap, map, catchError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  SRV = environment.SRV;
  http = inject(HttpClient);
  srvToken = inject(TokenService);
  router = inject(Router);
  private usrActualSubject = new BehaviorSubject<UserModel>(new UserModel());
  public usrActual = this.usrActualSubject.asObservable();
  constructor() {}

  public get valorUserActual(): UserModel {
    return this.usrActualSubject.value;
  }

  public login(user: { idUsuario: ''; passw: '' }): Observable<any> {
    return this.http
      .patch<Token>(`${this.SRV}/sesion/iniciar/${user.idUsuario}`, {
        passw: user.passw,
      })
      .pipe(
        retry(1),
        tap((tokens) => {
          this.doLogin(tokens);
          this.router.navigate(['/home']);
        }),
        map(() => true),
        catchError((error) => {
          return of(error.status);
        })
      );
  }

  public logout() {
    if (this.isLogged()) {
      this.http
        .patch(
          `${this.SRV}/sesion/cerrar/${this.valorUserActual.idPersona}`,
          {}
        )
        .subscribe();
      this.doLogout();
    }
    localStorage.clear();
  }

  private doLogin(tokens: Token): void {
    this.srvToken.setTokens(tokens);
    this.usrActualSubject.next(this.getUserActual());
  }

  private doLogout() {
    if (this.srvToken.token) {
      this.srvToken.eliminarTokens();
    }
    this.usrActualSubject.next(this.getUserActual());
  }

  private getUserActual(): UserModel {
    if (!this.srvToken.token) {
      return new UserModel();
    }
    const tokenD = this.srvToken.decodeToken();
    console.log(tokenD);
    return { idPersona: tokenD.sub, nombre: tokenD.nom, idRol: tokenD.idRol };
  }

  public isLogged(): boolean {
    return !!this.srvToken.token && !this.srvToken.jwtTokenExp();
  }

  public verificarRefrescar(): boolean {
    console.log(this.srvToken.tiempoExpToken());
    if (this.isLogged() && this.srvToken.tiempoExpToken() <= 20) {
      console.log('ENTRA');
      this.srvToken.refreshTokens();
      return true;
    } else {
      return false;
    }
  }
}
