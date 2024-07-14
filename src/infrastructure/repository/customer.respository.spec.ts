import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../database/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/customer/entity/customer";
import Address from "../../domain/customer/value-object/address";
import ProductModel from "../database/sequelize/model/product.model";
import OrderModel from "../database/sequelize/model/order.model";
import OrderItemModel from "../database/sequelize/model/order-item.model";
import EventDispatcher from "../../domain/@shared/event/event-dispatcher";

describe("Customer repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true},
        });

        sequelize.addModels([CustomerModel, ProductModel, OrderModel, OrderItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a customer', async () => {
        const customerRepository = new CustomerRepository();
        const eventDispatcher = new EventDispatcher();

        const customer = new Customer("1", "Customer 1", eventDispatcher);
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({where: {id: "1"}});
        expect(customerModel.toJSON()).toStrictEqual(({
            id: "1",
            name: customer.name,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        }))

    });


    it('should update a customer', async () => {
        const eventDispatcher = new EventDispatcher();

        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1", eventDispatcher);
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({where: {id: "1"}});

        expect(customerModel.toJSON()).toStrictEqual(({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
        }))

        customer.changeName("Customer 2");

        await customerRepository.update(customer);

        const customerModel2 = await CustomerModel.findOne({where: {id: "1"}});

        expect(customerModel2.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
        })

    });

    it('should find a customer', async () => {
        const customerRepository = new CustomerRepository();
        const eventDispatcher = new EventDispatcher();

        const customer = new Customer("1", "Customer 1", eventDispatcher);
        customer.address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        await customerRepository.create(customer);

        const customerResult = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(customerResult);
    });

    it('should throw an error when customer is not found', async () => {
        const customerRepository = new CustomerRepository();

        await expect(async () => {
            await customerRepository.find("ASFKSAKJFJKAS");
        }).rejects.toThrow("Customer not found");
    });

    it('should find all customers', async () => {
        const eventDispatcher = new EventDispatcher();
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("1", "Customer 1", eventDispatcher);
        customer1.address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.addRewardPoints(10);
        customer1.activate();
        await customerRepository.create(customer1);

        const customer2 = new Customer("2", "Customer 2", eventDispatcher);
        customer2.address = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.addRewardPoints(20);
        customer2.activate();

        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);

        expect(customers[0].id).toEqual(customer1.id);
        expect(customers[0].name).toEqual(customer1.name);
        expect(customers[0].address.street).toEqual(customer1.address.street);
        expect(customers[0].address.number).toEqual(customer1.address.number);
        expect(customers[0].address.zip).toEqual(customer1.address.zip);
        expect(customers[0].address.city).toEqual(customer1.address.city);
        expect(customers[0].isActive()).toEqual(customer1.isActive());
        expect(customers[0].rewardPoints).toEqual(customer1.rewardPoints);

        expect(customers[1].id).toEqual(customer2.id);
        expect(customers[1].name).toEqual(customer2.name);
        expect(customers[1].address.street).toEqual(customer2.address.street);
        expect(customers[1].address.number).toEqual(customer2.address.number);
        expect(customers[1].address.zip).toEqual(customer2.address.zip);
        expect(customers[1].address.city).toEqual(customer2.address.city);
        expect(customers[1].isActive()).toEqual(customer2.isActive());
        expect(customers[1].rewardPoints).toEqual(customer2.rewardPoints);

    });
});
