import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {
    endpoint: string = "";

    constructor(private httpClient: HttpClient) { }

    get(): Observable<any[]> {
        return this.httpClient.get(this.endpoint) as Observable<any[]>;
    }

    /* getRow(rowID: any) {
        return this.httpClient.get(this.endpoint + `/${rowID}`) as Observable<any[]>;
    } */

    delete(rowID: any): Observable<any> {
        return this.httpClient.delete(this.endpoint + `/${rowID}`) as Observable<any>;
    }

    update(rowID: any, modifiedRow: any): Observable<any> {
        return this.httpClient.put(this.endpoint + `/${rowID}`, modifiedRow) as Observable<any>;
    }

    create(newRow: any): Observable<any> {
        return this.httpClient.post(this.endpoint, newRow) as Observable<any>;
    }
}
