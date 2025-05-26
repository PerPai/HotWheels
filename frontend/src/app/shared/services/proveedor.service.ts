import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProveedorModel } from '../models/proveedor.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  constructor(private http: HttpClient) {}

  SRV: string = environment.SRV;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Aplication/json',
    }),
  };

  buscar(id: any): Observable<ProveedorModel> {
    return this.http
      .get<ProveedorModel>(`${this.SRV}/proveedor/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  filtrar(
    parametros: any,
    pag: number,
    lim: number
  ): Observable<ProveedorModel[]> {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    return this.http.get<ProveedorModel[]>(
      `${this.SRV}/proveedor/${pag}/${lim}`,
      { params: params }
    );
  }

  guardar(datos: any, id?: any): Observable<any> {
    if (id) {
      //editar
      return this.http
        .put<ProveedorModel>(
          `${this.SRV}/proveedor/${id}`,
          datos,
          this.httpOptions
        )
        .pipe(retry(1), catchError(this.handleError));
    } else {
      //crear
      return this.http
        .post<ProveedorModel>(`${this.SRV}/proveedor`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    }
  }

  eliminar(id: any): Observable<any> {
    return this.http
      .delete(`${this.SRV}/proveedor/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
