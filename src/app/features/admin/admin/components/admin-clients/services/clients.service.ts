import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(private _http: HttpClient) {}

  getAllClients() {
    return this._http.get(environment.apiUrl + '/api/clients/getClients');
  }

  getClient(id: String) {
    return this._http.get(environment.apiUrl + '/api/clients/getClient/' + id);
  }
}
