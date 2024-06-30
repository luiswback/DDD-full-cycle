import Order from "../../domain/entity/order";
import OrderModel from "../database/sequelize/model/order.model";
import OrderItemModel from "../database/sequelize/model/order-item.model";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [({model: OrderItemModel})]
            });
    }

    async update(order: Order): Promise<void> {
        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"]
        })

        if (!orderModel) {
            throw new Error("Order not found")
        }

        orderModel.customer_id = order.customerId;

        for (const item of orderModel.items) {
            await item.destroy();
        }

        const updatedItems = order.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: order.id
        }));

        await OrderItemModel.bulkCreate(updatedItems);
        await orderModel.save();

    }

    async find(id: string): Promise<Order> {

        const orderModel = await OrderModel.findOne({
            where: {id: id},
            include: ["items"]
        },);
        const items = orderModel.items.map(item => new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
        ));

        return new Order(orderModel.id, orderModel.customer_id, items)
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({
            include: ["items"]
        });

        const orders = orderModels.map(orderModel => {
            const items = orderModel.items.map(item => new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
            ));
            return new Order(orderModel.id, orderModel.customer_id, items);
        });

        return orders;
    }


}
