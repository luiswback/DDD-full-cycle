import Address from "./address";
import EventDispatcher from "../event/@shared/event-dispatcher";
import CustomerAddressUpdatedEvent from "../event/customer/customer-address-updated.event";
import SendConsoleLogWhenUpdateCustomerAddressHandler
    from "../event/customer/handler/send-console-log-when-update-customer-address.handler";
import CustomerCreatedEvent from "../event/customer/customer-created.event";
import SendConsoleLogWhenCreateCustomer1Handler
    from "../event/customer/handler/send-console-log-when-create-customer1.handler";
import SendConsoleLogWhenCreateCustomer2Handler
    from "../event/customer/handler/send-console-log-when-create-customer2.handler";

export default class Customer {

    private _id: string
    private _name: string = "";
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;
    private eventDispatcher: EventDispatcher;

    constructor(id: string, name: string, eventDispatcher: EventDispatcher) {
        this._id = id;
        this._name = name;
        this.validate();
        this.eventDispatcher = eventDispatcher;
        this.registerEventHandlers();

    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id is required")
        }
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;

        const customerAddressUpdatedEvent = new CustomerAddressUpdatedEvent({
            _id: this._id,
            _street: address.street,
            _number: address.number,
            _zip: address.zip,
            _city: address.city,
            _name: this._name
        });
        this.eventDispatcher.notify(customerAddressUpdatedEvent);
    }

    private registerEventHandlers() {
        this.eventDispatcher = new EventDispatcher();
        const eventHandler1 = new SendConsoleLogWhenUpdateCustomerAddressHandler();
        this.eventDispatcher.register("CustomerAddressUpdatedEvent", eventHandler1);
    }

    isActive(): boolean {
        return this._active;
    }

    registerCustomerCreateEvent() {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new SendConsoleLogWhenCreateCustomer1Handler();
        const eventHandler2 = new SendConsoleLogWhenCreateCustomer2Handler();
        eventDispatcher.register("CustomerCreatedEvent", eventHandler1)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)

        const customerCreatedEvent = new CustomerCreatedEvent({
            name: "Customer 1",
            street: "Customer 1 street",
            city: "SMO"
        });

        eventDispatcher.notify(customerCreatedEvent);
    }

    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer")
        }

        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    set address(address: Address) {
        this._address = address;
    }
}
