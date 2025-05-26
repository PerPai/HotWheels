import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RolesX } from '../models/rol.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  SRV: string = environment.SRV;
  //Nuevo
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Aplication/json',
    }),
  };

  constructor(private http: HttpClient) {}

  buscar(id: any): Observable<RolesX> {
    return this.http
      .get<RolesX>(`${this.SRV}/rol/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  filtrar(parametros: any, pag: number, lim: number): Observable<RolesX[]> {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    //this.http.get<ClienteModel>(this.SRV + '/cliente/' + pag + '/' + lim)
    return this.http.get<RolesX[]>(`${this.SRV}/rol/${pag}/${lim}`, {
      params: params,
    });
  }

  guardar(datos: any, id?: any): Observable<any> {
    if (id) {
      //editar
      return this.http
        .put<RolesX>(`${this.SRV}/rol/${id}`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    } else {
      //crear
      return this.http
        .post<RolesX>(`${this.SRV}/rol`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    }
  }

  //se trabajó en clases
  eliminar(id: any): Observable<any> {
    return this.http
      .delete(`${this.SRV}/rol/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
