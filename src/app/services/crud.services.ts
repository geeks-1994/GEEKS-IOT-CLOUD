import { Injectable } from '@angular/core';
import { Methods } from './methods';
import { crudService, ParameterOptions } from '../models/crud';
import { Tools } from './tools';
import { firstValueFrom } from 'rxjs';




@Injectable({
  providedIn: 'root',
})
export class CRUDServices {




  constructor(private services:Methods,private tools:Tools){  

  };


   numberOrZero(value: unknown):number{
  if (
    value === '' ||
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue)
    ? numberValue
    : 0;
};


public CRUDmethods:any = {

  pumpscreate: async (data:any) =>{
    
    try {

      let parameters:ParameterOptions[] = [
        {name:'Name',value:data.Name},
        {name:'PumpId',value:data.IdPump},
        {name:'Tank',value:data.FK_TankSF},
        {name:'TypeRegister',value:data.Type_register},
        {name:'communicationType',value:data.comunicationType},
        {name:'Active',value:true},
        {name:'recordtype',value:'0128V000002Ad8sQAC'}

      ] 

      const dataCreate:crudService =  {
        nameObject:'pumps',
        TypeMethod:'create',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }


  },
  pumpsupdate: async (data:any) =>{


    try {

      let parameters:ParameterOptions[] = [
        {name:'Id',value:data.Id},
        {name:'Name',value:data.Name},
        {name:'PumpId',value:data.IdPump},
        {name:'Tank',value:data.FK_TankSF},
        {name:'TypeRegister',value:data.Type_register},
        {name:'communicationType',value:data.comunicationType},
        {name:'Active',value:true},
        {name:'recordtype',value:'0128V000002Ad8sQAC'}

      ] 

      const dataCreate:crudService =  {
        nameObject:'pumps',
        TypeMethod:'update',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }

  },
  pumpsdelete:async (data:any) =>{

        try {

      let parameters:ParameterOptions[] = [
        {name:'Id',value:data.Id},


      ] 

      const dataCreate:crudService =  {
        nameObject:'pumps',
        TypeMethod:'delete',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }

  },
    /// Metodos para actualizar tanques de combustible
  tankscreate: async (data:any) =>{

    try {

      let parameters:ParameterOptions[] = [
                  
        {name:'Name',value:data.Name},
        {name:'tankId',value:data.TankId},
        {name:'capacity',value:data.capacity},
        {name:'volume',value:data.calibrationVolume},
        {name:'Active',value:data.active},
        {name:'Active_Sensor',value:data.sensorActive},
        {name:'Descrition',value:data.description ?? ''},
        {name:'umbral_1',value:data.umbral_1},
        {name:'umbral_2',value:data.umbral_2},
        {name:'umbral_3',value:data.umbral_3},
        {name:'email_1',value:data.email_1},
        {name:'email_2',value:data.email_2},
        {name:'email_3',value:data.email_3},
        {name:'email_4',value:data.email_4},
        {name:'recordtype',value:'0128V000002Ad92QAC'}

      ]


            const dataCreate:crudService =  {
        nameObject:'tanks',
        TypeMethod:'create',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };
      
      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      console.log(response);

    } catch (error) {
      
            console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
  },
  tanksupdate:async (data:any) =>{

        try {

      let parameters:ParameterOptions[] = [
         {name:'Id',value:data.id},         
        {name:'Name',value:data.Name},
        {name:'tankId',value:data.TankId},
        {name:'capacity',value:data.capacity},
        {name:'volume',value:data.calibrationVolume},
        {name:'Description',value:data.description ?? ''},
        {name:'Active',value:data.active},
        {name:'Active_Sensor',value:data.sensorActive},
        {name:'umbral_1',value:data.umbral_1},
        {name:'umbral_2',value:data.umbral_2},
        {name:'umbral_3',value:data.umbral_3},
        {name:'email_1',value:data.email_1},
        {name:'email_2',value:data.email_2},
        {name:'email_3',value:data.email_3},
        {name:'email_4',value:data.email_4}

      ]
    console.log(parameters);

            const dataCreate:crudService =  {
        nameObject:'tanks',
        TypeMethod:'update',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };
      
      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      console.log(response);

    } catch (error) {
      
            console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }

  },
  tanksdelete:async (data:any) => {
      try {

      let parameters:ParameterOptions[] = [
        {name:'Id',value:data.id},


      ] 

      const dataCreate:crudService =  {
        nameObject:'tanks',
        TypeMethod:'delete',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
  },

  //type_vehicles
  type_vehiclescreate: async (data:any) => {

        try {

      let parameters:ParameterOptions[] = [
        {name:'Name',value:data.Name},
        {name:'Active',value:true},
        {name:'recordtype',value:'0128V000002Ad8TQAS'}

      ] 

      const dataCreate:crudService =  {
        nameObject:'type_vehicle',
        TypeMethod:'create',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }

  },
  type_vehiclesupdate: async (data:any) =>{

      try {

      let parameters:ParameterOptions[] = [
        {name:'Id',value:data.id},
        {name:'Name',value:data.Name},
        {name:'Active',value:data.active},
        {name:'recordtype',value:'0128V000002Ad8TQAS'}

      ] 

      const dataCreate:crudService =  {
        nameObject:'type_vehicle',
        TypeMethod:'update',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
    
  },
  type_vehiclesdelete: async (data:any) => {
    try {

      let parameters:ParameterOptions[] = [
        {name:'Id',value:data.id}

      ] 

      const dataCreate:crudService =  {
        nameObject:'type_vehicle',
        TypeMethod:'delete',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
  },


  //group_vehicles
   groupcreate: async (data:any) => {

        try {

      let parameters:ParameterOptions[] = [
        {name:'Name',value:data.Name},
        {name:'Active',value:true},
        {name:'recordtype',value:'0128V000002Ad8TQAS'}

      ] 

      const dataCreate:crudService =  {
        nameObject:'group',
        TypeMethod:'create',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }

  },
  groupupdate: async (data:any) =>{

      try {

      let parameters:ParameterOptions[] = [
        {name:'Id',value:data.Id},
        {name:'Name',value:data.Name},
        {name:'Active',value:data.active},
        {name:'recordtype',value:'0128V000002Ad8TQAS'}

      ] 

      console.log(parameters);

      const dataCreate:crudService =  {
        nameObject:'group',
        TypeMethod:'update',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
    
  },
  groupdelete: async (data:any) => {
    try {

      let parameters:ParameterOptions[] = [
        {name:'Id',value:data.id}

      ] 

      const dataCreate:crudService =  {
        nameObject:'group',
        TypeMethod:'delete',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
  },

  //Product
  productcreate: async (data:any) =>{

            try {


              console.log(data);
      let parameters:ParameterOptions[] = [
        {name:'Name',value:data.Name},
        {name:'Description',value:data.description},
        {name:'Active',value:true},
        {name:'recordtype',value:'0128V000002Ad8nQAC'}

      ] 

      const dataCreate:crudService =  {
        nameObject:'product',
        TypeMethod:'create',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }

  },
  productupdate: async (data:any) =>{
                try {

      let parameters:ParameterOptions[] = [
        {name:'Id',value:data.id},
        {name:'Name',value:data.Name},
        {name:'Description',value:data.description},
        {name:'Active',value:data.active},
        {name:'recordtype',value:'0128V000002Ad8nQAC'}

      ] 

      console.log(parameters);

      const dataCreate:crudService =  {
        nameObject:'product',
        TypeMethod:'update',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
  },
  productdelete:async (data:any) =>{

          try {

      let parameters:ParameterOptions[] = [
        {name:'Id',value:data.id}
      ] 

      const dataCreate:crudService =  {
        nameObject:'product',
        TypeMethod:'delete',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
      
    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
  },


// vehiculos

Vehiclescreate: async (data:any) =>{
     try {
  

      console.log(data);
      let parameters:ParameterOptions[] = [
      
        {name:'Name',value:data.Name},
        {name:'VehicleName',value:data.VehicleName},
        {name:'PlateNumber',value:data.PlateNumber},
        {name:'Status',value:data.Active},
        {name:'group',value:data.FK_group_vehicle},
        {name:'Type_vehicle',value:data.FK_vehicle_type},
        {name:'Product',value:data.FK_product},
        {name:'typeStandar',value:data.Fuel_Standard_Consumption_Type},
        {name:'comsuption',value:data.Fuel_Standard_Consumption},
        {name:'TypeService',value:data.Service_Type__c},
        {name:'DeviceType',value:data.Device_Type__c},
        {name:'Observations',value:data.Observations},
        {name:'capacity',value:data.TankCapacity}
      
      ] 



   //   console.log(parameters);
      const dataCreate:crudService =  {
        nameObject:'vehicles',
        TypeMethod:'create',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);

    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
},
Vehiclesupdate:async (data:any) => {
  
  try {
  

      // console.log(data);
      let parameters:ParameterOptions[] = [
         {name:'Id',value:data.Id},
        {name:'Name',value:data.Name},
        {name:'VehicleName',value:data.VehicleName},
        {name:'PlateNumber',value:data.PlateNumber},
        {name:'Status',value:data.Active},
        {name:'group',value:data.FK_group_vehicle},
        {name:'Type_vehicle',value:data.FK_vehicle_type},
        {name:'Product',value:data.FK_product},
        {name:'typeStandar',value:data.Fuel_Standard_Consumption_Type},
        {name:'comsuption',value:data.Fuel_Standard_Consumption},
        {name:'TypeService',value:data.Service_Type__c},
        {name:'DeviceType',value:data.Device_Type__c},
        {name:'Observations',value:data.Observations},
        {name:'capacity',value:data.TankCapacity},

        // cuotas de combustible
        {name:'AssignedCuota',value:data.AssignedQuota},
        {name:'statusQuote',value:data.QuotaStatus},
        {name:'AutoRenew',value:data.AutoRenovating},
        {name:'Quota',value:data.Quota},
        {name:'Last_Renew',value:data.Last_renew},
        {name:'FrecuencyDays',value:data.frecuency},
        {name:'EmailQuota',value:data.emailTwo},

         // Mantenimiento
        {name:'Interval',value:this.numberOrZero(data.Interval)},
        {name:'NextService',value: this.numberOrZero(data.Next_service) },
        {name:'EmailMaintence',value:data.emailOne} 

        ] 



      console.log(parameters);
      const dataCreate:crudService =  {
        nameObject:'vehicles',
        TypeMethod:'update',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);

    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }

},
Vehiclesdelete: async (data:any) => {

  try {
  

      console.log(data);
      let parameters:ParameterOptions[] = [
      
        {name:'Id',value:data.Id}
      
      ] 



      console.log(parameters);
      const dataCreate:crudService =  {
        nameObject:'vehicles',
        TypeMethod:'delete',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);

    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }

},

//  Tag RFID,DALLAS y QR 

Tagscreate: async (data:any ) =>{
  
  try {
  

      console.log(data);
      let parameters:ParameterOptions[] = [
        {name:'Name',value:data.TagCode},
        {name:'OdometerPrompt',value:data.OdometerPrompt},
        {name:'HourmeterPrompt',value:data.HourometerPrompt},
        {name:'vehicle',value:data.VehicleFK},
        {name:'Active',value:data.Active}

      ] 

      console.log(parameters);

      
      const dataCreate:crudService =  {
        nameObject:'Tags',
        TypeMethod:'create',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
          const message = response.response?.[0].result?.[0].errors?.[0]?.message[0];

          if(message){
             console.log(message);
             this.tools.error('Tags',message);
          }
    
  } catch (error) {
      
    console.error(error);
    this.tools.error('Error de catalogo','verifique los datos de entrada');
  
  }
},
Tagsupdate: async (data:any) =>{
  
  try {
    

              console.log(data);
      let parameters:ParameterOptions[] = [
        {name:'Id',value:data.Id},
        {name:'Name',value:data.TagCode},
        {name:'OdometerPrompt',value:data.OdometerPrompt},
        {name:'HourmeterPrompt',value:data.HourometerPrompt},
        {name:'vehicle',value:data.VehicleFK},
        {name:'Active',value:data.Active}

      ] 

      console.log(parameters);

      
      const dataCreate:crudService =  {
        nameObject:'Tags',
        TypeMethod:'update',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
          // const message = response.response?.[0].result?.[0].errors?.[0]?.message[0] ?? '';

          // if(message){
          //    console.log(message);
          //    this.tools.error('Tags',message);
          // };

          console.log(response);

  } catch (error) {

    console.error(error);
    this.tools.error('Error de catalogo','verifique los datos de entrada');
  }
},
Tagsdelete: async (data:any) =>{

    try {
  

      console.log(data);
      let parameters:ParameterOptions[] = [
      
        {name:'Id',value:data.Id}
      
      ] 


      console.log(parameters);
      const dataCreate:crudService =  {
        nameObject:'Tags',
        TypeMethod:'delete',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);


    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
},



//Conductores
drivercreate: async (data:any) =>{
 
  try {

  let parameters:ParameterOptions[] = [
    
    {name:'Name',value:data.Name},
    {name:'DriverName',value:data.firstName},
    {name:'lastname',value:data.lastName},
    {name:'group',value:data.group_FK},
    {name:'Activo',value:data.Active}
  ]


        console.log(parameters);

      
      const dataCreate:crudService =  {
        nameObject:'Drivers',
        TypeMethod:'create',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
  
} catch (error) {
  
        console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
}
},
driverupdate: async (data:any) =>{

  try {

      let parameters:ParameterOptions[] = [
    {name:'Id',value:data.Id},
    {name:'Name',value:data.name},
    {name:'DriverName',value:data.firstName},
    {name:'lastname',value:data.lastName},
    {name:'group',value:data.group_FK},
    {name:'Activo',value:data.Active}
  ]


    console.log(parameters);
  
      const dataCreate:crudService =  {
        nameObject:'Drivers',
        TypeMethod:'update',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);
    
  } catch (error) {

          console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
  }
},
driverdelete: async (data:any) =>{

      try {
  

      console.log(data);
      let parameters:ParameterOptions[] = [
      
        {name:'Id',value:data.Id}
      
      ]; 


      console.log(parameters);
      const dataCreate:crudService =  {
        nameObject:'Drivers',
        TypeMethod:'delete',
        user:this.services.SessionData().userSalesforce,
        password:this.services.SessionData().passwordSalesForce,
        company:this.services.SessionData().company,
        Migration:this.services.SessionData().Migration,
        parametersData:parameters
      };


      const response = await firstValueFrom(this.services.CrudMethods(dataCreate));
      
      console.log(response);


    } catch (error) {

      console.error(error);
      this.tools.error('Error de catalogo','verifique los datos de entrada');
    }
}




};

  
}
