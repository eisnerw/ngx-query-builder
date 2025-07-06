import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgxQueryBuilderModule } from '@kerwin612/ngx-query-builder';
import { BqlPopupQueryBuilderComponent } from './bql-popup-query-builder.component';

@NgModule({
  declarations: [BqlPopupQueryBuilderComponent],
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, NgxQueryBuilderModule],
  exports: [BqlPopupQueryBuilderComponent]
})
export class PopupNgxQueryBuilderModule {}
