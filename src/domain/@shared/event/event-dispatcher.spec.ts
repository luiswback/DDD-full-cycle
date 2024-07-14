import EventDispatcher from "./event-dispatcher";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import SendConsoleLogWhenCreateCustomer1Handler
    from "../../customer/event/handler/send-console-log-when-create-customer1.handler";
import SendConsoleLogWhenCreateCustomer2Handler
    from "../../customer/event/handler/send-console-log-when-create-customer2.handler";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendConsoleLogWhenUpdateCustomerAddressHandler
    from "../../customer/event/handler/send-console-log-when-update-customer-address.handler";
import CustomerAddressUpdatedEvent from "../../customer/event/customer-address-updated.event";

describe("Domain events tests", () => {
    it('should register an event handler', () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it('should unregister an event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0)
    });

    it('should unregister all event handlers', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it('should notify all event handlers', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0

        });
        //Quando o notify for executado o sendEmailWhenProductIsCreatedHandler.handle() deve ser chamado.;
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();

    });

    // it('should notify all event handlers2', () => {
    //     const eventDispatcher = new EventDispatcher();
    //     const eventHandler = new SendConsoleLogWhenCreateCustomer1Handler();
    //     const eventHandler2 = new SendConsoleLogWhenCreateCustomer2Handler();
    //     const spyEventHandler = jest.spyOn(eventHandler, "handle");
    //     const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    //
    //     eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    //     eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    //
    //     expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
    //     expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
    //
    //     const customerCreatedEvent = new CustomerCreatedEvent({
    //         name: "Customer 1",
    //         street: "Customer 1 street",
    //         city: "SMO"
    //     });
    //
    //     //Quando o notify for executado o sendEmailWhenProductIsCreatedHandler.handle() deve ser chamado.;
    //     eventDispatcher.notify(customerCreatedEvent);
    //
    //     expect(spyEventHandler).toHaveBeenCalled();
    //     expect(spyEventHandler2).toHaveBeenCalled();
    //
    // });

    // it('should notify all event when change address handlers', () => {
    //     const eventDispatcher = new EventDispatcher();
    //     const eventHandler = new SendConsoleLogWhenUpdateCustomerAddressHandler();
    //     const spyEventHandler = jest.spyOn(eventHandler, "handle");
    //
    //     eventDispatcher.register("CustomerAddressUpdatedEvent", eventHandler);
    //
    //     expect(eventDispatcher.getEventHandlers["CustomerAddressUpdatedEvent"][0]).toMatchObject(eventHandler);
    //
    //     const customerCreatedEvent = new CustomerAddressUpdatedEvent({
    //         name: "Customer 1",
    //         street: "Customer 1 street",
    //         city: "SMO"
    //     });
    //     //Quando o notify for executado o sendEmailWhenProductIsCreatedHandler.handle() deve ser chamado.;
    //     eventDispatcher.notify(customerCreatedEvent);
    //
    //     expect(spyEventHandler).toHaveBeenCalled();
    //
    // });
});


