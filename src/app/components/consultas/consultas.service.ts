import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConsultasService {
    url: string = "http://localhost:4201";

    constructor(private httpClient: HttpClient) { }

    get(query : string): Observable<any[]> {
        return this.httpClient.get(this.url+"/"+query) as Observable<any[]>;
    }

    /* getRow(rowID: any) {
        return this.httpClient.get(this.url + `/${rowID}`) as Observable<any[]>;
    } */

    delete(rowID: any, tabla: String, options: any): void {
        console.log(this.url + `/eliminar/${tabla}/${rowID}`);
        this.httpClient.delete(this.url + `/eliminar/${tabla}/${rowID}`, options).subscribe(() => console.log('Delete Exitoso'));
    }

    update(rowID: any, table: any, options: any): void {
        console.log(options);
        this.httpClient.put(this.url + `/${table}/actualizar/${rowID}`, options).subscribe(() => console.log('Update Exitoso'));
    }

    create(newRow: any): Observable<any> {
        return this.httpClient.post(this.url, newRow) as Observable<any>;
    }
}
