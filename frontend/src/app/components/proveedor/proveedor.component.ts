import { Component, OnInit, inject } from '@angular/core';
import { ProveedorService } from '../../shared/services/proveedor.service';
import { ProveedorModel } from '../../shared/models/proveedor.model';
import { state, trigger, style, transition, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PrintService } from 'src/app/shared/services/print.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
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

export class ProveedorComponent implements OnInit {

  filtro: any;
  srvProveedor = inject(ProveedorService);
  srvPrint = inject(PrintService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmProveedor: FormGroup;
  proveedor = [new ProveedorModel];
  titulo: string = '';
  pagActual = 1;
  itemsPPags = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible : boolean = false;

  constructor() {
    this.frmProveedor = this.fb.group({
      id: [''],
      idProveedor: ['', [Validators.required, Validators.maxLength(15), Validators.pattern('[0-9]*')]], //requrido
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}')]],
      telefono: ['', [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}')]],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  get F() {
    return this.frmProveedor.controls;
  }

  onCambioPag(e: any){
    this.pagActual = e;
    this.filtrar();
  }
  
  get stateFiltro(){
    return this.filtroVisible ? 'show' : 'hide';
  }
  
  onCambioTama(e: any){
    this.itemsPPags = e.target.value;
    this.pagActual = 1;
    this.filtrar();

  }

  onSubmit() {

    const proveedor = {
      idProveedor: this.frmProveedor.value.idProveedor,
      nombre: this.frmProveedor.value.nombre,
      telefono: this.frmProveedor.value.telefono,
      correo: this.frmProveedor.value.correo
    }

  const texto = this.frmProveedor.value.id ? 'Cambios guardados!!!' : 'Creado con Exito!!!'

    this.srvProveedor.guardar(proveedor, this.frmProveedor.value.id)
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
              title: 'Proveedor no existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar'
            });
            break;

            case 409:
              Swal.fire({
                title: 'ID proveedor ya existe',
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
    this.titulo = 'Nuevo Proveedor';
    this.frmProveedor.reset();
  }

 onEditar(id : any){
  console.log(id);
    this.titulo = 'Editar Proveedor';
    
    this.srvProveedor.buscar(id).subscribe({
      next : (data) => {  
        this.frmProveedor.setValue(data);
      },
      
      error: (e) => {
        if(e === 404){
          Swal.fire({
            title: 'Proveedor no existe',                             
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

  onEliminar(id: any, nombre: string) {

    Swal.fire({
      title: 'Seguro que quiere eliminar el proveedor?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvProveedor.eliminar(id).subscribe(
          {
            complete: () => {
              Swal.fire(
                'Eliminado!',
                'Proveedor eliminado de forma correcta.',
                'success'
              );
              this.filtrar()
            },
            error: (e) => { 
              switch(e){
                case 404:
                  Swal.fire({
                    title: 'Proveedor no existe',
                    icon: 'info',
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cerrar'
                  });
                break;
                case 412:
                  Swal.fire({
                    title: 'No se puede eliminar el Proveedor',
                    text : 'Proveedor',
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
    this.srvProveedor.buscar(id)
    .subscribe(
      data => {
        console.log(data);
        Swal.fire({
          title: '<strong>Informacion Proveedores</strong>',
          html : '<br>'+'<table class="table table-sm table-striped">'+
          '<tbody class="text-start">'+
          '<tr><th> ID </th>'+`<td>${data.idProveedor}</td></tr>`+
          '<tr><th> Nombre </th>'+`<td>${data.nombre}</td></tr>`+
          '<tr><th> Telefono </th>'+`<td>${data.telefono}</td></tr>`+
          '<tr><th> E-Mail </th>'+`<td>${data.correo}</td></tr>`+
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
    const encabezado = ["Id Proveedor", "Nombre", "Tel", "E-Mail"];
    this.srvProveedor.filtrar(this.filtro, 1, this.numRegs)
      .subscribe(
        data => {
          const cuerpo = Object(data)['datos']
            .map(
              (Obj: any) => {
                const datos = [
                  Obj.idProveedor,
                  Obj.nombre ,
                  Obj.telefono,
                  Obj.correo,
                ]
                return datos;
              }
            )
          this.srvPrint.print(encabezado, cuerpo, "Listado de Proveedores", true);
        }
      )
  }

   filtrar() {
    this.srvProveedor.filtrar(this.filtro, this.pagActual, this.itemsPPags)
      .subscribe(
        data => {
          this.proveedor = Object(data)['datos'];
          this.numRegs = Object(data)['regs']
          console.log(this.proveedor);
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
    this.filtro = { idProveedor: '', nombre: '', telefono: '', correo: '' }; // n c
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
