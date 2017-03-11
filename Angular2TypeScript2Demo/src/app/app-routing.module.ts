﻿import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DetailsComponent } from './details.component'

const routes: Routes = [
    { path: "demo", component: AppComponent }
];


@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}

export const routingComponents = [AppComponent, DetailsComponent];