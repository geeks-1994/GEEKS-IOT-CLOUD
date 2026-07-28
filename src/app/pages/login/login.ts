import { Component,OnInit } from '@angular/core';
import { Methods } from '../../services/methods';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Tools } from '../../services/tools';
import { GsuiteLoginResponse } from '../../models/generals-interfaces';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  
user:string = 'lpradodmc@geeks-iot-cloud.com';
password:string = '';

  constructor(private service: Methods,private alerts: Tools, public router:Router) { }



ngOnInit(): void {


}


async login(){

if(!this.user || !this.password){

  this.alerts.info("Datos incompletos","Verifique los datos ingresados")
  return;

};


this.alerts.loading("Procesando...","Verificando credenciales ...");

this.service.loginsuite({email:this.user,password:this.password}).subscribe({
next: async (response:GsuiteLoginResponse) => {

  if(response.success){
   await this.alerts.close();
   console.log(response);

   await localStorage.setItem("gsuiteToken",response.token);
   this.router.navigate(['/main']) 
   this.alerts.toast("Verificacion","success","top");
  }

},error: async (err) =>{

  await this.alerts.close();
  this.alerts.toast("Verificacion invalida","error","bottom");
}

});

}

}
