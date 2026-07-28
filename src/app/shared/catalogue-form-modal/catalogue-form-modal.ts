import { Component,
        EventEmitter,
        Input,
        OnChanges,
        Output,
        SimpleChanges,
        signal } from '@angular/core';

import {CommonModule} from '@angular/common';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';


import {
  CatalogueFormMode,
  CatalogueFormField,
  CatalogueFormConfig
 } from '../../models/crud'
import { MiselanousData } from '../../services/miselanous-data';



@Component({
  selector: 'app-catalogue-form-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './catalogue-form-modal.html',
  styleUrl: './catalogue-form-modal.scss',
})
export class CatalogueFormModal implements OnChanges {



  @Input()
  visible = false;

  @Input()
  mode: CatalogueFormMode = 'create';

  @Input()
  config: CatalogueFormConfig | null = null;

  @Input()
  record: Record<string, unknown> | null = null;

  @Output()
  closeModal = new EventEmitter<void>();

  @Output()
  saveRecord = new EventEmitter<Record<string, unknown>>();

  form = new FormGroup({});

  submitted = signal(false);

  constructor(public dataMiselanous:MiselanousData){

  }

  ngOnChanges(changes: SimpleChanges): void {
    const shouldRebuild =
      changes['config'] ||
      changes['record'] ||
      changes['mode'] ||
      changes['visible'];

    if (shouldRebuild && this.visible) {
      this.buildForm();
    }
  }

  private buildForm(): void {
    if (!this.config) {
      this.form = new FormGroup({});
      return;
    }

    const controls: Record<string, FormControl> = {};

    for (const field of this.config.fields) {
      const validators = this.getValidators(field);
      const initialValue = this.getInitialValue(field);
       
      console.log(field);

      if(field.name == 'TankId'){
       field.options = this.dataMiselanous.miselanousDataTank();
      }

      controls[field.name] = new FormControl(
        {
          value: initialValue,
          disabled: field.disabled ?? false
        },
        validators
      );
    }

    this.form = new FormGroup(controls);
    this.submitted.set(false);
  }

  private getValidators(
    field: CatalogueFormField
  ): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    if (field.min !== undefined) {
      validators.push(Validators.min(field.min));
    }

    if (field.max !== undefined) {
      validators.push(Validators.max(field.max));
    }

    return validators;
  }

  private getInitialValue(
    field: CatalogueFormField
  ): unknown {
    /*
     * UPDATE:
     * Busca el valor dentro del registro seleccionado.
     */
    if (this.mode === 'update' && this.record) {
      const propertyName =
        field.sourceField ?? field.name;

      const recordValue =
        this.record[propertyName];

      if (
        recordValue !== undefined &&
        recordValue !== null
      ) {
        return recordValue;
      }
    }

    /*
     * CREATE:
     * Utiliza el valor predeterminado.
     */
    if (field.defaultValue !== undefined) {
      return field.defaultValue;
    }

    if (field.type === 'checkbox') {
      return false;
    }

    return '';
  }

  isInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);

    if (!control) {
      return false;
    }

    return (
      control.invalid &&
      (control.touched || this.submitted())
    );
  }

  getFieldError(field: CatalogueFormField): string {
    const control = this.form.get(field.name);

    if (!control?.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${field.label} es obligatorio.`;
    }

    if (control.errors['email']) {
      return 'Ingrese un correo electrónico válido.';
    }

    if (control.errors['min']) {
      return `El valor mínimo es ${field.min}.`;
    }

    if (control.errors['max']) {
      return `El valor máximo es ${field.max}.`;
    }

    return 'El valor ingresado no es válido.';
  }

  close(): void {
    this.form.reset();
    this.submitted.set(false);
    this.closeModal.emit();
  }

  submit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues =
      this.form.getRawValue() as Record<string, unknown>;

    /*
     * Conserva datos como el ID cuando sea update.
     */
    const payload: Record<string, unknown> = {
      ...(this.mode === 'update' && this.record
        ? this.record
        : {}),
      ...formValues
    };

    this.saveRecord.emit(payload);
  }

  get modalTitle(): string {
    if (!this.config) {
      return '';
    }

    return this.mode === 'create'
      ? `Nuevo ${this.config.title}`
      : `Editar ${this.config.title}`;
  }

  get submitButtonText(): string {
    return this.mode === 'create'
      ? 'Crear registro'
      : 'Guardar cambios';
  }

}
