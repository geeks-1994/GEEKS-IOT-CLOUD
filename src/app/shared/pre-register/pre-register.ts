import {
  Component,
  Inject,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { firstValueFrom } from 'rxjs';

import { Methods } from '../../services/methods';
import { Tools } from '../../services/tools';
import { GtokenDatasession } from '../../models/generals-interfaces';


@Component({
  selector: 'app-pre-register',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './pre-register.html',
  styleUrl: './pre-register.scss',
})
export class PreRegister implements OnInit {

  // =========================================================
  // FORM STATE
  // =========================================================

  readonly token = signal('');

  readonly password = signal('');

  readonly userId = signal('');

  readonly email = signal('');


  // =========================================================
  // UI STATE
  // =========================================================

  readonly passwordValid = signal(false);

  readonly showPassword = signal(false);

  readonly strengthLevel = signal(0);

  readonly strengthLabel = signal('Muy débil');

  readonly validatingToken = signal(false);

  readonly saving = signal(false);


  // =========================================================
  // COMPUTED
  // =========================================================

  readonly tokenDisabled = computed(() => {

    return (
      !this.token().trim() ||
      this.validatingToken()
    );

  });


  readonly passwordDisabled = computed(() => {

    return !this.passwordValid();

  });


  readonly canSave = computed(() => {

    return (
      this.passwordValid() &&
      !!this.userId() &&
      !!this.email() &&
      this.isPasswordStrong(
        this.password()
      ) &&
      !this.saving()
    );

  });


  // =========================================================

  constructor(
    public services: Methods,
    public tools: Tools,

    private dialogref: MatDialogRef<PreRegister>,

    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}


  ngOnInit(): void {}


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  closeModal(): void {

    this.dialogref.close();

  }


  // =========================================================
  // VALIDAR TOKEN
  // =========================================================

  async sendToken(): Promise<void> {

    const token =
      this.token().trim();


    if (!token) {

      this.tools.warning(
        'Token requerido',
        'Por favor ingresa tu token.'
      );

      return;

    }


    if (this.validatingToken()) {
      return;
    }


    this.validatingToken.set(true);


    localStorage.setItem(
      'gsuiteToken',
      token
    );


    this.tools.loading(
      'Validando token...',
      'Espere por favor...'
    );


    try {

      const response: GtokenDatasession =
        await firstValueFrom(
          this.services.validateSession()
        );


      console.log(
        'Token response:',
        response
      );


      const dataSession =
        response?.user;


      if (!dataSession) {

        throw new Error(
          'No se encontró información del usuario'
        );

      }


      // =====================================================
      // ACTUALIZAR SIGNALS
      // =====================================================

      this.userId.set(
        dataSession.userId ?? ''
      );


      this.email.set(
        dataSession.email ?? ''
      );


      this.passwordValid.set(true);


      // Limpiar estado anterior
      this.password.set('');

      this.strengthLevel.set(0);

      this.strengthLabel.set(
        'Muy débil'
      );


      this.tools.success(
        'Token validado',
        'Ahora puedes crear tu contraseña.'
      );

    }
    catch (error) {

      console.error(
        'Error validando token:',
        error
      );


      this.passwordValid.set(false);

      this.userId.set('');

      this.email.set('');

      this.password.set('');

      this.strengthLevel.set(0);

      this.strengthLabel.set(
        'Muy débil'
      );


      localStorage.removeItem(
        'gsuiteToken'
      );


      this.tools.error(
        'Token inválido',
        'Por favor verifica el token e intenta nuevamente.'
      );

    }
    finally {

      this.validatingToken.set(false);

      this.tools.close?.();

    }

  }


  // =========================================================
  // GUARDAR CONTRASEÑA
  // =========================================================

  async save(): Promise<void> {

    if (!this.canSave()) {

      this.tools.warning(
        'Datos incompletos',
        'Asegúrate de validar el token y utilizar una contraseña segura.'
      );

      return;

    }


    if (this.saving()) {
      return;
    }


    this.saving.set(true);


    this.tools.loading(
      'Guardando contraseña...',
      'Espere por favor...'
    );


    try {

      const response: any =
        await firstValueFrom(
          this.services.UpdatePasswordUser(
            this.userId(),
            this.password()
          )
        );


      console.log(
        'Update password response:',
        response
      );


      this.tools.success(
        'Registro completado',
        'La contraseña fue guardada correctamente.'
      );


      // Cerramos modal y devolvemos resultado
      this.dialogref.close({
        success: true,
        userId: this.userId(),
        email: this.email()
      });

    }
    catch (error) {

      console.error(
        'Error guardando contraseña:',
        error
      );


      this.tools.error(
        'No se pudo guardar',
        'Ha ocurrido un error al actualizar la contraseña.'
      );

    }
    finally {

      this.saving.set(false);

      this.tools.close?.();

    }

  }


  // =========================================================
  // SHOW PASSWORD
  // =========================================================

  toggleShowPassword(): void {

    if (!this.passwordValid()) {
      return;
    }


    this.showPassword.update(
      value => !value
    );

  }


  // =========================================================
  // PASSWORD STRENGTH
  // =========================================================

  checkStrength(
    password?: string
  ): void {

    const value =
      password ?? this.password();


    let level = 0;


    if (
      value.length >= 8
    ) {

      level++;

    }


    if (
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value)
    ) {

      level++;

    }


    if (
      /\d/.test(value) &&
      /[^A-Za-z0-9]/.test(value)
    ) {

      level++;

    }


    const finalLevel =
      Math.min(level, 3);


    this.strengthLevel.set(
      finalLevel
    );


    this.strengthLabel.set(
      [
        'Muy débil',
        'Débil',
        'Media',
        'Fuerte'
      ][finalLevel]
    );

  }


  // =========================================================
  // PASSWORD CHANGE
  // =========================================================

  onPasswordChange(
    value: string
  ): void {

    this.password.set(
      value
    );


    this.checkStrength(
      value
    );

  }


  // =========================================================
  // PASSWORD VALIDATION
  // =========================================================

  private isPasswordStrong(
    password: string
  ): boolean {

    if (
      !password ||
      password.length < 8
    ) {

      return false;

    }


    const hasUpper =
      /[A-Z]/.test(password);

    const hasLower =
      /[a-z]/.test(password);

    const hasNumber =
      /\d/.test(password);

    const hasSymbol =
      /[^A-Za-z0-9]/.test(password);


    return (
      hasUpper &&
      hasLower &&
      hasNumber &&
      hasSymbol
    );

  }

}