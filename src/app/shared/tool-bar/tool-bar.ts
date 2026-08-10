import {
  Component,
  effect,
  input,
  output,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { Methods } from '../../services/methods';

import {
  ToolbarOptions,
  ParametersReport
} from '../../models/generals-interfaces';

@Component({
  selector: 'app-tool-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  templateUrl: './tool-bar.html',
  styleUrl: './tool-bar.scss'
})
export class ToolBar {

  /**
   * Configuración recibida desde el componente padre.
   */
  public toolbarComponents = input.required<ToolbarOptions>();

  /**
   * Emite los valores cada vez que un parámetro cambia.
   */
  public valuesChange = output<Record<string, any>>();

  /**
   * Emite los valores cuando se presiona el botón de ejecutar.
   */
  public execute = output<Record<string, any>>();

  /**
   * Emite cuando se limpia el toolbar.
   */
  public cleared = output<void>();

  /**
   * Copia interna editable de la configuración.
   */
  public toolbarState = signal<ToolbarOptions>({
    name: '',
    options: []
  });


  public searchValues = signal<Record<string, string>>({});

  constructor(public services: Methods) {
    /**
     * Sincroniza la entrada con el estado interno.
     */
    effect(() => {
      const configuration = this.toolbarComponents();

      this.toolbarState.set({
        name: configuration.name,
        options: configuration.options.map(parameter => ({
          ...parameter,
          value:
            parameter.value ??
            this.getDefaultValue(parameter.type)
        }))
      });
    });
  }

  /**
   * Nombre o título del toolbar.
   */
  get toolbarName(): string {
    return this.toolbarState().name;
  }

  /**
   * Lista de parámetros que se utilizará en el HTML.
   */
  get parameters(): ParametersReport[] {
    return this.toolbarState().options;
  }

  /**
   * Devuelve el valor predeterminado según el tipo de control.
   */
  getDefaultValue(type: string): any {
    switch (type?.toLowerCase()) {
      case 'checkbox':
        return false;

      case 'date':
      case 'datetime':
        return null;

      default:
        return '';
    }
  }

  /**
   * Actualiza el valor de un parámetro.
   */
  updateParameterValue(parameterName: string, value: any): void {
  this.toolbarState.update(toolbar => ({
    ...toolbar,

    options: toolbar.options.map(parameter => {
      if (parameter.name !== parameterName) {
        return parameter;
      }

      if (parameter.readonly) {
        return parameter;
      }

      return {
        ...parameter,
        value
      };
    })
  }));

  const parameter = this.toolbarState().options.find(
    item => item.name === parameterName
  );

  if (parameter?.type === 'select-search') {
    const selectedOption = parameter.options?.find(
      option => option.value === value
    );

    this.searchValues.update(currentValues => ({
      ...currentValues,
      [parameterName]: selectedOption?.label ?? ''
    }));
  }

  this.emitValuesChange();
};

  /**
   * Obtiene todos los valores del toolbar como objeto.
   */
  getToolbarValues(): Record<string, any> {
    return this.toolbarState().options.reduce(
      (values, parameter) => {
        values[parameter.name] = parameter.value;
        return values;
      },
      {} as Record<string, any>
    );
  }

  /**
   * Obtiene la configuración completa, incluyendo el nombre.
   */
  getToolbarResult(): ToolbarOptions {
    const toolbar = this.toolbarState();

    return {
      name: toolbar.name,
      options: toolbar.options.map(parameter => ({
        ...parameter
      }))
    };
  }

  /**
   * Emite los valores actuales.
   */
  emitValuesChange(): void {
    this.valuesChange.emit(this.getToolbarValues());
  }

  /**
   * Ejecuta la acción principal del toolbar.
   */
  executeToolbar(): void {
    this.execute.emit(this.getToolbarValues());
  }

  /**
   * Restablece los controles.
   */
clearToolbar(): void {
  this.toolbarState.update(toolbar => ({
    ...toolbar,

    options: toolbar.options.map(parameter => ({
      ...parameter,

      value: parameter.readonly
        ? parameter.value
        : this.getDefaultValue(parameter.type)
    }))
  }));

  this.searchValues.set({});

  this.valuesChange.emit(this.getToolbarValues());
  this.cleared.emit();
}

// tools de busqueda

  updateSearchText(parameterName: string, value: string): void {
  this.searchValues.update(currentValues => ({
    ...currentValues,
    [parameterName]: value
  }));
}

getOptionLabel(parameter: ParametersReport): string {
  const searchValue = this.searchValues()[parameter.name];

  if (searchValue !== undefined) {
    return searchValue;
  }

  const selectedOption = parameter.options?.find(
    option => option.value === parameter.value
  );

  return selectedOption?.label ?? '';
};

getFilteredOptions(parameter: ParametersReport): any[] {
  const options = parameter.options ?? [];

  const searchText =
    this.searchValues()[parameter.name]?.trim().toLowerCase() ?? '';

  if (!searchText) {
    return options;
  }

  return options.filter(option =>
    String(option.label)
      .toLowerCase()
      .includes(searchText)
  );
}

}