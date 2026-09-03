export type CatalogueFormMode = 'create' | 'update';

export type CatalogueInputType =
  | 'text'
  | 'number'
  | 'email'
  | 'date'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'selectFK'
  | 'search-select'

  type CrudMethod = | 'create'
  | 'update'
  | 'delete'

export interface ParameterOptions {
  name:string;
  value:any;
 }

export interface CatalogueOption {
  label: string;
  value: string | number | boolean;
  SFValue?:string | number 
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
};




export interface crudService {
 nameObject:string;
TypeMethod:CrudMethod;
user:string;
password:string;
company:string
parametersData:ParameterOptions[]

}


export interface ResponseCrud{
  success:string;
  operation:string;
  response:any;
}