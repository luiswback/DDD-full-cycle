import Customer from "./customer";
import Address from "./address";

describe("Customer unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "Jhon");
        }).toThrow("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("1", "");
        }).toThrow("Name is required");
    });

    it("should change name", () => {
        const customer = new Customer("123", "Jhon");

        customer.changeName("Pedro")

        expect(customer.name).toBe('Pedro')
    });

    it("should activate customer", () => {
        const customer = new Customer("1", "Customer 1");
        customer.address = new Address("Street 1", 123, "89900-000", "SMO");

        customer.activate()
        expect(customer.isActive()).toBe(true)
    });

    it("should throw error when address is undefined when activate a customer", () => {
        expect(() => {
            const customer = new Customer("1", "Customer 1");
            customer.activate()
        }).toThrow("Address is mandatory to activate a customer");
    });

    it("should deactivate customer", () => {
        const customer = new Customer("1", "Customer 1");
        customer.deactivate();
        expect(customer.isActive()).toBe(false)
    });

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1")
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    })
});
