import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArticuloModel } from '../models/articulo.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ArticuloService {
  SRV: string = environment.SRV;
  //Nuevo
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Aplication/json',
    }),
  };

  constructor(private http: HttpClient) {}

  buscar(id: any): Observable<ArticuloModel> {
    return this.http
      .get<ArticuloModel>(`${this.SRV}/articulo/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  filtrar(
    parametros: any,
    pag: number,
    lim: number
  ): Observable<ArticuloModel[]> {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
   
    return this.http.get<ArticuloModel[]>(
      `${this.SRV}/articulo/${pag}/${lim}`,
      { params: params }
    );
  }

  guardar(datos: any, id?: any): Observable<any> {
    console.log(datos);
    if (id) {
      return this.http
        .put<ArticuloModel>(
          `${this.SRV}/articulo/${id}`,
          datos,
          this.httpOptions
        )
        .pipe(retry(1), catchError(this.handleError));
    } else {
      return this.http
        .post<ArticuloModel>(`${this.SRV}/articulo`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    }
  }

  eliminar(id: any): Observable<any> {
    return this.http
      .delete(`${this.SRV}/articulo/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
