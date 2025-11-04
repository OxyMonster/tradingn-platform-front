import { Component, OnInit } from '@angular/core';
import { ClientsService } from './services/clients.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../../shared/components/loading/loading/loading';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-clients',
  templateUrl: './admin-clients.component.html',
  styleUrls: ['../../admin.scss'],
  imports: [AsyncPipe, LoadingComponent, RouterModule],
})
export class AdminClientsComponent implements OnInit {
  $clients: Observable<any | null>;

  constructor(private _clients: ClientsService) {
    this.$clients = this._clients.getAllClients();
  }

  ngOnInit() {}
}
