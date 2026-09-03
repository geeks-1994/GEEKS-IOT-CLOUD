import {
    CatalogueFormConfig
} from '../models/crud'


export const CATALOGUE_FORM_CONFIGS: CatalogueFormConfig[] = [
  {
    catalogue: 'pumps',
    title: 'Bombas o Surtidores de combustible',
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
        name: 'FK_TankSF',
        label: 'Tanque asociado',
        type: 'selectFK',
        required: true,
        colClass: 'col-12 col-md-6',
        options: [
          {label:'todos',value:'todo', SFValue:''}
        ]
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
  },
  {
    catalogue:'tanks',
    title:'Tanques',
    idField:'Id',
    fields:[
    {
        name: 'Name',
        label: 'Nombre',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el nombre del Tanque',
        colClass: 'col-12 col-md-6'
      },
      {
        name: 'TankId',
        label: 'Id de Tanque',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el nombre de la bomba',
        colClass: 'col-12 col-md-6'
      },
      {
        name:'description',
        label:'Descripcion',
        type:'textarea',
        required:false,
        placeholder:'Descripcion del tanque ingresado',
        colClass:'col-12 col-md-12'
      },
      {
       name:'last_activity',
       label:'Ultima actualizacion',
       type:'text',
       required:false,
       disabled:true,
       colClass:'col-12 col-md-6'

      },
           {
       name:'last_Activity_type',
       label:'Ultima actividad',
       type:'text',
       required:false,
       disabled:true,
       colClass:'col-12 col-md-6'

      },
      //datos numericos
      {
       name:'capacity',
       label:'Capacidad del tanque',
       type:'number',
       required:true,
       placeholder:'Ingrese la capacidad del tanque.',
       colClass:'col-12 col-md-6'

      },
      {
       name:'calibrationVolume',
       label:'Volumen de  calibracion',
       type:'number',
       required:true,
       placeholder:'Establece la cantidad de calibracion',
       colClass:'col-12 col-md-6'
      },
 // datos booleanos
  {
    name:'active',
    label:'Tanque activo',
    type:'checkbox',
    required:false,
    placeholder:'Activar el tanque',
    colClass:'col-12 col-md-6'
  },
  {
    name:'sensorActive',
    label:'Sensor',
    type:'checkbox',
    required:false,
    placeholder:'Activar sensor de combustible',
    colClass:'col-12 col-md-6'
  },

  //email 1 
  {
       name:'umbral_1',
       label:'Umbral de alerta 1',
       type:'number',
       min:0,
       max:30,
       required:false,
       placeholder:'Ingrese el primer Umbral 0 a 30 %',
       colClass:'col-12 col-md-6'
  },
   {
       name:'email_1',
       label:'correo de alerta umbral 1',
       type:'email',
       required:false,
       placeholder:'Correo a notificar la primera alerta',
       colClass:'col-12 col-md-6'
  },
   {
       name:'umbral_2',
       label:'Umbral de alerta 2',
       type:'number',
       min:31,
       max:60,
       required:false,
       placeholder:'Ingrese el primer Umbral 31 a 60 %',
       colClass:'col-12 col-md-6'
  },
   {
       name:'email_2',
       label:'correo de alerta umbral 2',
       type:'email',
       required:false,
       placeholder:'Correo a notificar la segunda alerta',
       colClass:'col-12 col-md-6'
  },
   {
       name:'umbral_3',
       label:'Umbral de alerta 3',
       type:'number',
       min:60,
       max:100,
       required:false,
       placeholder:'Ingrese el primer Umbral 61 a 100 %',
       colClass:'col-12 col-md-6'
  },
   {
       name:'email_3',
       label:'correo de alerta umbral 3',
       type:'email',
       required:false,
       placeholder:'Correo a notificar la tercera alerta',
       colClass:'col-12 col-md-6'
  },

  //alerta de desconexion
     {
       name:'email_4',
       label:'correo de alerta de desconexion. ',
       type:'email',
       required:false,
       placeholder:'Correo a notificar desconexion de la consola.',
       colClass:'col-12 col-md-6'
  }

    ]
  },
  {
    catalogue:'type_vehicles',
    title:'Tipo de Vehiculos',
    idField:'Id',
    fields:[
      {
        name: 'Name',
        label: 'Nombre del Tipo de vehiculo.',
        type: 'text',
        required: true,
        placeholder: 'Ingrese ',
        colClass: 'col-12 col-md-6'
      },
        {
    name:'active',
    label:'Activo',
    type:'checkbox',
    required:true,
    placeholder:'Activar Propiedad',
    colClass:'col-12 col-md-6'
  }

    ]
  },
  {
    catalogue:'product',
    title:'Productos',
    idField:'Id',
    fields:[
      {
        name:'Name',
        label:'Nombre del producto',
        type:'text',
        required:true,
        placeholder:'Ingrese el nombre del producto.',
        colClass:'col-12 col-md-6'
      },
 
       {
       name:'numberActive',
       label:'Numero del Activo',
       type:'number',
       required:false,
       placeholder:'Ingrese el numero del activo.',
       colClass:'col-12 col-md-6'
  },
       {
    name:'active',
    label:'Activo',
    type:'checkbox',
    required:true,
    placeholder:'Activar Propiedad',
    colClass:'col-12 col-md-6'
  },
  {
        name:'description',
        label:'Descripcion',
        type:'textarea',
        required:false,
        placeholder:'Descripcion del producto a ingresar.',
        colClass:'col-12 col-md-6'
      }

    ]
  },
  {
    catalogue:'group',
    title:'Grupo de Vehiculos',
    idField:'Id',
    fields:[
       {
        name:'Name',
        label:'Nombre del producto',
        type:'text',
        required:true,
        placeholder:'Ingrese el nombre del producto.',
        colClass:'col-12 col-md-6'
      },
         {
    name:'active',
    label:'Activo',
    type:'checkbox',
    required:true,
    placeholder:'Activar Propiedad',
    colClass:'col-12 col-md-6'
  }

    ]
  },
  {
    catalogue:'vehicles',
    title:"Vehiculo",
    idField:'Id',
    fields:[
     {
        name: 'Id',
        label: 'Id Salesforce',
        type: 'text',
        disabled:true,
        placeholder: 'Id del item salesforce',
        colClass: 'col-12 col-md-6'
      },
      {
        name: 'Name',
        label: 'Nombre del vehiculo',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el nombre del vehiculo',
        colClass: 'col-12 col-md-6'
      },
      {
        name: 'VehicleName',
        label: 'Id del Vehiculo',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el Id del vehiculo',
        colClass: 'col-12 col-md-6'
      },
      {
        name: 'PlateNumber',
        label: 'N# de Placa',
        type: 'text',
        required:false,
        placeholder: 'Ingrese la Placa del Vehiculo',
        colClass: 'col-12 col-md-6'
      },
      {
        name:'Active',
        label:'Estado del Vehiculo',
        type:'checkbox',
        required:true,
        colClass: 'col-12 col-md-12'
      },
      {
        name:'TankCapacity',
        label:'Capacidad de tanque',
        type:'number',
        required:false,
        colClass: 'col-12 col-md-6'
      },
      {
        name:'FK_group_vehicle',
        label:'Grupo de Vehiculo',
        type:'selectFK',
        required:false,
        colClass: 'col-12 col-md-6',
        options:[]

      },
      {
       name:'FK_vehicle_type',
       label:'Tipo de vehiculo',
       type:'selectFK',
       required:false,
       colClass:'col-12 col-md-6',
       options:[]
      },
      {
        name:'FK_product',
        label:'Producto',
        type:'selectFK',
        required:false,
        colClass: 'col-12 col-md-6',
         options:[]

      },
      {
        name:'Fuel_Standard_Consumption_Type',
        label:'Tipo de estandar de consumo',
        type:'select',
        required:true,
        options:[
          {label:'Km*Gl',value:'Km*Gl'},
          {label:'Gl*Hr',value:'Gl*Hr'}
        ],
        colClass: 'col-12 col-md-6'
      },
       {
       name:'Fuel_Standard_Consumption',
       label:'Estandar de consumo',
       type:'number',
       required:true,
       placeholder:'Ingrese el estandar de consumo.',
       colClass:'col-12 col-md-6'
      },
       {
        name:'Service_Type__c',
        label:'Tipo de servicio',
        type:'select',
        required:true,
        options:[
          {label:'Km',value:'Km'},
          {label:'Hr',value:'Hr'}
        ],
        colClass: 'col-12 col-md-6'
      },
      {
        name:'Device_Type__c',
        label:'Tipo de dispositivo',
        type:'select',
        required:true,
        options:[
          {label:'GPS',value:'GPS'},
          {label:'Llave dallas',value:'Llave dallas'},
          {label:'Tag',value:'Tag'},
          {label:'QR de identificación',value:'QR de identificación'}
        ],
        colClass: 'col-12 col-md-6'
      },
      {
        name:'Observations',
        label:'Observaciones',
        type:'textarea',
        required:false,
        placeholder:'agregue una observacion, que crea debida.',
        colClass:'col-12 col-md-6'
      }

    ]
  },
  {
    catalogue:'VehiclesQuote',
    title:'Cuotas',
    idField:'Id',
    fields:[
      {
        name:'Name',
        label:'Id de vehiculo',
        disabled:true,
        colClass:'col-12 col-md-12',
        type:'text'
      },
      {
        name:'AssignedQuota',
        label:'Cuota asignada',
        type:'checkbox',
        required:false,
        colClass:'col-12 col-md-6'
      },
      {
        name:'QuotaStatus',
        label:'Estado de cuota.',
        type:'checkbox',
        required:false,
         colClass:'col-12 col-md-6'
      },
      {
        name:'AutoRenovating',
        label:'Saldo Auto renovable',
        type:'checkbox',
        required:false,
         colClass:'col-12 col-md-6'
      },
        {
        name:'Quota',
        label:'Cuota',
        type:'number',
        required:false,
         colClass:'col-12 col-md-6'
      },
      {
        name:'QuotaVolume',
        label:'Saldo',
        type:'number',
        required:false,
        colClass:'col-12 col-md-6'
      },
      {
        name:'frecuency',
        label:'Dias de vigencia',
        type:'number',
        required:false,
        colClass:'col-12 col-md-6'
      },
      {
        name:'days_renew',
        label:'Dias faltantes antes de la renovacion',
        type:'number',
        disabled:true,
        colClass:'col-12 col-md-6'
      },
      {
        name:'Last_renew',
        label:'Ultima renovacion',
        type:'date',
        colClass:'col-12 col-md-6'
      },
      {
        name:'emailTwo',
        label:'Alerta de finalizacion de cuota.',
        type:'email',
        disabled:false,
        colClass:'col-12 col-md-6'
      }
    ]
  },
  {
    catalogue:'VehiclesMaintance',
    title:'Mantenimiento',
    idField:'Id',
    fields:[
      {
         name:'Service_Type__c',
        label:'Tipo de servicio',
        type:'text',
        disabled:true,
        colClass:'col-12 col-md-6'
      },
      {
        name:'Interval',
        label:'Intervalo',
        type:'number',
        colClass:'col-12 col-md-6'
      },
      {
        name:'Next_service',
        label:'Proximo servicio',
        type:'number',
        colClass:'col-12 col-md-6'
      },
      {
        name:'Interval_before_service.',
        label:'Intervalo antes del servicio.',
        disabled:true,
        type:'number',
        colClass:'col-12 col-md-6'        
      },
      
      {
        name:'Last_Record',
        label:'Ultimo registro',
        type:'number',
        colClass:'col-12 col-md-6'
      },
      
      {
        name:'emailOne',
        label:'Alerta por mantenimiento',
        type:'email',
        disabled:false,
        colClass:'col-12 col-md-6'
      },
      
    ]
  },
  {
    catalogue:'Tags',
    title:'Tags',
    idField:'Id',
    fields:[
      {
        name:'TagCode',
        label:'Codigo del tag',
        placeholder:'por favor ingresa un valor no maximo a 10 caracteres',
        type:'text',
        colClass:'col-12 col-md-6'
      },
      
      {
        name:'VehicleFK',
        label:'Vehiculo asignado',
        type:'search-select',
        colClass:'col-12 col-md-6',
        options:[]
      },
      {
        name:'OdometerPrompt',
        label:'Solicitar odometro',
        type:"checkbox",
        colClass:'col-12 col-md-6'
      },
       {
        name:'HourometerPrompt',
        label:'Solicitar HRS motor',
        type:"checkbox",
        colClass:'col-12 col-md-6'
      },
       {
        name:'Active',
        label:'Activo',
        type:"checkbox",
        colClass:'col-12 col-md-6'
      }

    ]
  },
  {
    catalogue:'driver',
    title:'Conductores',
    idField:'Id',
    fields:[
      {
        name:'Name',
        label:'Codigo de conductor',
        type:'number',
        required:true,
        colClass:'col-12 col-md-6',
      },
      {
        name:'firstName',
        label:'Nombre',
        type:'text',
        required:true,
        placeholder:'ingrese el nombre del conductor',
        colClass:'col-12 col-md-6',
      },
      {
        name:'lastName',
        label:'Apellido',
        type:'text',
        required:true,
        placeholder:'ingrese el apellido del conductor',
        colClass:'col-12 col-md-6',
      },
      {
        name:'Active',
        label:'Estado',
        type:'checkbox',
        required:true,
        colClass:'col-12 col-md-6',
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
