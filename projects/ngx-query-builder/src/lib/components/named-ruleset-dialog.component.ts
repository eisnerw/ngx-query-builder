import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface NamedRulesetDialogData {
  name: string;
  rulesetName: string;
  allowDelete: boolean;
  modified: boolean;
}

export interface NamedRulesetDialogResult {
  action: 'save' | 'delete' | 'cancel';
  name?: string;
}

@Component({
  selector: 'lib-named-ruleset-dialog',
  template: `
    <h1 mat-dialog-title>Save {{data.rulesetName}}</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>{{data.rulesetName}} Name</mat-label>
        <input matInput [(ngModel)]="name" />
      </mat-form-field>
      <div *ngIf="data.modified" class="q-modified-warning">Existing definition will be updated.</div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dialogRef.close({action: 'cancel'})">Cancel</button>
      <button mat-button color="warn" *ngIf="data.allowDelete" (click)="dialogRef.close({action: 'delete'})">Delete</button>
      <button mat-raised-button color="primary" [disabled]="!name" (click)="dialogRef.close({action: 'save', name})">Save</button>
    </div>
  `
})
export class NamedRulesetDialogComponent {
  name: string;
  constructor(
    public dialogRef: MatDialogRef<NamedRulesetDialogComponent, NamedRulesetDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: NamedRulesetDialogData
  ) {
    this.name = data.name;
  }
}
