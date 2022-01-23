import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-info-dialog',
  templateUrl: './edit-info-dialog.component.html',
  styleUrls: ['./edit-info-dialog.component.css']
})
export class EditInfoDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditInfoDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public path: string) { }

  unitForm: FormGroup;
  state: string;

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.unitForm = this.fb.group({
      publicInfo: [''],
      delegateInfo: [''],
      internalInfo: ['']
    })
  }

  changeHandler(state) {
    this.state = state
  }

}
