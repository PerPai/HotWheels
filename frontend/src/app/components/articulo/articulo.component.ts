import { Component, OnInit, inject } from '@angular/core';
import { ArticuloService } from '../../shared/services/articulo.service';
import {
  state,
  trigger,
  style,
  transition,
  animate,
} from '@angular/animations';
import { ArticuloModel } from '../../shared/models/articulo.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PrintService } from 'src/app/shared/services/print.service';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css'],
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
export class ArticuloComponent implements OnInit {
  cortar = 12;
  imagen1 = '';
  imagen2 = '';
  filtro: any;
  srvArticulo = inject(ArticuloService);
  srvPrint = inject(PrintService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmArticulo: FormGroup;
  articulos = [new ArticuloModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPags = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;
  selectedFiles: { [key: string]: File } = {};

  constructor() {
    this.frmArticulo = this.fb.group({
      id: [''],
      idArticulo: ['', [Validators.required, Validators.pattern('[0-9]*')]], 
      idProveedor: ['', [Validators.required, Validators.pattern('[0-9]*')]], 
      idCategoria: ['', [Validators.required, Validators.pattern('[0-9]*')]], 
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
          Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}'),
        ],
      ],
      precio: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      stock: ['', [Validators.required]],
      imagen1: ['', [Validators.required]],
      imagen2: ['', [Validators.required]],
    });
  }

  get F() {
    return this.frmArticulo.controls;
  }

  onCambioPag(e: any) {
    this.pagActual = e;
    this.filtrar();
  }

  onCambioTama(e: any) {
    this.itemsPPags = e.target.value;
    this.pagActual = 1;
    this.filtrar();
  }

  get stateFiltro() {
    return this.filtroVisible ? 'show' : 'hide';
  }

  onSubmit() {
    const articulo = {
      idArticulo: this.frmArticulo.value.idArticulo,
      idProveedor: this.frmArticulo.value.idProveedor,
      idCategoria: this.frmArticulo.value.idCategoria,
      nombre: this.frmArticulo.value.nombre,
      precio: this.frmArticulo.value.precio,
      descripcion: this.frmArticulo.value.descripcion,
      stock: this.frmArticulo.value.stock,
      imagen1: this.frmArticulo.value.imagen1.substring(this.cortar),
      imagen2: this.frmArticulo.value.imagen2.substring(this.cortar),
    };

    const texto = this.frmArticulo.value.id
      ? 'Cambios guardados!!!'
      : 'Creado con Exito!!!';

    this.srvArticulo.guardar(articulo, this.frmArticulo.value.id).subscribe({
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
              title: 'Articulo no existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            break;

          case 409:
            Swal.fire({
              title: 'ID Articulo ya existe',
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
    this.titulo = 'Nuevo Articulo';
    this.frmArticulo.reset();
  }

  onEditar(id: any) {
    console.log(id);
    this.titulo = 'Editar Articulo';

    this.srvArticulo.buscar(id).subscribe({
      next: (data) => {
        console.log('holaaaa ', data);
        this.frmArticulo.setValue(data);
      },

      error: (e) => {
        if (e === 404) {
          Swal.fire({
            title: 'Articulo no existe',
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

  onEliminar(id: any, nombre: string) {
    Swal.fire({
      title: 'Seguro que quiere eliminar el articulo?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvArticulo.eliminar(id).subscribe({
          complete: () => {
            Swal.fire(
              'Eliminado!',
              'Articulo eliminado de forma correcta.',
              'success'
            );
            this.filtrar();
          },
          error: (e) => {
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Articulo no existe',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar el articulo',
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
    this.srvArticulo.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong>Informacion Articulos</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th> ID </th>' +
          `<td>${data.idArticulo}</td></tr>` +
          '<tr><th> ID Proveedor </th>' +
          `<td>${data.idProveedor}</td></tr>` +
          '<tr><th> ID Categoria </th>' +
          `<td>${data.idCategoria}</td></tr>` +
          '<tr><th> Nombre </th>' +
          `<td>${data.nombre}</td></tr>` +
          '<tr><th> Precio </th>' +
          `<td>${data.precio}</td></tr>` +
          '<tr><th> Descripcion </th>' +
          `<td>${data.descripcion}</td></tr>` +
          '<tr><th> Stock </th>' +
          `<td>${data.stock}</td></tr>` +
          '<tr><th> Primera Imagen </th>' +
          `<td>${data.imagen1}</td></tr>` +
          '<tr><th> Segunda Imagen </th>' +
          `<td>${data.imagen2}</td></tr>` +
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

  filtrar() {
    this.srvArticulo
      .filtrar(this.filtro, this.pagActual, this.itemsPPags)
      .subscribe((data) => {
        this.articulos = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        console.log(this.articulos);
      });
  }

  onImprimir() {
    const encabezado = [
      'ID Articulo',
      'Nombre',
      'Precio',
      'Descripcion',
      'Stock',
      'Primera Imagen',
      'Segunda Imagen',
    ];
    this.srvArticulo.filtrar(this.filtro, 1, this.numRegs).subscribe((data) => {
      const cuerpo = Object(data)['datos'].map((Obj: any) => {
        const datos = [
          Obj.idArticulo,
          Obj.nombre,
          Obj.precio,
          Obj.descripcion,
          Obj.stock,
          Obj.imagen1,
          Obj.imagen2,
        ];
        return datos;
      });
      this.srvPrint.print(encabezado, cuerpo, 'Listado de Articulos', true);
    });
  }

  onFiltrar() {
    this.filtroVisible = !this.filtroVisible;
    if (!this.filtroVisible) {
      this.resetearFiltro();
    }
  }

  resetearFiltro() {
    this.filtro = { idArticulo: '', nombre: '', idCategoriaArticulo: '' };
    this.filtrar();
  }

  onFiltroChange(f: any) {
    this.filtro = f;
    this.filtrar();
  }

  ngOnInit() {
    this.resetearFiltro();
  }

  handleFileSelect(event: any, controlName: string) {
    const selectedFile = event.target.files[0];
    this.selectedFiles[controlName] = selectedFile;
  }

}
