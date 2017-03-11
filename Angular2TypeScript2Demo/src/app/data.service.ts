import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Customer } from './customer';
import { CUSTOMERS } from './mock-customers';

@Injectable()
export class DataService {
    getCustomers(): Observable<Customer[]> {
        //simulate async http request with 2 sec delay
        return new Observable<Customer[]>((subscriber: Subscriber<Customer[]>) => {
            setTimeout(() => subscriber.next(CUSTOMERS), 2000);
        });
    }

    deleteCustomer(customer: Customer) {
        let index = CUSTOMERS.indexOf(customer);
        if (index >= 0) {
            CUSTOMERS.splice(index, 1);
        }
    }

    createCustomer(customer: Customer) {
        CUSTOMERS.push(customer);
    }
}