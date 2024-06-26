import OrderRepository from "../../infrastructure/repository/order.repository";
import RepositoryInterface from "./repository-interface";

export default interface OrderRepositoryInterface extends RepositoryInterface<OrderRepository> {
}
