import { DataSource } from 'typeorm'
import { User } from './User';
import { Order } from './Order';
import { Request } from './Request';
import { Review } from './Review';

export const connection = new DataSource({
    type: 'mysql',
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "kabanchik",
    synchronize: true,
    logging: true,
    entities: [User, Request, Review, Order],
})

export const orderRepository = connection.getRepository(Order)
export const userRepository = connection.getRepository(User)
export const reviewRepository = connection.getRepository(Review)
export const requestRepository = connection.getRepository(Request)
