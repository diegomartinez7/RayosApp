import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConsultasService } from "./consultas.service";
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {
  tableName: string = "";
  displayedColumns = ['position', 'name', 'weight', 'symbol'];

  //Vectores de nombres de columnas de cada tabla
  columnsBank = [
    ['ID_provedor', 'Nombre'],
    ['ID_equipo', 'Nombre', 'Tipo_deporte','Genero','Division'],
    ['ID_patro','Nombre','Fecha_inicio','Fecha_termina','Aportacion'],
    ['ID_sucursal','Calle','Colonia','Pais','Ciudad','NumExt'],
    ['ID_producto','ID_sucursal','Existencia','Cantidad'],
    ['ID_clientesocio','Nombre','PrimApe','SegApe','Nivel','Fecha_inicio','Fecha_termina'],
    ['ID_producto','ID_provedor','Nombre','Valor','Color','Descripcion','Lanzamiento','Descuento','Tipo'],
  ['ID_personal','ID_sucursal','Nombre','PrimApe','SegApe','Edad','Cargo']
  ];

  //DataSource para popular la tabla
  dataSource = new MatTableDataSource<any>();
  chipArray: any[] = [];

  constructor( private _Service: ConsultasService,  //variable del servicio
    private dialog: MatDialog  //variable para abrir modales/diálogos
  ) {
    //Establecemos el array para botones de tipo Chip
    this.chipArray = ["Provedor","Equipo","Patrocinadores","Sucursal","Almacen","Cliente_Socio","Productos"];
    //Se carga una tabla por defecto al iniciar el componente
    this.clickEvent(0);
  }

  ngOnInit(): void {
  }

  clickEvent(i:number) {
    this.tableName = this.chipArray[i].toUpperCase();
    const data: any = this._Service.get("consulta?tabla="+this.chipArray[i].toUpperCase()).subscribe(data => {
        this.displayedColumns = this.columnsBank[i];  //establecemos las columnas de la tabla
        if(!this.displayedColumns.find(c => c=='OPCIONES'))
          this.displayedColumns.push('OPCIONES');  //agregamos las opciones de actualización y eliminación
        this.dataSource.data = data;  //actualizamos el dataSource
    });
  }

  createEvent() {
    this.createRow();
  }

  createRow(){
    try{
      //Abrimos el modal para edición
      this.dialog.open(ModalComponent, {
        data: {
          row: this.displayedColumns.filter(c => c!='OPCIONES'),  //al crear sólo mandamos las columnas
          type: 'create',
          table: this.tableName,
          rowId: this.displayedColumns[0]
        }
      }).afterClosed().subscribe(respuesta => {
        //Si se recibe un OK mostramos el SweetAlert correspondiente y actualizamos la tabla
        if(respuesta=='OK'){

          //Renderizamos cambios en la tabla
          this.dataSource._updateChangeSubscription();
        }
        else{
          //Si se recibe un CANCEL mostramos el SweetAlert correspondiente

        }
      });
    }
    catch(e){
      console.log(e);
    }
  }

  updateRow(element: any){
    let id = element[this.displayedColumns[0]];
    let type = "";

    try{
      //Abrimos el modal para edición
      this.dialog.open(ModalComponent, {
        data: {
          row: element,
          type: 'update',
          table: this.tableName,
          rowId: this.displayedColumns[0]
        }
      }).afterClosed().subscribe(respuesta => {
        //Si se recibe un OK mostramos el SweetAlert correspondiente y actualizamos la tabla
        if(respuesta=='OK'){
          //Renderizamos cambios en la tabla
          this.dataSource._updateChangeSubscription();

        }
        else{
          //Si se recibe un CANCEL mostramos el SweetAlert correspondiente
          console.log(respuesta);
        }
      });
    }
    catch(e){
      console.log(e);
    }
  }

  deleteRow(element: any){
    let id = element[this.displayedColumns[0]];  //id del registro seleccionado
    let type = "";

    if (!isNaN(id))
      type="number";
    else 
      type = "string"; 

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        "key": this.displayedColumns[0],
        "keyType": type
      },
    };
    this._Service.delete(id,this.tableName,options);
    //MANDAR A LLAMAR AL SERVICIO Y PASARLE LO NECESARIO PARA ELIMINAR EL REGISTRO
    //Renderizamos cambios en la tabla
    this.dataSource._updateChangeSubscription();
  }

}