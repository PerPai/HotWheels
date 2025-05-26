import { Component, OnInit, inject } from '@angular/core';
import { UsuarioService } from '../../shared/services/usuario.service';
import { UserModel } from '../../shared/models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { state, trigger, style, transition, animate } from '@angular/animations';
import { PrintService } from 'src/app/shared/services/print.service';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  animations: [
    trigger('estadoFiltro',[
      state('show',style({
      'max-height' : '100%', 'opacity' : '1', 'visibility' : 'visible'
    })),
    state('hide',style({
      'max-height' : '0%', 'opacity' : '0', 'visibility' : 'hide'
    })),
    transition('show => hide', animate('600ms ease-in-out')),
    transition('hide => show', animate('1000ms ease-in-out')),
  ])
  ]
})
export class UsuarioComponent {

  filtro: any;
  srvUsuario = inject(UsuarioService);
  srvPrint = inject(PrintService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmUsuario: FormGroup;
  user = [new UserModel];
  titulo: string = '';
  pagActual = 1;
  itemsPPags = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible : boolean = false;
  constructor() {
    this.frmUsuario = this.fb.group({
      id: ['', Validators.required], //requrido
      idRol: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]*')]], //requrido
      idPersona: ['', [Validators.required, Validators.maxLength(10),, Validators.pattern('[0-9]*')]], //requrido
      passw: [''], //requrido
      nombre: [''], //requrido
      ultimoAcceso: [''], //requrido
      tkR: [''],
      nombreRol: ['']
      
    });
    
  }

  get stateFiltro(){
    return this.filtroVisible ? 'show' : 'hide';
  }

  onSubmit() {

    const cliente = {

      idRol: this.frmUsuario.value.idRol

    }

const texto = this.frmUsuario.value.idPersona ? 'Cambios guardados!!!' : 'Creado con Exito!!!'
this.srvUsuario.guardar(cliente, this.frmUsuario.value.idPersona)
      .subscribe({
       complete : () => { 
        Swal.fire({
          title: texto,
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000
        });
        this.filtrar();
       },
       error : (e) => {
        switch(e){
          case 404:
            Swal.fire({
              title: 'Usuario no existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar'
            });
            break;

            case 409:
              Swal.fire({
                title: 'ID Usuario ya existe',
                icon: 'error',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cerrar'
              });
            break;
          }
  }
});
  }

  get F() {
    return this.frmUsuario.controls;
  }

  onCambioPag(e: any){
    this.pagActual = e;
    this.filtrar();

  }

  onCambioTama(e: any){
    this.itemsPPags = e.target.value;
    this.pagActual = 1;
    this.filtrar();

  }


 onEditar(id : any){

  console.log(id + "desde buscar");
    this.titulo = 'Editar Usuario';
    this.srvUsuario.buscar(id).subscribe({
      next : (data) => {
        this.frmUsuario.setValue(data);
        console.log(data);
      },
      
      error: (e) => {
        if(e === 404){
          Swal.fire({
            title: 'Usuario no existe',                             
            icon: 'error',
            showCancelButton: true,
            showConfirmButton: false,                
            cancelButtonColor: '#d33',                
            cancelButtonText : 'Cerrar'  
          });
        }
        this.filtrar();
    }  
      
  })
    console.log("editando ",id);
  }

  onInfo(id: any) {
    this.srvUsuario.buscar(id)
    .subscribe(
      data => {
        console.log(data);
        Swal.fire({
          title: '<strong>Informacion Usuarios</strong>',
          html : '<br>'+'<table class="table table-sm table-striped">'+
          '<tbody class="text-start">'+
          '<tr><th> ID </th>'+`<td>${data.idPersona}</td></tr>`+
          '<tr><th> Nombre </th>'+`<td>${data.nombre}</td></tr>`+
          '<tr><th> Rol </th>'+`<td>${data.nombreRol} </td></tr>`+
          
          '</tbody>'+
          '</table>',
          icon: 'info',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cerrar'
        });

      }
    )
    
  }

  onCerrar() {
    this.router.navigate([''])

  }

  
  onImprimir() {
    const encabezado = ["ID Persona", "ID Rol", "Nombre"];
    this.srvUsuario.filtrar(this.filtro, 1, this.numRegs)
      .subscribe(
        data => {
          const cuerpo = Object(data)['datos']
            .map(
              (Obj: any) => {
                const datos = [
                  Obj.idPersona,
                  Obj.idRol ,
                  Obj.nombre
                  
                ]
                return datos;
              }
            )
          this.srvPrint.print(encabezado, cuerpo, "Listado de Usuarios", true);
        }
      )
  }

   filtrar() {
    this.srvUsuario.filtrar(this.filtro, this.pagActual, this.itemsPPags)
      .subscribe(
        data => {
          console.log(Object(data)['datos'])
          this.user = Object(data)['datos'];
          this.numRegs = Object(data)['regs']
        }
      );
  }
  
  onFiltrar(){
this.filtroVisible = !this.filtroVisible;
if(!this.filtroVisible){
  this.resetearFiltro();
}
  }

  resetearFiltro(){
    this.filtro = { idPersona: ''};
    this.filtrar();
  }
  
  onFiltroChange(f:any){
this.filtro = f;
this.filtrar();
}

  ngOnInit() {
this.resetearFiltro();

  }

}
