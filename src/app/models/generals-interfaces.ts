export interface GeneralsInterfaces {
};



export interface GsuiteLoginResponse {
  success: boolean;
  message: string;
  token: string;
};


interface HelperMenu{
  name:string;
  description:string;
};


export interface GsuiteUser {
  userId: string;
  email: string;
  role: string;
  company: string;
  userSalesForce: string;
  passwordSalesForce: string;
  Catalogues:HelperMenu[];
  fleet:HelperMenu[];
  iat: number; // Fecha de emisión del token (timestamp)
  exp: number; // Fecha de expiración del token (timestamp)
};


export interface GtokenDatasession {

  success:string;
  message:string;
  user:GsuiteUser

};


export interface mainMenu {
name:string;
icon:string;
submenu:HelperMenu;

};


export interface ParametersCatalogue{
  nameObject:string;
  user:string;
  password:string;
  company:string;
}


export interface PumpCatalogue {
  Id: string;
  Name: string;
  IdPump: string;
  FK_product: string;
  Type_register: string;
  comunicationType: string;
  productName: string;
  company: string;
}


export interface TankCatalogue {
  id: string;
  Name: string;
  TankId: string;

  capacity: string;
  calibrationVolume: string;
  saldofinal: string;
  ullage: string;

  calibrationDate: string;
  last_activity: string;

  description: string;
  sensorActive: boolean;
  percent: number;

  last_Activity_type: 'Measure' | 'Fuel In' | 'Refuel' | 'Traslado' | string;

  umbral_1: number | null;
  umbral_2: number | null;
  umbral_3: number | null;

  email_1: string;
  email_2: string;
  email_3: string;
  email_4: string;

  company: string;
  active: boolean;
};



export interface ProductCatalogue {
  id: string;
  Name: string;
  description: string;
  numberActive: number | null;
  company: string;
  active: boolean;
};


export interface VehicleBrandCatalogue {
  id: string;
  Name: string;
  icon: string;
  company: string;
  active: boolean;
};


export interface SessionData{
        userSalesforce:string;
      passwordSalesForce:string;
      company:string;
};


// src/app/models/vehicle.model.ts
export interface Vehicle {
  Id: string;
  Name: string;
  Company: string;
  VehicleName: string;
  PlateNumber: string;
  Status: string; // puede tiparse como boolean si lo manejas así
  TankCapacity: number;
  Quota: number;
  QuotaStatus: string; // igual que Status, revisar si es boolean
  AssignedQuota: boolean;
  QuotaVolume: number;
  Active: boolean;
  Catalogue_Product: string | null;
  Catalogue_Cost_Center: string | null;
  Catalogue_Group_Vehicle: string | null;
  Catalogue_Vehicle_Type: string | null;
  maintenance: string; // igual revisar si debería ser boolean
  Service_Type__c: string;
  Device_Type__c: string;
  Fuel_Standard_Consumption: number;
  Next_service: any; // Si usas objetos SOAP (xsi:nil) puedes dejarlo `any` o hacer una interface aparte
  Interval: number | null;
  Last_Record: string | number; // depende si lo manejas como texto o número
  Interval_before_service: number | null;
  Fuel_Standard_Consumption_Type: string;
  Observations: any; // mismo caso que Next_service
  frecuency: string | number;
  days_renew: string | number;
}



export type ReportParameterType =
  | 'DateTime'
  | 'date'
  | 'datetime'
  | 'time'
  | 'string'
  | 'select'
  | 'select-search'
  | 'checkbox';

export  type ReportName = 
  | 'raw_data' 
  | 'sumaryData' 


export interface ReportParameterOption {
  label: string;
  value: string | number | boolean;
}

export interface ParametersReport {
  name: string;
  label: string;
  type: ReportParameterType;

  /**
   * Si enabled = true, el parámetro aparece en la toolbar.
   * Si enabled = false, no se muestra.
   */
  enabled: boolean;

  /**
   * Si readonly = true, se muestra pero no se puede modificar.
   */
  readonly?: boolean;

  value?: any;
  options?: ReportParameterOption[];
  placeholder?: string;
  colClass?: string;
}

export interface ReportCatalogue {
  name: string;
  title: string;
  method: () => any;
  parameters: ParametersReport[];
  columns: any[];
  enableChart:boolean
}


export interface transaction {
  tsKey: string;
  tsName: string;
  tscpCompanyID: string;
  tsPumpSalesForceID: string;
  tsppPumpID: string;
  tstkTankID: string;
  tstankDescription: string;
  tsTankSalesForceID: string;
  tspdProductName: string;
  tsDateRefuel: string; // ISO Date String
  tstgTagID: string;
  tsOdometerPrompt:boolean,
  tsHourometerPrompt:boolean,
  tsTagSalesForceID: string;
  tsttTagTypeDescription: string;
  tsveVehicleID: string;
  tsveTypeVehicle: string;
  tsvehicleSalesforceID: string;
  tsStartCounter: number;
  tsEndCounter: number;
  tsQuantity: number;
  tsOdometer: number;
  tsHourometer: number;
  tsDateCreated: string; // ISO Date String
  tsDateImported: string; // ISO Date String
  tsTransactionType: number;
  tsStateServer: boolean;
  tsdvDriverID: string;
  tsdvDriverCode: string;
  tsdvDriverName: string;
  tsdvDriverLastName: string;
  Reference_one: string;
  tsPreviusHourmeter: number;
  tsPreviusOdometer: number;
  tsReferencetwo: string;
  tsReferencethree: string;
  tsReferenceFour: string;
  tsQrData: string;
  HRS:number;
  KM:number;
  eficiency:number;
  efCheckRequired:boolean;

};


export interface RequestPayload {
  tosend: {
    startDate: string; // ISO Date String
    endDate: string;   // ISO Date String
    tankId: string;
    vehicleId: string;
    typeVehicle: string;
  };
  user: string;
  password: string;
  company: string;
  group: boolean;
  excludedFilling:boolean;
};


export interface resultRegister {
  success:boolean,
  data:transaction
}

export interface Miselanuos{
  label:string;
  value:string;
}


export interface PumpDataDashboard {
  // Detalle de la bomba o surtidor
  ppPumpID: string;
  ppPumpName: string;
  ppPumpSalesForceID: string;

  // Detalle del tanque
  tkname: string;
  tkTankID: string;
  tktankDescription: string;
  tkTankSalesForceID: string;
  tkCapacity: number;
  tkVolume: number;
  tkpercent: number;
  tkproductName: string;
  tklastActivity: string;
};



