import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { DataTableModule } from './dataTable/data-table.module';
import { AppRoutingModule, routingComponents } from './app-routing.module'
import { DataService } from './data.service';

@NgModule({
    imports: [BrowserModule, AppRoutingModule, FormsModule, DataTableModule],
    declarations: [
        AppComponent,
        routingComponents],
    bootstrap: [AppComponent],
    providers: [DataService]
})
export class AppModule { }
