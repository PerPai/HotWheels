import { Component, OnInit, inject } from '@angular/core';
import { ClienteService } from '../../shared/services/cliente.service';
import { ClienteModel } from '../../shared/models/cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PrintService } from 'src/app/shared/services/print.service';
import {
  state,
  trigger,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
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
export class ClienteComponent implements OnInit {
  filtro: any;
  srvCliente = inject(ClienteService);
  srvPrint = inject(PrintService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmCliente: FormGroup;
  clientes = [new ClienteModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPags = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmCliente = this.fb.group({
      id: [''],
      idPersona: [
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
          Validators.maxLength(30),
          Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}'),
        ],
      ],
      apellidoUno: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern('([A-Za-zÑñáéíóú]*)'),
        ],
      ],
      apellidoDos: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern('([A-Za-zÑñáéíóú]*)'),
        ],
      ],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.pattern('[0-9]{4}-[0-9]{4}')]],
    });
  }

  get F() {
    return this.frmCliente.controls;
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
    const cliente = {
      idPersona: this.frmCliente.value.idPersona,
      nombre: this.frmCliente.value.nombre,
      apellidoUno: this.frmCliente.value.apellidoUno,
      apellidoDos: this.frmCliente.value.apellidoDos,
      correo: this.frmCliente.value.correo,
      celular: this.frmCliente.value.celular,
      passwF: this.frmCliente.value.idPersona,
    };

    const texto = this.frmCliente.value.id
      ? 'Cambios guardados!!!'
      : 'Creado con Exito!!!';

    this.srvCliente.guardar(cliente, this.frmCliente.value.id).subscribe({
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
              title: 'Cliente no existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            break;

          case 409:
            Swal.fire({
              title: 'idPersona ya existe',
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
    this.titulo = 'Nuevo Cliente';
    //console.log("Creando Nuevo");
    this.frmCliente.reset();
  }

  onEditar(id: any) {
    console.log(id);
    this.titulo = 'Editar Cliente';

    this.srvCliente.buscar(id).subscribe({
      next: (data) => {
        this.frmCliente.setValue(data);
      },

      error: (e) => {
        if (e === 404) {
          Swal.fire({
            title: 'Cliente no existe',
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
    //agregado de confirmacion Noti

    Swal.fire({
      title: 'Seguro que quiere eliminar el cliente?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCliente.eliminar(id).subscribe({
          //next: () => {},
          complete: () => {
            Swal.fire(
              'Eliminado!',
              'Cliente eliminado de forma correcta.',
              'success'
            );
            this.filtrar();
          },
          error: (e) => {
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Cliente no existe',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar el Cliente',
                  text: 'El cliente está ligado a un artefacto',
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
    this.srvCliente.buscar(id).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong>Informacion Clientes</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th> Id </th>' +
          `<td>${data.idPersona}</td></tr>` +
          '<tr><th> Nombre </th>' +
          `<td>${data.nombre} ${data.apellidoUno} ${data.apellidoDos}</td></tr>` +
          '<tr><th> Celular </th>' +
          `<td>${data.celular}</td></tr>` +
          '<tr><th> E-Mail </th>' +
          `<td>${data.correo}</td></tr>` +
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
    const encabezado = [
      'Id Cliente',
      'Nombre',
      'Telefono',
      'Celular',
      'Correo',
    ];
    this.srvCliente.filtrar(this.filtro, 1, this.numRegs).subscribe((data) => {
      const cuerpo = Object(data)['datos'].map((Obj: any) => {
        const datos = [
          Obj.idPersona,
          Obj.nombre + ' ' + Obj.apellidoUno + ' ' + Obj.apellidoDos,
          Obj.telefono,
          Obj.celular,
          Obj.correo,
        ];
        return datos;
      });
      this.srvPrint.print(encabezado, cuerpo, 'Listado de Clientes', true);
    });
  }

  filtrar() {
    this.srvCliente
      .filtrar(this.filtro, this.pagActual, this.itemsPPags)
      .subscribe((data) => {
        this.clientes = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        console.log(this.clientes);
      });
  }

  onFiltrar() {
    this.filtroVisible = !this.filtroVisible;
    if (!this.filtroVisible) {
      this.resetearFiltro();
    }
  }

  resetearFiltro() {
    this.filtro = {
      idPersona: '',
      nombre: '',
      apellidoUno: '',
      apellidoDos: '',
    };
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
