import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ProductoModel } from '../models/producto.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private http: HttpClient) {}

  SRV: string = environment.SRV;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  filtrar(
    parametros: any,
    pag: number,
    lim: number
  ): Observable<ProductoModel[]> {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    //this.http.get<ClienteModel>(this.SRV + '/cliente/' + pag + '/' + lim)
    return this.http
      .get<ProductoModel[]>(`${this.SRV}/articulo/${pag}/${lim}`, {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
