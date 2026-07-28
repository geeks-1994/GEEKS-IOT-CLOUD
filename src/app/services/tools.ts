import { Injectable } from '@angular/core';
import Swal,{SweetAlertIcon} from 'sweetalert2'


@Injectable({
  providedIn: 'root',
})
export class Tools {
  

  success(title: string, text: string = '') {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  error(title: string, text: string = '') {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  warning(title: string, text: string = '') {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }

  info(title: string, text: string = '') {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
  }

  question(title: string, text: string = '') {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      confirmButtonText: 'Aceptar'
    });
  }

  confirm(
    title: string,
    text: string = 'Esta acción no se puede deshacer',
    confirmButtonText: string = 'Sí, continuar',
    cancelButtonText: string = 'Cancelar'
  ) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true
    });
  }

  loading(title: string = 'Procesando...', text: string = 'Espere un momento') {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    Swal.close();
  }

  toast(
    title: string,
    icon: SweetAlertIcon = 'success',
    position: 'top-end' | 'top' | 'top-start' | 'center' | 'bottom' | 'bottom-start' | 'bottom-end' = 'top-end'
  ) {
    return Swal.fire({
      toast: true,
      position,
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  }

formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}



}
