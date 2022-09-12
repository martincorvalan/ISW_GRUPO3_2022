import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  // formularios
  forma: FormGroup;
  formTarjeta: FormGroup;
  formEfectivo: FormGroup;

  // imagen
  imagen: File | null = null;
  imagenCargada = false;

  // precio
  precio: number = 0;

  // boleanos
  calleEntrega = '';
  ocultar = true;
  formaPago = '';
  modo = '';

  // crea un nuevo objeto `Date`
  today = new Date();

  // `getDate()` devuelve el día del mes (del 1 al 31)
  day = this.today.getDate();

  // `getMonth()` devuelve el mes (de 0 a 11)
  month = this.today.getMonth() + 1;

  // `getFullYear()` devuelve el año completo
  year = this.today.getFullYear();
  dayMax = this.today.getDate() + 7;
  diaActual = this.year + '-' + this.month + '-' + this.day;
  diaMaximo = this.year + '-' + this.month + '-' + this.dayMax;

  constructor(private fb: FormBuilder) {
    
    this.precio.toFixed(2);

    this.forma = this.fb.group({
      descripcion: [
        '',
        [Validators.required, Validators.maxLength(420), Validators.min(5)],
      ],
      ciudad: ['', Validators.required],

      calleComercio: ['', [Validators.required]],
      numeroComercio: [
        '',
        [
          Validators.required,
          Validators.min(2),
          ,
          Validators.maxLength(5),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      referenciaComercio: [''],

      calleEntrega: ['', Validators.required],
      numeroEntrega: [
        '',
        [
          Validators.required,
          Validators.min(2),
          ,
          Validators.maxLength(5),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      pisoEntrega: ['',Validators.pattern('^[0-9]+$')],
      deptoEntrega: [''],
      
    });

    this.formTarjeta = this.fb.group({
      nombreTarjeta: ['', [Validators.required,Validators.pattern('[a-zA-Z ]+$')]],
      numeroTarjeta: [
        '',
        [Validators.required, Validators.pattern('^[45][0-9]{15}$')],
      ],
      fechaexpiracion: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      fechaEntregaPedido: [''],
      horaEntrega: [''],
      formaEntrega: ['', Validators.required],
    });

    this.formEfectivo = this.fb.group({
      monto: ['', [Validators.required, Validators.pattern('[0-9]+|[0-9]+[,.]+[0-9]+')]],
      fechaEntregaPedido: [''],
      horaEntrega: [''],
      formaEntrega: ['', Validators.required],
    });

    if (this.month < 10) {
      let temporalMes = zfill(this.month, 2);
      this.diaActual = this.year + '-' + temporalMes + '-' + this.day;
      this.diaMaximo = this.year + '-' + temporalMes + '-' + this.dayMax;
    }

    if (this.day < 10) {
      let temporalDay = zfill(this.day, 2);
      let temporalDayMax = zfill(this.dayMax, 2);
      this.diaActual = this.year + '-' + this.month + '-' + temporalDay;
      this.diaMaximo = this.year + '-' + this.month + '-' + temporalDayMax;
    }

    function zfill(number: number, width: number) {
      var numberOutput = Math.abs(number); /* Valor absoluto del número */
      var length = number.toString().length; /* Largo del número */
      var zero = '0'; /* String de cero */

      if (width <= length) {
        if (number < 0) {
          return '-' + numberOutput.toString();
        } else {
          return numberOutput.toString();
        }
      } else {
        if (number < 0) {
          return '-' + zero.repeat(width - length) + numberOutput.toString();
        } else {
          return zero.repeat(width - length) + numberOutput.toString();
        }
      }
    }

   
  }

  ngOnInit(): void {}

  // get imagenNoValida() {
  //   return this.forma.get('imagen')?.invalid || this.forma.get('imagen')?.value.size / (1024 * 1024) >= 5;
  //   // return this.forma.get(campo)?.invalid && this.forma.get(campo)?.touched;

  // }

  eligeTarjeta(event: any) {
    this.formaPago = 'tarjeta';

    this.formEfectivo = this.fb.group({
      monto: ['', [Validators.required, Validators.pattern('[0-9]+|[0-9]+[,.]+[0-9]+')]],
      fechaEntregaPedido: [''],
      horaEntrega: [''],
      formaEntrega: ['', Validators.required],
    });
  }
  eligeEfectivo() {
    this.formaPago = 'efectivo';
    this.formTarjeta = this.fb.group({
      nombreTarjeta: ['', [Validators.required,Validators.pattern('[a-zA-Z ]+$')]],
      numeroTarjeta: [
        '',
        [Validators.required, Validators.pattern('^[45][0-9]{15}$')],
      ],
      fechaexpiracion: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      fechaEntregaPedido: [''],
      horaEntrega: [''],
      formaEntrega: ['', Validators.required],
    });
  }
  guardar() {
   

    if (this.forma.status === 'INVALID') {
      return;
    }
   
    let monto: number = Math.floor(Math.random() * 10000) * 300 + 500;

    this.precio = monto;


    this.ocultar = false;
  }

  guardarArchivo(event: any) {
    this.imagen = event.target.files[0];
    this.imagenCargada = true;
  }

  get imagenNoValida() {
    return this.imagenCargada &&
      (!this.imagen || this.imagen.size / (1024 * 1024) >= 5)
      ? true
      : false;
  }

  confirmarDestino() {
  

    if (
      this.forma.status === 'VALID' && (!this.imagen || (this.imagen.size / (1024 * 1024) < 5))
    ) {
      this.ocultar = false;
      let monto: number = (Math.floor(Math.random() *100 ) * 300 ) /100 +500;

      this.precio = monto;

      
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Verifique los campos',
        text: '',
        footer: '',
      });
    }
  }

  get descripcionNoValida() {
    return (
      this.forma.get('descripcion')?.invalid &&
      this.forma.get('descripcion')?.touched
    );
  }

  campoNoValido(campo: string) {
    return this.forma.get(campo)?.invalid && this.forma.get(campo)?.touched;
  }

  campoNoValidoTarjeta(campo: string) {
    return (
      this.formTarjeta.get(campo)?.invalid &&
      this.formTarjeta.get(campo)?.touched
    );
  }

  campoEfectivo() {
    return (
      this.formEfectivo.get('monto')?.invalid &&
      this.formEfectivo.get('monto')?.touched
    );
  }

  verificarCalleEntrega() {
  

    this.calleEntrega = this.forma.get('calleEntrega')?.value;

    return (
      this.forma.get('calleEntrega')?.invalid &&
      this.forma.get('calleEntrega')?.touched
    );
  }

  modoEntrega(modo: string) {
    this.modo = modo;
  }

  validarMonto() {
   let montoTemporal= parseFloat(this.formEfectivo.get('monto')?.value);   
    // let monto: number = this.formEfectivo.get('monto')?.value;

  
    return montoTemporal < this.precio;
  }

  calculoPrecio() {
    if (this.forma.get('calculoEntrega') != null) {
  
    }
  }

  volverMostrarFormulario() {
    this.ocultar = true;
    this.precio = 0;
    this.formaPago = '';
    this.modo = '';
    this.formTarjeta = this.fb.group({
      nombreTarjeta: ['', [Validators.required,Validators.pattern('[a-zA-Z ]+$')]],
      numeroTarjeta: [
        '',
        [Validators.required, Validators.pattern('^[45][0-9]{15}$')],
      ],
      fechaexpiracion: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      fechaEntregaPedido: [''],
      horaEntrega: [''],
      formaEntrega: ['', Validators.required],
    });

    this.formEfectivo = this.fb.group({
      monto: ['', [Validators.required,Validators.pattern('[0-9]+|[0-9]+[,.]+[0-9]+')]],
      fechaEntregaPedido: [''],
      horaEntrega: [''],
      formaEntrega: ['', Validators.required],
    });
  }

  confirmarPedidoTarjeta() {


    if (this.formTarjeta.status === 'VALID') {
      if (this.formTarjeta.get('formaEntrega')?.value === '1') {
       
        this.alerta();
        return;
      }

      // fechaEntregaPedido: ['', ],
      // horaEntrega: ['',],


      if (
        this.formTarjeta.get('fechaEntregaPedido')?.value != '' &&
        this.formTarjeta.get('horaEntrega')?.value != ''
      ) {
    

        this.alerta();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Verifique los campos',
          text: '',
          footer: '',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Verifique los campos',
        text: '',
        footer: '',
      });
    }
  }

  confirmarPedidoEfectivo() {
   
    if (this.formEfectivo.status === 'VALID') {
      if (this.formEfectivo.get('formaEntrega')?.value === '1') {
       
        this.alerta();
        return;
      }

      // fechaEntregaPedido: ['', ],
      // horaEntrega: ['',],

    

      if (
        this.formEfectivo.get('fechaEntregaPedido')?.value != '' &&
        this.formEfectivo.get('horaEntrega')?.value != ''
      ) {
       

        this.alerta();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Verifique los campos',
          text: '',
          footer: '',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Verifique los campos',
        text: '',
        footer: '',
      });
    }
  }

  alerta() {
    Swal.fire({
      title: 'Esta seguro de confirmar?',
      text:
        this.forma.get('descripcion')?.value +
        ' sera enviado a ' +
        this.forma.get('calleEntrega')?.value +
        ' ' +
        this.forma.get('numeroEntrega')?.value,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, confirmar!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Confirmado!', 'Su pedido fue confirmado', 'success');
      }
    });
  }
}
