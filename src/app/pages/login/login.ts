import { Component,OnInit } from '@angular/core';
import { Methods } from '../../services/methods';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Tools } from '../../services/tools';
import { GsuiteLoginResponse } from '../../models/generals-interfaces';
import {PreRegister} from '../../shared/pre-register/pre-register'
import {MatDialog} from '@angular/material/dialog'


@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  
user:string = '';
password:string = '';
showPassword = false;

  constructor(private service: Methods,private alerts: Tools, public router:Router,private dialog:MatDialog) { }



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

};



togglePassword(): void {
  this.showPassword = !this.showPassword;
};


openRegisteruser():void{

  try {
      const dialogRef =
    this.dialog.open(
      PreRegister,
      {
      width: '620px',
    maxWidth: '95vw',
    maxHeight: '90vh',
    disableClose: true,
    autoFocus: false,
    panelClass: 'register-user-dialog',
    backdropClass: 'register-user-backdrop'
      }
    );
    
  } catch (error) {
    this.alerts.toast('error en el servidor','error','top')
  }

};

}
