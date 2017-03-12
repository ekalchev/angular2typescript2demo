import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { DataTableComponent, DataTableColumnDefinition, DataTableCellComponent, TexboxCellComponent, DateComponent } from './dataTable/data-table.component';
import { AppRoutingModule, routingComponents } from './app-routing.module'
import { DataService } from './data.service';
import { SetFocusDirective } from './set-focus.directive';

@NgModule({
    imports: [BrowserModule, AppRoutingModule, FormsModule],
    declarations: [
        AppComponent,
        DataTableComponent,
        DataTableColumnDefinition,
        DataTableCellComponent,
        TexboxCellComponent,
        DateComponent,
        SetFocusDirective,
        routingComponents],
    bootstrap: [AppComponent],
    providers: [DataService]
})
export class AppModule { }
