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

  getClientBalance(workerId: any, clientId: any, asset: any) {
    return this._http.get(environment.apiUrl + '/api/wallet/getBalances', {
      params: { workerId, clientId, asset },
    });
  }

  addUpdateBalance(clientId: any, asset: any, amount: any) {
    return this._http.post(environment.apiUrl + '/api/wallet/addEditBalance', {
      clientId,
      asset,
      amount,
    });
  }

  getClientsForWorker(workerId: any) {
    return this._http.post(environment.apiUrl + '/api/clients/getClientsForWorker', { workerId });
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
