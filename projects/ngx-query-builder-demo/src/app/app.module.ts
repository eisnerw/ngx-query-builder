import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { QueryBuilderModule } from 'ngx-query-builder';
// The EditRulesetDialogComponent is a standalone component. It should be
// imported rather than declared to avoid NG6008 errors.
import { EditRulesetDialogComponent } from './edit-ruleset-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    QueryBuilderModule,
    EditRulesetDialogComponent
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
