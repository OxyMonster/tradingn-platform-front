import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminWorkersService {
  constructor(private _http: HttpClient) {}

  registerWorkers(payload: any) {
    return this._http.post(environment.apiUrl + '/api/workers/registerWorker', payload);
  }

  getWorkers(): any {
    return this._http.get(environment.apiUrl + '/api/workers/getWorkers');
  }
}
