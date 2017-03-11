import { Component, Input } from '@angular/core';
import { Customer } from './customer';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'

@Component({
    selector: 'grid-component',
    templateUrl: 'app/grid.component.html',
})
export class GridComponent {
    @Input()
    customers: Observable<Customer[]>;

    constructor(private dataService: DataService) {
        this.customers = dataService.getCustomers();
    }

    deleteCustomer(customer: Customer) {
        this.dataService.deleteCustomer(customer)
    }

    addCustomer() {
        this.dataService.createCustomer(new Customer());
    }
}
