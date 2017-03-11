import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-routing.module'

@NgModule({
    imports: [BrowserModule, AppRoutingModule],
    declarations: [AppComponent, routingComponents],
    bootstrap: [AppComponent]
})
export class AppModule { }
