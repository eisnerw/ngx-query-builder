import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface NamedRulesetDialogData {
  name: string;
  rulesetName: string;
  allowDelete: boolean;
  modified: boolean;
  rulesetNameSanitizer?: (value: string) => string;
}

export interface NamedRulesetDialogResult {
  action: 'save' | 'delete' | 'cancel' | 'removeName';
  name?: string;
}

@Component({
  selector: 'lib-named-ruleset-dialog',
  standalone: false,
  template: `
    <h1 mat-dialog-title>Update {{data.rulesetName}}</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>{{data.rulesetName}} Name</mat-label>
        <input matInput [(ngModel)]="name" (input)="onInput($event)" />
        <button mat-icon-button matSuffix *ngIf="name" (click)="name = ''" type="button">✕</button>
      </mat-form-field>
      <div *ngIf="data.modified" class="q-modified-warning">
        {{ name.trim() === '' ? 'The name will be removed from the ' + data.rulesetName : 'Existing definition will be updated.' }}
      </div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dialogRef.close({action: 'cancel'})">Cancel</button>
      <button mat-raised-button color="primary" (click)="dialogRef.close({action: 'save', name})">Update</button>
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

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizer = this.data.rulesetNameSanitizer ||
      ((v: string) => v.toUpperCase().replace(/ /g, '_').replace(/[^A-Z0-9_]/g, ''));
    this.name = sanitizer(input.value);
  }
}
