import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminTransactionsService {
  // const TransactionModel: Type = {
  //       account: String,
  //       currency: String,
  //       status: String,
  //       type: String,
  //       amount: Number
  // }

  constructor(private http: HttpClient) {}

  createTransaction(payload: any) {
    return this.http.post(environment.apiUrl + '/api/transactions/createTranaction', payload);
  }

  getTransactions(workerId: any, clientId: any, type: any) {
    return this.http.get(environment.apiUrl + '/api/transactions/getTransactions', {
      params: { workerId, clientId, type },
    });
  }
}
