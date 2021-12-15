import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {
    url: string = "http://localhost:4201";

    constructor(private httpClient: HttpClient) { }

    get(query : string): Observable<any[]> {
        return this.httpClient.get(this.url+"/"+query) as Observable<any[]>;
    }

    /* getRow(rowID: any) {
        return this.httpClient.get(this.url + `/${rowID}`) as Observable<any[]>;
    } */

    delete(rowID: any): Observable<any> {
        return this.httpClient.delete(this.url + `/${rowID}`) as Observable<any>;
    }

    update(rowID: any, modifiedRow: any): Observable<any> {
        return this.httpClient.put(this.url + `/${rowID}`, modifiedRow) as Observable<any>;
    }

    create(newRow: any): Observable<any> {
        return this.httpClient.post(this.url, newRow) as Observable<any>;
    }
}
