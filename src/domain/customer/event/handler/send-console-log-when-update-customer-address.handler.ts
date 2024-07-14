import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressUpdatedEvent from "../customer-address-updated.event";

export default class SendConsoleLogWhenUpdateCustomerAddressHandler implements EventHandlerInterface<CustomerAddressUpdatedEvent> {
    handle(event: CustomerAddressUpdatedEvent): void {
        // console.log(event['eventData'])
        //ajustar esse método para receber os parametros certos.
        console.log(`Endereço do cliente: ${event.eventData._id}, ${event.eventData._name} alterado para: rua: ${event.eventData._street}
        número: ${event.eventData._number} zipcode: ${event.eventData._zip}, cidade: ${event.eventData._city}
        `
        )
    }
}
