import { Component, Input } from '@angular/core';
import { Customer } from './customer';

@Component({
    selector: 'details-component',
    template: `<div class="details">{{ customer.firstName }}</div>`,
})
export class DetailsComponent {
    @Input()
    customer: Customer;
}
