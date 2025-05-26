export class UserModel {
  id?: number; 
  idPersona: string;
  idRol: number;
  nombre: string;
  nombreRol?: string;

  constructor(c?: UserModel) {
    if (this.id !== undefined) {
      this.id = c?.id;
    }

    this.idPersona = c !== undefined ? c.idPersona : '';
    this.idRol = c !== undefined ? c.idRol : 0;
    this.nombre = c !== undefined ? c.nombre : '';
    this.nombreRol = c !== undefined ? c?.nombreRol : '';
  }
}
