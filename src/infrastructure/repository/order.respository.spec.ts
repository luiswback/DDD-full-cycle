import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../database/sequelize/model/customer.model";
import OrderModel from "../database/sequelize/model/order.model";
import ProductModel from "../database/sequelize/model/product.model";
import OrderItemModel from "../database/sequelize/model/order-item.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";
import EventDispatcher from "../../domain/event/@shared/event-dispatcher";

describe("Order repository test", () => {
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

    it('should create a new order', async () => {
        const eventDispatcher = new EventDispatcher();

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", 'customer 1', eventDispatcher);
        customer.address = new Address('rua 1', 1, 'zip 1', 'city 1');
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });

    it('should update an order', async () => {
        const eventDispatcher = new EventDispatcher();

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", 'customer 1', eventDispatcher);
        customer.address = new Address('rua 1', 1, 'zip 1', 'city 1');
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const updatedOrderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            3// quantidade alterada
        );

        const updatedOrder = new Order("123", "123", [updatedOrderItem]);
        await orderRepository.update(updatedOrder);

        const orderModel = await OrderModel.findOne({
            where: { id: updatedOrder.id },
            include: ["items"],
        });

        const expectedResult = {
            id: "123",
            customer_id: "123",
            items: {
                id: updatedOrderItem.id,
                name: updatedOrderItem.name,
                price: updatedOrderItem.price,
                quantity: updatedOrderItem.quantity,
                order_id: "123",
                product_id: "123",
            },
        };

        const orderJson = orderModel.toJSON();
        const formattedResult = {
            id: orderJson.id,
            customer_id: orderJson.customer_id,
            items: orderJson.items[0]
        };

        expect(formattedResult).toStrictEqual(expectedResult);
    });

    it('should find a order', async () => {
        const eventDispatcher = new EventDispatcher();

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", 'customer 1', eventDispatcher);
        customer.address = new Address('rua 1', 1, 'zip 1', 'city 1');
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order)



        const foundOrder = await orderRepository.find("123");

        expect(foundOrder).toStrictEqual(order)
    });

    it('should find all orders', async () => {
        const customerRepository = new CustomerRepository();
        const eventDispatcher = new EventDispatcher();
        const customer1 = new Customer("123", 'customer 1', eventDispatcher);
        customer1.address = new Address('rua 1', 1, 'zip 1', 'city 1');
        await customerRepository.create(customer1);

        const customer2 = new Customer("321", 'customer 2', eventDispatcher);
        customer2.address = new Address('rua 2', 2, 'zip 2', 'city 2');
        await customerRepository.create(customer2);

        const productRepository = new ProductRepository();
        const product1 = new Product('123', 'product 1', 10);
        await productRepository.create(product1);

        const product2 = new Product('321', 'product 2', 20);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem(
            "1",
            product1.name,
            product1.price,
            product1.id,
            2
        );

        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            4
        );

        const order1 = new Order("123", customer1.id, [orderItem1]);
        const order2 = new Order("321", customer2.id, [orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const foundAllOrders = await orderRepository.findAll();

        expect(foundAllOrders).toHaveLength(2);
        expect(foundAllOrders).toContainEqual(order1);
        expect(foundAllOrders).toContainEqual(order2);
    });
});
