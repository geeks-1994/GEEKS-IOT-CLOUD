import { Injectable, signal } from '@angular/core';
import { Methods } from './methods';
import { GroupVehicles, Miselanuos, ParametersCatalogue, ProductCatalogue, TankCatalogue, Vehicle, VehicleBrandCatalogue } from '../models/generals-interfaces';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class MiselanousData {

  public miselanousDataTank = signal<Miselanuos[]>([]);
  public miselanousDataVehicle = signal<Miselanuos[]>([]);
  public miselanousDataVehicleBrand = signal<Miselanuos[]>([]);
  public MiselanousDataGroup = signal<Miselanuos[]>([]);
  public MiselanousDataProduct = signal<Miselanuos[]>([]);

constructor(public services: Methods) { }   


async loadDataMiselaous(): Promise<void> {
  try {
    const baseParameters = {
      user: this.services.SessionData().userSalesforce,
      password: this.services.SessionData().passwordSalesForce,
      company: this.services.SessionData().company
    };

    const [
      responseTanks,
      responseVehicles,
      responseTypeVehicles,
      responsiveGroup,
      responsiveproduct
    ] = await Promise.all([
      firstValueFrom(
        this.services.GetPostDataCatalogue<TankCatalogue>({
          ...baseParameters,
          nameObject: 'tanks'
        })
      ),

      firstValueFrom(
        this.services.GetPostDataCatalogue<Vehicle>({
          ...baseParameters,
          nameObject: 'Vehicles'
        })
      ),

      firstValueFrom(
        this.services.GetPostDataCatalogue<VehicleBrandCatalogue>({
          ...baseParameters,
          nameObject: 'type_vehicles'
        })
      ),
      firstValueFrom(
        this.services.GetPostDataCatalogue<GroupVehicles>({
          ...baseParameters,
          nameObject:'group'
        })
      ),
      firstValueFrom(
        this.services.GetPostDataCatalogue<ProductCatalogue>({
          ...baseParameters,
          nameObject:'product'
        })
      )
    ]);

    const tanksData: Miselanuos[] = responseTanks.map((tank) => ({
      label: tank.description,
      value: tank.TankId,
      SFValue:tank.id
    }));

    const vehiclesData: Miselanuos[] = responseVehicles.map((vehicle) => ({
      label: vehicle.VehicleName,
      value: vehicle.VehicleName,
      SFValue:vehicle.Id
    }));

    
    const vehicleBrandsData: Miselanuos[] = responseTypeVehicles.map((vehicleBrand) => ({
      label: vehicleBrand.Name,
      value: vehicleBrand.Name,
      SFValue:vehicleBrand.id
    }));


    const vehiclesGroup:Miselanuos[] = responsiveGroup.map((group) => ({
      label:group.Name,
      value:group.Name,
      SFValue:group.Id
    }));

    const Productdata:Miselanuos[] = responsiveproduct.map((product) =>({
          label:product.Name,
          value:product.Name,
          SFValue:product.id
    }));

    
    this.miselanousDataTank.set(tanksData);
    this.miselanousDataVehicle.set(vehiclesData);
    this.miselanousDataVehicleBrand.set(vehicleBrandsData);
    this.MiselanousDataGroup.set(vehiclesGroup);
    this.MiselanousDataProduct.set(Productdata);
  // console.log(this.MiselanousDataProduct())

/*  
    console.log('Tanques:', this.miselanousDataTank());
    console.log('Vehículos:', this.miselanousDataVehicle());
    console.log('Tipos de vehículos:', this.miselanousDataVehicleBrand());
*/

  } catch (error) {
    console.error('Error al cargar los datos misceláneos:', error);

    // this.services.tools.error(
    //   'Error al cargar los datos misceláneos',
    //   'Por favor, inténtelo de nuevo más tarde.'
    // );
  }
}

}
