import { ordersRepository } from "../common-files/mongodbConnection";
import { ObjectId } from "mongodb";

class OrdersService {
    async addOrder(orderName: string, authorId: string, country: string, city: string, price: number) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing
        
        await ordersRepository.insertOne({
            orderName: orderName,
            authorId: new ObjectId(authorId),
            country: country,
            city: city,
            price: price,
            date: dateTime
        })
    }


    async checkUsersOrder(orderId: string, userId: string) {
        const order = await ordersRepository.find({_id: { $eq: new ObjectId(orderId) }, authorId: new ObjectId(userId)}).toArray()
        return order[0]
    }

    async editOrder(orderId: string, orderName: string, country: string, city: string, price: number) {
        await ordersRepository.updateOne({_id: { $eq: new ObjectId(orderId) }},
        {
            $set: {
                orderName: orderName,
                country: country, 
                city: city,
                price: price
            }
        })
    }

    async deleteOrder(orderId: string) {
        await ordersRepository.deleteOne({_id: { $eq: new ObjectId(orderId) }})
    }

    async getOrders() {
        const orders = await ordersRepository.find().sort({date: -1}).toArray()
        return orders;
    }

    async getUserOrders(userId: string) {
        const userOrders = await ordersRepository.find({authorId: new ObjectId(userId)}).sort({date: -1}).toArray()
        return userOrders;
    }
    
}

export const ordersService = new OrdersService()