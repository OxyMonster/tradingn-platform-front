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
    return this._http.post(environment.apiUrl + '/api/clients/getClient/', { id });
  }

  updateClient(payload: any, clientId: any) {
    return this._http.post(environment.apiUrl + '/api/clients/updateClient', { payload, clientId });
  }

  registerClient(payload: any) {
    return this._http.post(environment.apiUrl + '/api/clients/registerClient', payload);
  }
}
