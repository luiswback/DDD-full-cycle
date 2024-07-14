import Customer from "./customer";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";

describe("Customer unit tests", () => {

    it("should throw error when id is empty", () => {
        const eventDispatcher = new EventDispatcher();

        expect(() => {
            let customer = new Customer("", "Jhon", eventDispatcher);
        }).toThrow("Id is required");
    });

    it("should throw error when name is empty", () => {
        const eventDispatcher = new EventDispatcher();

        expect(() => {
            let customer = new Customer("1", "", eventDispatcher);
        }).toThrow("Name is required");
    });

    it("should change name", () => {
        const eventDispatcher = new EventDispatcher();

        const customer = new Customer("123", "Jhon", eventDispatcher);

        customer.changeName("Pedro")

        expect(customer.name).toBe('Pedro')
    });

    it("should activate customer", () => {
        const eventDispatcher = new EventDispatcher();

        const customer = new Customer("1", "Customer 1", eventDispatcher);
        customer.address = new Address("Street 1", 123, "89900-000", "SMO");

        customer.activate()
        expect(customer.isActive()).toBe(true)
    });

    it("should throw error when address is undefined when activate a customer", () => {
        const eventDispatcher = new EventDispatcher();

        expect(() => {
            const customer = new Customer("1", "Customer 1", eventDispatcher);
            customer.activate()
        }).toThrow("Address is mandatory to activate a customer");
    });

    it("should deactivate customer", () => {
        const eventDispatcher = new EventDispatcher();

        const customer = new Customer("1", "Customer 1", eventDispatcher);
        customer.deactivate();
        expect(customer.isActive()).toBe(false)
    });

    it("should add reward points", () => {
        const eventDispatcher = new EventDispatcher();

        const customer = new Customer("1", "Customer 1", eventDispatcher)
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    })
});
