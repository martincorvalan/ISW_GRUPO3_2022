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
  formPedido: FormGroup;
  formTarjeta: FormGroup;
  formEfectivo: FormGroup;

  // imagen
  imagen: File | null;
  imagenCargada: boolean;

  // precio
  precio: number;

  // boleanos
  calleEntrega: string;
  ocultar: boolean;
  formaPago: string;
  modo: string;

  // manejo de fecha
  today: Date;
  day: number;
  month: number;

  // `getFullYear()` devuelve el año completo
  year: number;
  dayMax: number;
  diaActual: string;
  diaMaximo: string;

  constructor(private fb: FormBuilder) {

    // inicializacion de las variables
    this.formPedido = this.fb.group({});
    this.formTarjeta = this.fb.group({});
    this.formEfectivo = this.fb.group({});

    this.imagen = null;
    this.imagenCargada = false;

    this.precio = 0;

    this.calleEntrega = '';
    this.ocultar = true;
    this.formaPago = '';
    this.modo = '';
    
    this.today = new Date();
    this.day = this.today.getDate();
    this.month = this.today.getMonth() + 1;
    
    this.year = this.today.getFullYear();
    this.dayMax = this.today.getDate() + 7;
    this.diaActual = this.year + '-' + this.month + '-' + this.day;
    this.diaMaximo = this.year + '-' + this.month + '-' + this.dayMax;
    // ---------------------------------------------------------------

    this.precio.toFixed(2);

    this.formPedido = this.fb.group({
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
      pisoEntrega: ['', Validators.pattern('^[0-9]+$')],
      deptoEntrega: [''],
    });

    this.formTarjeta = this.fb.group({
      nombreTarjeta: [
        '',
        [Validators.required, Validators.pattern('[a-zA-Z ]+$')],
      ],
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
      monto: [
        '',
        [Validators.required, Validators.pattern('[0-9]+|[0-9]+[,.]+[0-9]+')],
      ],
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

  elegirMetodoPagoTarjeta(event: any): void {
    this.formaPago = 'tarjeta';

    this.formEfectivo = this.fb.group({
      monto: [
        '',
        [Validators.required, Validators.pattern('[0-9]+|[0-9]+[,.]+[0-9]+')],
      ],
      fechaEntregaPedido: [''],
      horaEntrega: [''],
      formaEntrega: ['', Validators.required],
    });
  }

  elegirMetodoPagoEfectivo(): void {
    this.formaPago = 'efectivo';
    this.formTarjeta = this.fb.group({
      nombreTarjeta: [
        '',
        [Validators.required, Validators.pattern('[a-zA-Z ]+$')],
      ],
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

  guardarImagenPedido(event: any): void {
    this.imagen = event.target.files[0];
    this.imagenCargada = true;
  }

  esImagenNoValida(): boolean {
    return this.imagenCargada &&
      (!this.imagen || this.imagen.size / (1024 * 1024) >= 5)
      ? true
      : false;
  }

  confirmarFormularioDestino(): void {
    if (
      this.formPedido.status === 'VALID' &&
      (!this.imagen || this.imagen.size / (1024 * 1024) < 5)
    ) {
      this.ocultar = false;
      let monto: number = (Math.floor(Math.random() * 100) * 300) / 100 + 500;
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

  esDescripcionPedidoNoValida(): boolean | undefined {
    return (
      this.formPedido.get('descripcion')?.invalid &&
      this.formPedido.get('descripcion')?.touched
    );
  }

  esCampoPedidoNoValido(campo: string): boolean | undefined {
    return this.formPedido.get(campo)?.invalid && this.formPedido.get(campo)?.touched;
  }

  esCampoTarjetaNoValido(campo: string): boolean | undefined {
    return (
      this.formTarjeta.get(campo)?.invalid &&
      this.formTarjeta.get(campo)?.touched
    );
  }

  esCampoEfectivoNoValido(): boolean | undefined {
    return (
      this.formEfectivo.get('monto')?.invalid &&
      this.formEfectivo.get('monto')?.touched
    );
  }

  elegirModoEntrega(modo: string): void {
    this.modo = modo;
  }

  esMontoIngresadoValido(): boolean {
    let montoTemporal = parseFloat(this.formEfectivo.get('monto')?.value);
    return montoTemporal < this.precio;
  }

  volverMostrarFormulario(): void {
    this.ocultar = true;
    this.precio = 0;
    this.formaPago = '';
    this.modo = '';
    this.formTarjeta = this.fb.group({
      nombreTarjeta: [
        '',
        [Validators.required, Validators.pattern('[a-zA-Z ]+$')],
      ],
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
      monto: [
        '',
        [Validators.required, Validators.pattern('[0-9]+|[0-9]+[,.]+[0-9]+')],
      ],
      fechaEntregaPedido: [''],
      horaEntrega: [''],
      formaEntrega: ['', Validators.required],
    });
  }

  confirmarPedidoTarjeta(): void {
    if (this.formTarjeta.status === 'VALID') {
      if (this.formTarjeta.get('formaEntrega')?.value === '1') {
        this.alerta();
        return;
      }
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

  confirmarPedidoEfectivo(): void {
    if (this.formEfectivo.status === 'VALID') {
      if (this.formEfectivo.get('formaEntrega')?.value === '1') {
        this.alerta();
        return;
      }
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

  alerta(): void {
    Swal.fire({
      title: 'Esta seguro de confirmar?',
      text:
        this.formPedido.get('descripcion')?.value +
        ' sera enviado a ' +
        this.formPedido.get('calleEntrega')?.value +
        ' ' +
        this.formPedido.get('numeroEntrega')?.value,
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
