import Customer from "../entity/customer";
import {v4 as uuid} from 'uuid';
import EventDispatcher from "../../@shared/event/event-dispatcher";
import Address from "../value-object/address";

export default class CustomerFactory {
    public static create(name: string): Customer {
        const eventDispatcher = new EventDispatcher();
        return new Customer(uuid(), name, eventDispatcher);
    }

    public static createWithAddress(name: string, address: Address): Customer {
        const eventDispatcher = new EventDispatcher();
        const customer = new Customer(uuid(), name, eventDispatcher);
        customer.changeAddress(address);
        return customer;
    }
}
