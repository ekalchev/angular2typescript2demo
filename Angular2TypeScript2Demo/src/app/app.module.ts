import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { GridRowComponent } from './grid-row.component';
import { GridCellComponent } from './grid-cell.component';
import { GridCellEditComponent } from './grid-cell-edit.component';
import { AppRoutingModule, routingComponents } from './app-routing.module'
import { DataService } from './data.service';
import { SetFocusDirective } from './set-focus.directive';

@NgModule({
    imports: [BrowserModule, AppRoutingModule, FormsModule],
    declarations: [AppComponent, GridRowComponent, GridCellComponent, GridCellEditComponent, SetFocusDirective, routingComponents],
    bootstrap: [AppComponent],
    providers: [DataService]
})
export class AppModule { }
