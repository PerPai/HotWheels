import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaModel } from '../models/categoria.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  SRV: string = environment.SRV;
  //Nuevo
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Aplication/json',
    }),
  };

  constructor(private http: HttpClient) {}

  buscar(id: any): Observable<CategoriaModel> {
    return this.http
      .get<CategoriaModel>(`${this.SRV}/categoria/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  filtrar(
    parametros: any,
    pag: number,
    lim: number
  ): Observable<CategoriaModel[]> {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    //this.http.get<ClienteModel>(this.SRV + '/cliente/' + pag + '/' + lim)
    return this.http.get<CategoriaModel[]>(
      `${this.SRV}/categoria/${pag}/${lim}`,
      { params: params }
    );
  }

  guardar(datos: any, id?: any): Observable<any> {
    if (id) {
      //editar
      return this.http
        .put<CategoriaModel>(
          `${this.SRV}/categoria/${id}`,
          datos,
          this.httpOptions
        )
        .pipe(retry(1), catchError(this.handleError));
    } else {
      //crear
      return this.http
        .post<CategoriaModel>(`${this.SRV}/categoria`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    }
  }

  //se trabajó en clases
  eliminar(id: any): Observable<any> {
    return this.http
      .delete(`${this.SRV}/categoria/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
