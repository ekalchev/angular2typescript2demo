import { Component } from '@angular/core';
import { Customer } from './customer';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.styles.css']
})
export class AppComponent {
    title = 'Angular';
    readonly customers: Customer[] = [
        { firstName: "John", lastName: "Smith" }
    ];
    selectedCustomer: Customer;
    constructor() {
        this.selectedCustomer = this.customers[0];
    }
    onSubmitClick() {
        this.title = 'Form is submitted';
    }
    onKeyUp(event: any) {
        let a = event;
    }
}