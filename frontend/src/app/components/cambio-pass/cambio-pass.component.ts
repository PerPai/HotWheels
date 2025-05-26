import { Component, inject } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { notEqualsValidator } from 'src/app/shared/validators/passw-equals';
import { passwStrengthValidator } from 'src/app/shared/validators/passw-strength';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-pass',
  templateUrl: './cambio-pass.component.html',
  styleUrls: ['./cambio-pass.component.css'],
})
export class CambioPassComponent {
  frmChangePassw: FormGroup;
  router = inject(Router);
  fb = inject(FormBuilder);
  SrvUsuario = inject(UsuarioService);
  authSrv = inject(AuthService);
  errorLogin: boolean = false;

  constructor() {
    this.frmChangePassw = this.fb.group(
      {
        passw: ['', Validators.required],
        passwN: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            passwStrengthValidator(),
          ],
        ],
        passwR: ['', Validators.required],
      },
      { validator: [notEqualsValidator()] } as AbstractControlOptions
    );
  }

  get F() {
    return this.frmChangePassw.controls;
  }

  onSubmit() {
    this.SrvUsuario.changePassw(this.authSrv.valorUserActual.idPersona, {
      passw: this.frmChangePassw.value.passw,
      passwN: this.frmChangePassw.value.passwN,
    }).subscribe({
      complete: () => {
        Swal.fire({
          title: 'Contraseña cambiada',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000,
        });
        this.onCerrar();
      },
      error: (e) => {
        Swal.fire({
          title: 'Credenciales no válidas',
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cerrar',
        });
      },
    });
  }

  onCerrar() {
    this.router.navigate(['/home']);
  }
}
