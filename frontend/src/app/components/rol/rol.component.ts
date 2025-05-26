import { Component, OnInit, inject } from '@angular/core';
import { RolesX } from '../../shared/models/rol.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { state, trigger, style, transition, animate } from '@angular/animations';
import { RolService } from 'src/app/shared/services/rol.service';
import { PrintService } from 'src/app/shared/services/print.service';



@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css'],
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
export class RolComponent {
  filtro: any;
  srvRoles = inject(RolService);
  srvPrint = inject(PrintService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmRol: FormGroup;
  rol = [new RolesX];
  titulo: string = '';
  pagActual = 1;
  itemsPPags = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible : boolean = false;
  constructor() {
    this.frmRol = this.fb.group({
      id: [''],
      idRol: ['', [Validators.required, Validators.maxLength(15), Validators.pattern('[0-9]*')]], //requrido
      nombreRol: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}')]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]]
   
    });
  }

  get F() {
    return this.frmRol.controls;
  }

  get stateFiltro(){
    return this.filtroVisible ? 'show' : 'hide';
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

  onSubmit() {
    const rol = {
      idRol : this.frmRol.value.idRol,
      nombreRol : this.frmRol.value.nombreRol,
      descripcion : this.frmRol.value.descripcion
    }

const texto = this.frmRol.value.id ? 'Cambios guardados!!!' : 'Creado con Exito!!!'

    this.srvRoles.guardar(rol, this.frmRol.value.id)
      .subscribe({
       complete : () => {
        Swal.fire({
          title: texto,
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000
        });
        this.filtrar()
       },
       error : (e) => {
        switch(e){
          case 404:
            Swal.fire({
              title: 'Rol no existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar'
            });
            break;

            case 409:
              Swal.fire({
                title: 'ID Rol ya existe',
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

  onNuevo() {
    this.titulo = 'Nuevo Rol';
    //console.log("Creando Nuevo");
    this.frmRol.reset();
  }

 onEditar(id : any){

  
    this.titulo = 'Editar Rol';
    this.srvRoles.buscar(id).subscribe({
      next : (data) => {
        this.frmRol.setValue(data);
      },
      
      error: (e) => {
        if(e === 404){
          Swal.fire({
            title: 'Rol no existe',                             
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
    console.log("editando ", id);
  }

  //se trabajó en clases
  onEliminar(id: any, nombre: string) {
    console.log(id);
    //agregado de confirmacion Noti

    Swal.fire({
      title: 'Seguro que quiere eliminar el rol?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvRoles.eliminar(id).subscribe(
          {
            //next: () => {},
            complete: () => {
              Swal.fire(
                'Eliminado!',
                'Rol eliminado de forma correcta.',
                'success'
              );
              this.filtrar()
            },
            error: (e) => { 
              switch(e){
                case 404:
                  Swal.fire({
                    title: 'Rol no existe',
                    icon: 'info',
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cerrar'
                  });
                break;
                case 412:
                  Swal.fire({
                    title: 'No se puede eliminar el Rol',
                    text : '',
                    icon: 'info',
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
    })
  }
  onInfo(id: any) {
    this.srvRoles.buscar(id)
    .subscribe(
      data => {
        console.log(data);
        Swal.fire({
          title: '<strong>Informacion Roles</strong>',
          html : '<br>'+'<table class="table table-sm table-striped">'+
          '<tbody class="text-start">'+
          '<tr><th> id Rol </th>'+`<td>${data.idRol}</td></tr>`+
          '<tr><th> Nombre </th>'+`<td>${data.nombreRol}</td></tr>`+
          '<tr><th> descripcion </th>'+`<td>${data.descripcion}</td></tr>`+
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
    const encabezado = ["ID Rol", "Nombre", "Descripcion"];
    this.srvRoles.filtrar(this.filtro, 1, this.numRegs)
      .subscribe(
        data => {
          const cuerpo = Object(data)['datos']
            .map(
              (Obj: any) => {
                const datos = [
                  Obj.idRol,
                  Obj.nombreRol ,
                  Obj.descripcion
                ]
                return datos;
              }
            )
          this.srvPrint.print(encabezado, cuerpo, "Listado de Roles", true);
        }
      )
  }

   filtrar() {
    console.log(this.filtro );
    this.srvRoles.filtrar(this.filtro, this.pagActual, this.itemsPPags)
      .subscribe(
        data => {
          this.rol = Object(data)['datos'];
          this.numRegs = Object(data)['regs']
          console.log(this.rol);
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
    this.filtro = {idRol: ''};
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
