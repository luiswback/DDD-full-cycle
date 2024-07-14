import Customer from "../../../../domain/customer/entity/customer";
import CustomerModel from "./customer.model";
import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer-repository.interface";
import Address from "../../../../domain/customer/value-object/address";
import EventDispatcher from "../../../../domain/@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../../../../domain/customer/event/customer-created.event";

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        })
        entity.registerCustomerCreateEvent();
    }

    async find(id: string): Promise<Customer> {
        let customerModel;
        const eventDispatcher = new EventDispatcher();

        try {
            customerModel = await CustomerModel.findOne({where: {id}, rejectOnEmpty: true});
        } catch (error) {
            throw new Error("Customer not found")
        }
        const customer = new Customer(id, customerModel.name, eventDispatcher);
        const address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zipcode,
            customerModel.city
        )
        customer.changeAddress(address);
        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();
        const eventDispatcher = new EventDispatcher();

        const customers = customerModels.map((customerModels) => {
            let customer = new Customer(customerModels.id, customerModels.name, eventDispatcher);
            customer.addRewardPoints(customerModels.rewardPoints);
            const address = new Address(
                customerModels.street,
                customerModels.number,
                customerModels.zipcode,
                customerModels.city
            );
            customer.changeAddress(address);
            if (customerModels.active) {
                customer.activate();
            }
            return customer
        });
        return customers;
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                id: entity.id,
                name: entity.name,
                street: entity.address.street,
                number: entity.address.number,
                zipcode: entity.address.zip,
                city: entity.address.city,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints,
            },
            {
                where: {
                    id: entity.id
                },
            }
        )
    };

}
