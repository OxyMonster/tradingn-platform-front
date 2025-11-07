import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RegisterNewClient } from '../../../admin-clients/components/register-new-client/register-new-client';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { AdminWorkersService } from '../../services/admin-workers.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register-workers',
  imports: [MatFormField, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register-workers.html',
  styleUrl: './register-workers.scss',
})
export class RegisterWorkers {
  form!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _workersService: AdminWorkersService,
    private dialogRef: MatDialogRef<RegisterNewClient>
  ) {
    this.form = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  onFormSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.onRegisterWorkers();
      return;
    }
  }

  onRegisterWorkers() {
    if (this.form.valid) {
      this._workersService.registerWorkers(this.form.value).subscribe({
        next: (response) => {
          console.log('Worker registered successfully', response);
          this.dialogRef.close({ registered: true });
        },
        error: (error) => {
          console.error('Error registering worker', error);
        },
      });
    }
  }

  saveChanges() {
    // Do something, then close dialog and send back data
    this.dialogRef.close({ updated: true });
  }

  cancel() {
    this.dialogRef.close(); // closes without data
  }
}
