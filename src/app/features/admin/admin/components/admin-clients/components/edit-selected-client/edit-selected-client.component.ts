import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ClientsService } from '../../services/clients.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-selected-client',
  templateUrl: './edit-selected-client.component.html',
  styleUrls: ['./edit-selected-client.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export class EditSelectedClientComponent implements OnInit {
  clientForm: FormGroup;
  clientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _client: ClientsService,
    private _route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: [''],
      phone: [''],
      google_2fa_secret: [''],
      client_ip: [''],
      affiliation: [''],
      created_at: [''],
      gender: [''],
      verification_level: [''],
      country: [''],
      worker: [''],
      is_vip: [false],
      is_banned: [false],
      overall_balance: [''],
    });
  }

  ngOnInit() {
    this._route.paramMap.subscribe((params) => {
      this.clientId = params.get('id');
      console.log(this.clientId);
    });
  }

  onFormSubmit() {
    console.log(this.clientForm.value);
    if (this.clientForm.valid) {
      this.onUpdateClient().subscribe(
        (response) => {
          console.log('Client updated successfully', response);
        },
        (error) => {
          console.error('Error updating client', error);
        }
      );
    }
  }

  onUpdateClient() {
    return this._client.updateClient(this.clientForm.value, this.clientId);
  }
}
