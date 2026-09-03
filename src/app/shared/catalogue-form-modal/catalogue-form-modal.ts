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
  CatalogueFormConfig,
  CatalogueOption
 } from '../../models/crud'
import { MiselanousData } from '../../services/miselanous-data';
import {MatAutocomplete,MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatOptionModule} from '@angular/material/core'

@Component({
  selector: 'app-catalogue-form-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocomplete,
    MatAutocompleteModule,
    MatOptionModule
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
  };


private readonly displayFunctions = new Map<string,(value: unknown) => string>();

  private buildForm(): void {
    if (!this.config) {
      this.form = new FormGroup({});
      return;
    }

    const controls: Record<string, FormControl> = {};

    for (const field of this.config.fields) {
      const validators = this.getValidators(field);
      const initialValue = this.getInitialValue(field);
       
    // console.log(field);

      if(field.name == 'FK_TankSF'){
       field.options = this.dataMiselanous.miselanousDataTank();
      }

      if(field.name == 'FK_group_vehicle'){
        field.options = this.dataMiselanous.MiselanousDataGroup();
      } 
      if(field.name == 'FK_vehicle_type'){
        field.options = this.dataMiselanous.miselanousDataVehicleBrand();

      } if(field.name == 'VehicleFK' ){
      
        field.options = this.dataMiselanous.miselanousDataVehicle();
      
      }


         // console.log(this.dataMiselanous.MiselanousDataProduct());


       if(field.name == 'FK_product'){
          field.options = this.dataMiselanous.MiselanousDataProduct();
        
       };


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
  };

// private getInitialValue(
//   field: CatalogueFormField
// ): unknown {

//   /**
//    * UPDATE:
//    * Busca el valor dentro del registro seleccionado.
//    */
//   if (this.mode === 'update' && this.record) {

//     const propertyName =
//       field.sourceField ?? field.name;

//     const recordValue =
//       this.record[propertyName];

//     if (
//       recordValue !== undefined &&
//       recordValue !== null
//     ) {

//       /**
//        * El autocomplete necesita el objeto completo
//        * para mostrar option.label.
//        */
//       if (field.type === 'search-select') {
//         return this.resolveSearchSelectValue(
//           field,
//           recordValue
//         );
//       }

//       return recordValue;
//     }
//   }

//   /**
//    * CREATE:
//    * Utiliza el valor predeterminado.
//    */
//   if (field.defaultValue !== undefined) {

//     if (field.type === 'search-select') {
//       return this.resolveSearchSelectValue(
//         field,
//         field.defaultValue
//       );
//     }

//     return field.defaultValue;
//   }

//   if (field.type === 'checkbox') {
//     return false;
//   }

//   /**
//    * Para autocomplete es preferible null.
//    */
//   if (field.type === 'search-select') {
//     return null;
//   }

//   return '';
// }


private getInitialValue(
  field: CatalogueFormField
): unknown {

  /**
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

      /**
       * El autocomplete necesita el objeto completo
       * para mostrar option.label.
       */
      if (field.type === 'search-select') {
        return this.resolveSearchSelectValue(
          field,
          recordValue
        );
      }

      return recordValue;
    }
  }

  /**
   * CREATE:
   * Utiliza el valor predeterminado.
   */
  if (field.defaultValue !== undefined) {

    if (field.type === 'search-select') {
      return this.resolveSearchSelectValue(
        field,
        field.defaultValue
      );
    }

    return field.defaultValue;
  }

  if (field.type === 'checkbox') {
    return false;
  }

  /**
   * Para autocomplete es preferible null.
   */
  if (field.type === 'search-select') {
    return null;
  }

  return '';
};



private resolveSearchSelectValue(
  field: CatalogueFormField,
  value: unknown
): CatalogueOption | null {

  /**
   * Si el valor ya tiene la estructura correcta,
   * no es necesario volver a buscarlo.
   */
  if (
    value !== null &&
    typeof value === 'object' &&
    'label' in value &&
    'value' in value
  ) {
    return value as CatalogueOption;
  }

  /**
   * Busca la opción utilizando el ID guardado.
   */
  const selectedOption = (field.options ?? []).find(
    option =>
      String(option.SFValue) === String(value)
  );

  return selectedOption ?? null;
};

getFilteredOptions(
  field: CatalogueFormField
): CatalogueOption[] {

  const options = field.options ?? [];
  const controlValue = this.form.get(field.name)?.value;

  if (
    controlValue === null ||
    controlValue === undefined ||
    controlValue === ''
  ) {
    return options;
  }

  const searchText =
    typeof controlValue === 'object'
      ? controlValue.label
      : String(controlValue);

  const normalizedSearch = this.normalizeText(searchText);

  return options.filter(option => {
    const normalizedLabel = this.normalizeText(option.label);
    const normalizedValue = this.normalizeText(option.SFValue);

    return (
      normalizedLabel.includes(normalizedSearch) ||
      normalizedValue.includes(normalizedSearch)
    );
  });
};


getDisplayFunction(
  field: CatalogueFormField
): (value: unknown) => string {

  const existingFunction = this.displayFunctions.get(field.name);

  if (existingFunction) {
    return existingFunction;
  }

  const displayFunction = (value: unknown): string => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '';
    }

    const option = (field.options ?? []).find(
      item => String(item.value) === String(value)
    );

    return option?.label ?? String(value);
  };

  this.displayFunctions.set(field.name, displayFunction);

  return displayFunction;
};

displaySearchOption = (
  option: CatalogueOption | string | number | null
): string => {

  if (
    option === null ||
    option === undefined
  ) {
    return '';
  }

  if (typeof option === 'object') {
    return option.label ?? '';
  }

  return String(option);
};



private normalizeText(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
openAutocomplete(event: Event): void {
  const input = event.target as HTMLInputElement;

  input.select();
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


 const fields = this.config?.fields ?? [];

  const normalizedValues = fields.reduce(
    (
      result: Record<string, unknown>,
      field: CatalogueFormField
    ) => {

      const currentValue = formValues[field.name];

      if (
        field.type === 'search-select' &&
        currentValue !== null &&
        typeof currentValue === 'object' &&
        'SFValue' in currentValue
      ) {
        result[field.name] = (
          currentValue as CatalogueOption
        ).SFValue;
      } else {
        result[field.name] = currentValue;
      }

      return result;
    },
    {}
  );



    /*
     * Conserva datos como el ID cuando sea update.
     */
    const payload: Record<string, unknown> = {
      ...(this.mode === 'update' && this.record
        ? this.record
        : {}),
      ...normalizedValues
    };

    this.saveRecord.emit(payload);
  };

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
