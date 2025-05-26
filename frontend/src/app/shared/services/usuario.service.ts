import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { UserModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  http = inject(HttpClient);
  SRV = environment.SRV;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Aplication/json',
    }),
  };
  constructor() {}

  //se trabajó en clases
  changePassw(id: any, datos: {}): Observable<any> {
    return this.http
      .patch(`${this.SRV}/usuario/passw/cambio/${id}`, datos)
      .pipe(retry(1), catchError(this.handleError));
  }
  ////////////////
  buscar(id: any): Observable<UserModel> {
    return this.http
      .get<UserModel>(`${this.SRV}/usuario/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  guardar(datos: any, id: any): Observable<any> {
    if (id) {
      //editar
      return this.http
        .patch<UserModel>(`${this.SRV}/usuario/rol/${id}`, datos)
        .pipe(retry(1), catchError(this.handleError));
    } else {
      //crear
      return this.http
        .post<UserModel>(`${this.SRV}/persona`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    }
  }

  filtrar(parametros: any, pag: number, lim: number): Observable<UserModel[]> {
    console.log(parametros);
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    //this.http.get<ClienteModel>(this.SRV + '/cliente/' + pag + '/' + lim)
    return this.http.get<UserModel[]>(`${this.SRV}/usuario/${pag}/${lim}`, {
      params: params,
    });
  }
  //////////////////
  cambiarRol(id: any, rol: {}): Observable<any> {
    return this.http
      .patch(`${this.SRV}/usuario/rol/${id}`, rol)
      .pipe(retry(1), catchError(this.handleError));
  }

  resetPassw(idCliente: any): Observable<any> {
    return this.http
      .patch(`${this.SRV}/usuario/passw/cambio/${idCliente}`, {
        passwN: idCliente,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
