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
    ['ID_PROVEDOR', 'NOMBRE'],
    ['ID_EQUIPO', 'NOMBRE', 'TIPO_DEPORTE','GENERO','DIVISION'],
    ['ID_PATRO','NOMBRE','FECHA_INICIO','FECHA_TERMINA','APORTACION'],
    ['ID_SUCURSAL','CALLE','COLONIA','PAIS','CIUDAD','NUMEXT'],
    ['ID_PRODUCTO','ID_SUCURSAL','EXISTENCIA','CANTIDAD'],
    ['ID_CLIENTESOCIO','NOMBRE','PRIMAPE','SEGAPE','NIVEL','FECHA_INICIO','FECHA_TERMINA'],
    ['ID_PRODUCTO','ID_PROVEDOR','NOMBRE','VALOR','COLOR','DESCRIPCION','LANZAMIENTO','DESCUENTO','TIPO'],
  ['ID_PERSONAL','ID_SUCURSAL','NOMBRE','PRIMAPE','SEGAPE','EDAD','CARGO']
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