import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistroModel } from '../models/registro.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  SRV: string = environment.SRV;
  //Nuevo
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Aplication/json',
    }),
  };

  constructor(private http: HttpClient) {}

  buscar(id: any): Observable<RegistroModel> {
    return this.http
      .get<RegistroModel>(`${this.SRV}/persona/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  filtrar(
    parametros: any,
    pag: number,
    lim: number
  ): Observable<RegistroModel[]> {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    //this.http.get<ClienteModel>(this.SRV + '/cliente/' + pag + '/' + lim)
    return this.http.get<RegistroModel[]>(`${this.SRV}/persona/${pag}/${lim}`, {
      params: params,
    });
  }

  guardar(datos: any, id?: any): Observable<any> {
    console.log('soy datos: ', datos);
    if (id) {
      //editar
      return this.http
        .put<RegistroModel>(
          `${this.SRV}/persona/${id}`,
          datos,
          this.httpOptions
        )
        .pipe(retry(1), catchError(this.handleError));
    } else {
      //crear
      console.log('entre en crear');
      return this.http
        .post<RegistroModel>(`${this.SRV}/persona`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    }
  }

  //se trabajó en clases
  eliminar(id: any): Observable<any> {
    return this.http
      .delete(`${this.SRV}/persona/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
