import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  type: string = "";
  row: any = {};
  columns: any[] = [];
  formGroup: FormGroup = new FormGroup({});

  constructor(
    private dialogRef: MatDialogRef<ModalComponent>, //referencia a sí mismo
      @Inject(MAT_DIALOG_DATA) public data: any //información pasada a este modal
  ) {
    this.type = data.type; //creación o actualización
    this.row = data.row;  //guardamos el registro enviado
    
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

      console.log(obj);

      //Asignamos el objeto al FormGroup
      this.formGroup = new FormGroup(obj);
      console.log(this.formGroup.controls);
    }
  }

  action(){
    let registro = this.formGroup.getRawValue();
    console.log(registro);
    
    if(this.type=='create'){
      //MANDAR A LLAMAR AL SERVICIO Y PASARLE LO NECESARIO PARA CREAR EL REGISTRO
    }
    else{
      //MANDAR A LLAMAR AL SERVICIO Y PASARLE LO NECESARIO PARA ACTUALIZAR EL REGISTRO
    }
  }

  cancel(){
    this.close('CANCEL');
  }

  //Función de cierre del modal con envío de respuesta opcional
  close = (value?: any) => this.dialogRef.close(value);
}
