import { Component, OnInit, inject } from '@angular/core';
import { CategoriaModel } from '../../shared/models/categoria.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  state,
  trigger,
  style,
  transition,
  animate,
} from '@angular/animations';
import Swal from 'sweetalert2';
import { CategoriaService } from 'src/app/shared/services/categoria.service';
import { PrintService } from 'src/app/shared/services/print.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  animations: [
    trigger('estadoFiltro', [
      state(
        'show',
        style({
          'max-height': '100%',
          opacity: '1',
          visibility: 'visible',
        })
      ),
      state(
        'hide',
        style({
          'max-height': '0%',
          opacity: '0',
          visibility: 'hide',
        })
      ),
      transition('show => hide', animate('600ms ease-in-out')),
      transition('hide => show', animate('1000ms ease-in-out')),
    ]),
  ],
})
export class CategoriaComponent {
  filtro: any;
  srvCategoria = inject(CategoriaService);
  srvPrint = inject(PrintService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmCategoria: FormGroup;
  categoria = [new CategoriaModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPags = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;
  constructor() {
    this.frmCategoria = this.fb.group({
      id: [''],
      idCategoria: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requrido
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
          Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}'),
        ],
      ],
      descripcion: ['', [Validators.required,  Validators.minLength(5)]]
    });
  }

  get F() {
    return this.frmCategoria.controls;
  }

  onCambioPag(e: any) {
    this.pagActual = e;
    this.filtrar();
  }

  get stateFiltro() {
    return this.filtroVisible ? 'show' : 'hide';
  }

  onCambioTama(e: any) {
    this.itemsPPags = e.target.value;
    this.pagActual = 1;
    this.filtrar();
  }

  onSubmit() {
    const categoria = {
      idCategoria: this.frmCategoria.value.idCategoria,
      nombre: this.frmCategoria.value.nombre,
      descripcion: this.frmCategoria.value.descripcion,
    };

    const texto = this.frmCategoria.value.id
      ? 'Cambios guardados!!!'
      : 'Creado con Exito!!!';
    console.log('desde aaaa', this.frmCategoria.value.id);
    this.srvCategoria.guardar(categoria, this.frmCategoria.value.id).subscribe({
      complete: () => {
        Swal.fire({
          title: texto,
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000,
        });
        this.filtrar();
      },
      error: (e) => {
        switch (e) {
          case 404:
            Swal.fire({
              title: 'Categoria no existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            break;

          case 409:
            Swal.fire({
              title: 'ID categoria ya existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            break;
        }
      },
    });
  }

  onNuevo() {
    this.titulo = 'Nueva Categoria';
    //console.log("Creando Nuevo");
    this.frmCategoria.reset();
  }

  onEditar(id: any) {
    this.titulo = 'Editar Categoria';
    this.srvCategoria.buscar(id).subscribe({
      next: (data) => {
        this.frmCategoria.setValue(data);
      },

      error: (e) => {
        if (e === 404) {
          Swal.fire({
            title: 'Categoria no existe',
            icon: 'error',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cerrar',
          });
        }
        this.filtrar();
      },
    });
    console.log('editando ', id);
  }

  //se trabajó en clases
  onEliminar(id: any, nombre: string) {
    console.log(id);
    //agregado de confirmacion Noti

    Swal.fire({
      title: 'Seguro que quiere eliminar la categoria?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCategoria.eliminar(id).subscribe({
          //next: () => {},
          complete: () => {
            Swal.fire(
              'Eliminado!',
              'Categoria eliminado de forma correcta.',
              'success'
            );
            this.filtrar();
          },
          error: (e) => {
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Categoria no existe',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar la categoria',
                  text: '',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
            }
          },
        });
      }
    });
  }
  onInfo(id: any) {
    this.srvCategoria.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong>Informacion de Categoria</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th> id Rol </th>' +
          `<td>${data.idCategoria}</td></tr>` +
          '<tr><th> Nombre </th>' +
          `<td>${data.nombre}</td></tr>` +
          '<tr><th> descripcion </th>' +
          `<td>${data.descripcion}</td></tr>` +
          '</tbody>' +
          '</table>',
        icon: 'info',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cerrar',
      });
    });
  }

  onCerrar() {
    this.router.navigate(['']);
  }

  onImprimir() {
    const encabezado = ['ID Categoria', 'Nombre', 'Descripcion'];
    this.srvCategoria
      .filtrar(this.filtro, 1, this.numRegs)
      .subscribe((data) => {
        const cuerpo = Object(data)['datos'].map((Obj: any) => {
          const datos = [Obj.idCategoria, Obj.nombre, Obj.descripcion];
          return datos;
        });
        this.srvPrint.print(encabezado, cuerpo, 'Listado de Categorías', true);
      });
  }

  filtrar() {
    console.log(this.filtro);
    this.srvCategoria
      .filtrar(this.filtro, this.pagActual, this.itemsPPags)
      .subscribe((data) => {
        this.categoria = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        console.log(this.categoria);
      });
  }

  onFiltrar() {
    this.filtroVisible = !this.filtroVisible;
    if (!this.filtroVisible) {
      this.resetearFiltro();
    }
  }

  resetearFiltro() {
    this.filtro = { idCategoria: '', nombre: '', descripcion: '' };
    this.filtrar();
  }

  onFiltroChange(f: any) {
    this.filtro = f;
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
