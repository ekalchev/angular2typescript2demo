import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { DataTableComponent, DataTableColumnDefinition, DataTableCellComponent, TexboxCellComponent, DateComponent, DataTableRowComponent } from './data-table.component';
import { SetFocusDirective } from './set-focus.directive';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [
        DataTableComponent,
        DataTableColumnDefinition,
        DataTableCellComponent,
        TexboxCellComponent,
        DataTableRowComponent,
        DateComponent,
        SetFocusDirective],
    exports: [DataTableComponent, DataTableColumnDefinition]
})
export class DataTableModule { }
