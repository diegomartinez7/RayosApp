import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';
import { HttpHeaders } from '@angular/common/http';

import { ServicesService } from "./consultas.service";

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {
  //Declarar vectores de nombres de columnas de cada tabla

  //Lógica que cambie el vector de displayedColumns de acuerdo al Chip
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  displayedColumns2 = [
  ['ID_PROVEDOR', 'NOMBRE'],
  ['ID_EQUIPO', 'NOMBRE', 'TIPO_DEPORTE','GENERO','DIVISION'],
  ['ID_PATRO','NOMBRE','FECHA_INICIO','FECHA_TERMINA','APORTACION'],
  ['ID_SUCURSAL','CALLE','COLONIA','PAIS','CIUDAD','NUMEXT'],
  ['ID_PRODUCTO','ID_SUCURSAL','EXISTENCIA','CANTIDAD'],
  ['ID_CLIENTESOCIO','NOMBRE','PRIMAPE','SEGAPE','NIVEL','FECHA_INICIO','FECHA_TERMINA'],
  ['ID_PRODUCTO','ID_PROVEDOR','NOMBRE','VALOR','COLOR','DESCRIPCION','LANZAMIENTO','DESCUENTO','TIPO'],
  ['ID_PERSONAL','ID_SUCURSAL','NOMBRE','PRIMAPE','SEGAPE','EDAD','CARGO']];
  //Asignar respuesta de la solicitud HTTP a la BD en la propiedad data del dataSource
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  chipArray: any[] = [];
  

  constructor(private _Service: ServicesService) {
    this.chipArray = ["Provedor","Equipo","Patrocinadores","Sucursal","Almacen","Cliente_Socio","Productos","Personal_Suc"];
    //Asignar la información de una tabla por defecto cuando cargue el componente (elegir alguna)
    // this.dataSource.data = 
    //this.dataSource._updateChangeSubscription();  --> Se coloca al final de las CRUD
  }

  clickEvent(i:number) {
    const data: any = this._Service.get("consulta?tabla="+this.chipArray[i].toUpperCase()).subscribe(data => {
        console.log(data);
        console.log(ELEMENT_DATA);
        this.displayedColumns = this.displayedColumns2[i];
        this.dataSource = new MatTableDataSource<any>(data);
    });
  }

  ngOnInit(): void {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        key: 1,
        keyType: 'test',
      },
    };
    this._Service.delete("jis","provedor",options);
  }

}



const ELEMENT_DATA: any = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
];
