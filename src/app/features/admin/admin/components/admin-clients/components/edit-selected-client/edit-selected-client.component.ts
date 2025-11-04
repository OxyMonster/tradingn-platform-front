import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

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
  editClientForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editClientForm = this.fb.group({
      name: [''],
      email: [''],
      balance: [''],
      gender: [''],
      verificationStatus: [''],
      country: [''],
      worker: [''],
      affiliation: [''],
      isVip: [false],
    });
  }

  ngOnInit() {}
}
