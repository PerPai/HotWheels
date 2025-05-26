import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroModel } from 'src/app/shared/models/registro.model';
import { RegistroService } from 'src/app/shared/services/registro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  frmCliente: FormGroup;
  clientes = [new RegistroModel()];
  srvCliente = inject(RegistroService);
  fb = inject(FormBuilder);
  pagActual = 1;
  itemsPPags = 5;
  numRegs = 0;
  filtro: any;

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
      ], // required
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
      passwF: ['', [Validators.required]], // Agregamos la validación para 'passwF'
    });
  }

  onSubmit() {
    const cliente = {
      idPersona: this.frmCliente.value.idPersona,
      nombre: this.frmCliente.value.nombre,
      apellidoUno: this.frmCliente.value.apellidoUno,
      apellidoDos: this.frmCliente.value.apellidoDos,
      correo: this.frmCliente.value.correo,
      celular: this.frmCliente.value.celular,
      passwF: this.frmCliente.value.passwF,
    };

    this.srvCliente.guardar(cliente, this.frmCliente.value.id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creado con éxito',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.href = '/login';
        });
      },
      error: (e) => {
        switch (e.status) {
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
              title: 'ID ya existe',
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

  filtrar() {
    this.srvCliente
      .filtrar(this.filtro, this.pagActual, this.itemsPPags)
      .subscribe((data) => {
        console.log(Object(data)['datos']);
        this.clientes = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        console.log(this.clientes);
      });
  }
}
