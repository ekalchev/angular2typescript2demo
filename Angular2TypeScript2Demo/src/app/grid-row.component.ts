import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Customer } from './customer';

@Component({
    selector: 'grid-row-component',
    templateUrl: 'app/grid-row.component.html',
})
export class GridRowComponent {
    @Output()
    deleteRequest = new EventEmitter<Customer>();

    delete() {
        this.deleteRequest.emit(this.customer);
    }

    @Input()
    customer: Customer;
}
