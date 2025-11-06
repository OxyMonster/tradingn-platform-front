import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-register-new-client',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './register-new-client.html',
  styleUrl: './register-new-client.scss',
})
export class RegisterNewClient {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterNewClient>,
    private _clients: ClientsService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onFormSubmit() {
    if (this.form.valid) {
      this.onRegisterClient();
    }
  }

  onRegisterClient() {
    console.log(this.form.valid);

    const payload = this.form.value;
    return this._clients.registerClient(payload).subscribe((res) => {
      this.saveChanges();
    });
  }

  saveChanges() {
    // Do something, then close dialog and send back data
    this.dialogRef.close({ updated: true });
  }

  cancel() {
    this.dialogRef.close(); // closes without data
  }
}
