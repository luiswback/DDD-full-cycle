import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", [])
        }).toThrowError("Id is required")
    });

    it("should throw error when customer_id is empty", () => {
        expect(() => {
            let order = new Order("1", "", [])
        }).toThrowError("CustomerId is required")
    });

    it("should throw error when item is empty", () => {
        expect(() => {
            let order = new Order("1", "123", [])
        }).toThrowError("Item quantity must be grater than 0")
    });

    it("should calculate total", () => {
        //arrange
        const item = new OrderItem("123", "Item 1", 100, 'p1', 2)
        const item2 = new OrderItem("234", "Item 2", 50, 'p2', 2)
        const order = new Order("1", "1", [item])
        //act
        let total = order.total();
        //assert
        expect(total).toBe(200);

        const order2 = new Order("1", "1", [item, item2]);
        total = order2.total();
        expect(total).toBe(300);

    });

    it("should throw error if the item quantity is less or equal zero", () => {
        expect(() => {
            const item = new OrderItem("123", "Item 1", 100, 'p1', 0)
            const order = new Order("1", "1", [item])
        }).toThrowError("Quantity must be grater than 0");

    });
});
