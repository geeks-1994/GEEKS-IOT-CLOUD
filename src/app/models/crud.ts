export type CatalogueFormMode = 'create' | 'update';

export type CatalogueInputType =
  | 'text'
  | 'number'
  | 'email'
  | 'date'
  | 'textarea'
  | 'select'
  | 'checkbox';

export interface CatalogueOption {
  label: string;
  value: string | number | boolean;
}

export interface CatalogueFormField {
  /**
   * Nombre que se enviará a la API.
   */
  name: string;

  /**
   * Propiedad desde la que se leerá el valor al editar.
   * Si no se define, se utiliza `name`.
   */
  sourceField?: string;

  label: string;
  type: CatalogueInputType;

  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: unknown;

  min?: number;
  max?: number;
  step?: number;

  colClass?: string;

  options?: CatalogueOption[];
}

export interface CatalogueFormConfig {
  /**
   * Nombre utilizado en la ruta o catálogo actual.
   */
  catalogue: string;

  /**
   * Nombre legible para mostrar en el modal.
   */
  title: string;

  /**
   * Campo identificador del registro.
   */
  idField: string;

  fields: CatalogueFormField[];
}