import { Client } from './../../../features/client/client';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { log } from 'console';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  standalone: true,
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword implements OnInit {
  form!: FormGroup;
  userId!: string;
  @Inject(MAT_DIALOG_DATA) public data: any;

  constructor(
    private _fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePassword>,
    private authService: AuthService
  ) {
    this.form = this._fb.group({
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log(this.data);

    this.userId = this.data.client._id;
  }

  onFormSubmit() {
    const payload = {
      password: this.form.value,
      clientId: this.data.client._id,
    };

    console.log(payload);

    if (this.form.valid) {
      this.onChangePassword();
      return;
    }
    return;
  }

  onChangePassword() {
    const payload = {
      password: this.form.value.password,
      userId: this.userId,
    };
    return this.authService.changePassword(payload).subscribe(
      (res: any) => {
        console.log(this.form.valid, this.userId);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  saveChanges() {
    // Do something, then close dialog and send back data
    this.dialogRef.close({ updated: true });
  }

  cancel() {
    this.dialogRef.close(); // closes without data
  }
}
