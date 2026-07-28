import {
    CatalogueFormConfig
} from '../models/crud'


export const CATALOGUE_FORM_CONFIGS: CatalogueFormConfig[] = [
  {
    catalogue: 'pumps',
    title: 'Bomba',
    idField: 'Id',
    fields: [
      {
        name: 'Name',
        label: 'Nombre',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el nombre de la bomba',
        colClass: 'col-12 col-md-6'
      },
      {
        name: 'IdPump',
        label: 'Id de Bomba',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el nombre de la bomba',
        colClass: 'col-12 col-md-6'
      },
      {
        name: 'TankId',
        label: 'Tanque asociado',
        type: 'select',
        required: true,
        colClass: 'col-12 col-md-6',
        options: []
      },
            {
        name: 'Type_register',
        label: 'Tipo de registro',
        type: 'select',
        required: true,
        colClass: 'col-12 col-md-6',
        options: [
            {label:'Ingreso',value:'Ingreso'},
            {label:'Salida',value:'Salida'}
        ]
      },
           {
        name: 'comunicationType',
        label: 'Tipo de comunicacion',
        type: 'select',
        required: false,
        colClass: 'col-12 col-md-6',
        options: [
            {label:'WiFi',value:'WiFi'},
            {label:'LAN',value:'LAN'},
            {label:'GPRS',value:'GPRS'},
            {label:'Starlink',value:'Starlink'}
        ]
      }
    ]
  }
];

export function getCatalogueFormConfig(
  catalogue: string
): CatalogueFormConfig | undefined {
  return CATALOGUE_FORM_CONFIGS.find(
    config =>
      config.catalogue.toLowerCase() === catalogue.toLowerCase()
  );
}
