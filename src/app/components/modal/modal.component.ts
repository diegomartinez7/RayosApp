import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpHeaders } from '@angular/common/http';
import { ConsultasService } from "../consultas/consultas.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  type: string = "";
  table: string = "";
  row: any = {};
  rowId: string;
  columns: any[] = [];
  formGroup: FormGroup = new FormGroup({});

  constructor(private _Service: ConsultasService,
    private dialogRef: MatDialogRef<ModalComponent>, //referencia a sí mismo
      @Inject(MAT_DIALOG_DATA) public data: any //información pasada a este modal
  ) {
    this.type = data.type;  //creación o actualización
    this.table = data.table;  //nombre de la tabla
    this.row = data.row;  //guardamos el registro enviado
    this.rowId = data.rowId;


    if(this.row){
      if(Array.isArray(this.row)){
        this.columns = this.row;
      }
      else{
        //Guardamos las columnas para este registro
        this.columns = Object.keys(this.row);
      }
    }
  }

  ngOnInit(): void {
    this.initForm();  //creamos el formulario reactivo en base a las columnas
  }
  objs: any[] = []
  initForm(): void {
    if (this.row && this.columns.length > 0) {
      //Vector de valores del registro
      let valores = (!Array.isArray(this.row))? Object.values(this.row) : [];
      let obj: { [k: string]: any } = {};  //objeto vacío para ser llenado con varios key:value

      //Creamos dinámicamente el objeto de estructura para el formulario
      for(let i = 0; i<this.columns.length; i++){
        let valor = (valores != [])? valores[i] : '';
        obj[String(this.columns[i])] = new FormControl(valor, [Validators.required]);
      }

      //
      
      //Asignamos el objeto al FormGroup
      this.formGroup = new FormGroup(obj);
      //console.log(this.formGroup.controls);
    }
  }

  action(){
    let registro: any[] = this.formGroup.getRawValue() as any[];
    let types = "";

    this.objs =(!Array.isArray(registro))? Object.values(registro) : [];
    console.log(this.objs[0]);

    if (!isNaN(this.objs[0]))
      types="number";
    else 
      types = "string"; 
    
    if(this.type=='create'){
      //MANDAR A LLAMAR AL SERVICIO Y PASARLE LO NECESARIO PARA CREAR EL REGISTRO
      //EL NOMBRE DE LA TABLA YA ESTÁ EN this.table
    }
    else if(this.type=='update'){
        const body = {
            "key": this.rowId,
            "keyType": types,
            "updateObj" : registro

        };
        this._Service.update(this.objs[0],this.table,body);
    }
    this.close('OK');
  }

  cancel(){
    this.close('CANCEL');
  }

  //Función de cierre del modal con envío de respuesta opcional
  close = (value?: any) => this.dialogRef.close(value);
}
