import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DetailsComponent } from './details.component'
import { GridComponent } from './grid.component'

const routes: Routes = [
    { path: "demo", component: GridComponent }
];


@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}

export const routingComponents = [AppComponent, GridComponent, DetailsComponent];