import { connection } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from 'uuid';
import { orderRepository } from "../common-files/mysqlConnection";
import { requestRepository } from "../common-files/mysqlConnection";
import { In, Not } from "typeorm";

class RequestsService {
    async checkOrder(orderId: string) {
        const order = await orderRepository.findOne({
            where: {id: orderId}
        })
        console.log(order)
        if (order) {
            return true
        } else {
            return false
        }
    }

    async checkOrderAuthor(executorId: string) {
        const isNotAuthor = await orderRepository.find({
            relations: {
                requests: true
            },
            where: {
                authorId: Not(executorId),
                requests: { executorId }
            }
        })
        console.log(isNotAuthor)
        if(isNotAuthor[0]) {
            return true
        } else {
            return false
        }
    }

    async sendRequest(orderId: string, executorId: string) {
        const order = await orderRepository.findOne({
            select: {authorId: true},
            where: {id: orderId}
        })
        console.log(order)
        console.log(executorId)
        if (order.authorId === executorId) return false

        const requests = await requestRepository.find({
            select: {executorId: true},
            where: {executorId, orderId}
        })
        console.log(requests)
        if (requests.length > 0) return false

        console.log(executorId)
        
        const rows = await requestRepository.insert({
            id: v4(),
            orderId: orderId,
            executorId: executorId,
            status: "PENDING",
            date: new Date()
        })
        
        console.log(rows);
        if(rows.raw.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }


    async checkUserRequest(requestId: string, userId: string) {
        const result = await orderRepository.find({
            relations: {
                requests: true
            },
            where: {
                authorId: userId,
                requests: { id: requestId }
            }
        })

        if(result[0]) {
            return true
        } else {
            return false
        }
    }
    
    async acceptRequest(requestId: string) {
        const result = await requestRepository.update(
            { id: requestId, status: In(["PENDING", "DECLINED"]) },
            { status: "ACCEPTED" }
        )

        return (result.affected > 0)
    }

    async declineRequest(requestId: string) {
        await requestRepository.update(
            {id: requestId}, 
            {status: "DECLINED"}
        )
    }

    async cancelRequest(requestId: string, executorId: string) {
        const request = await requestRepository.delete({ id: requestId, executorId, status: In(["ACCEPTED", "PENDING"]) })
        return (request.affected > 0)
    }

    async getOrderRequests(orderId: string, userId: string) {
        const result = await orderRepository.find({
            relations: {
                requests: true
            },
            where: {
                id: orderId,
                authorId: userId
            },
            order: {dateOfPublishing: 'DESC'}
        })

        console.log(result)
        return result;
    }

    async getAcceptedRequests(userId: string) {
        const result = await orderRepository.find({
            relations: {
                requests: true
            },
            where: {
                authorId: userId,
                requests: { status: "ACCEPTED" }
            },
            order: {
                dateOfPublishing: "DESC"
            }
        })

        return result;
    }

    async getDeclinedRequests(userId: string) {
        const result = await orderRepository.find({
            relations: {
                requests: true
            },
            where: {
                authorId: userId,
                requests: { status: "DECLINED" }
            },
            order: {
                dateOfPublishing: "DESC"
            }
        })
        return result;
    }

    async getPendingRequests(userId: string) {
        const result = await orderRepository.find({
            relations: {
                requests: true
            },
            where: {
                authorId: userId,
                requests: { status: "PENDING" }
            },
            order: {
                dateOfPublishing: "DESC"
            }
        })
        return result;
    }

    async getUserRequests(userId: string) {
        const result = await orderRepository.find({
            relations: {
                requests: true
            },
            where: {
                authorId: userId,
            },
            order: {
                dateOfPublishing: "DESC"
            }
        })
        return result;
    }
}

export const requestsService = new RequestsService();