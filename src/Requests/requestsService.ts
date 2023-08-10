import { requestsRepository } from "../common-files/mongodbConnection";
import { ordersRepository } from "../common-files/mongodbConnection";
import { ObjectId } from "mongodb";

class RequestsService {
    async checkOrder(orderId: string) {
        const trueOrder = await ordersRepository.find({_id: { $eq: new ObjectId(orderId) }}).toArray()
        console.log(trueOrder[0])
        if (trueOrder[0]) return true
    }

    async sendRequest(orderId: string, executorId: string) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

        const order = await ordersRepository.find({_id: { $eq: new ObjectId(orderId) }}).toArray()

        console.log('This is one:')
        console.log(order)
        console.log(executorId)
        if (order[0].authorId === executorId) {
            return false
        }

        const request = await requestsRepository.find({executorId: new ObjectId(executorId), orderId: new ObjectId(orderId)}).toArray()
        
        console.log('This is two:')
        console.log(request)
        if(request.length > 0) return false
        
        const newRequest = await requestsRepository.insertOne({
            orderId: new ObjectId(orderId),
            executorId: new ObjectId(executorId),
            status: "PENDING",
            date: dateTime
        })
        
        console.log('This is three:')
        console.log(newRequest);
        return newRequest
    }

    async checkUserRequest(requestId: string, userId: string) {
        const mongo = await ordersRepository.aggregate([
            {
                $lookup: {
                    from: 'requests',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderRequests'
                }
            },
            {
                $unwind: '$orderRequests'
            },
            {
                $match: {
                    authorId: new ObjectId(userId),
                    'orderRequests._id': new ObjectId(requestId)
                }
            },
            {
                $project: {
                    "_id": 1,
                    "authorId": 1,
                    "requestId": "$orderRequests._id"
                }
            }
        ])

        const documents = await mongo.toArray()
        console.log('docs', documents)

        return documents[0] != undefined
    }

    async acceptRequest(requestId: string) {
        const status = await requestsRepository.updateOne({_id: { $eq: new ObjectId(requestId) }, status: "PENDING" || "DECLINED"}, {
            $set: {
                status: "ACCEPTED"
            }
        })
        
        return (status.modifiedCount > 0)
    }

    async declineRequest(requestId: string) {
        const declinedRequest = await requestsRepository.updateOne({_id: { $eq: new ObjectId(requestId) }}, {
            $set: {
                status: "DECLINED"
            }
        })
        
        return (declinedRequest.modifiedCount > 0)
    }

    async cancelRequest(requestId: string, executorId: string) {
        const cancelledRequest = await requestsRepository.deleteOne({_id: { $eq: new ObjectId(requestId)}, executorId: new ObjectId(executorId), status: "ACCEPTED" || "PENDING" })
        return cancelledRequest.deletedCount > 0
    }

    async getOrderRequests(orderId: string, userId: string) {
        const mongo = await ordersRepository.aggregate([
            {
                $lookup: {
                    from: "requests",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderRequests"
                }
            }, 

            {
                $unwind: "$orderRequests"
            },

            {
                $match: {
                    _id: new ObjectId(orderId),
                    authorId: new ObjectId(userId)
                }
            },

            {
                $sort: { "date": -1 }
            },

            {
                $project: {
                    "_id": 1,
                    "orderName": 1,
                    "requestId": "$orderRequests._id",
                    "executorId": "$orderRequests.executorId",
                    "status": "$orderRequests.status",
                }
            }
        ])

        const orderRequests = await mongo.toArray()
        console.log(orderRequests)
        return orderRequests;
    }

    async getAcceptedRequests(userId: string) {
        const mongo = await ordersRepository.aggregate([
            {
                $lookup: {
                    from: 'requests',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderRequests'
                }
            },

            {
                $unwind: "$orderRequests"
            },

            {
                $match: {
                    authorId: new ObjectId(userId),
                    'orderRequests.status': "ACCEPTED"
                }
            },

            {
                $sort: {"date": -1}
            },
            {
                $project: {
                    "_id": 1,
                    "orderName": 1,
                    "requestId": "$orderRequests._id",
                    "executorId": "$orderRequests.executorId",
                    "status": "$orderRequests.status"
                }
            }
        ])

        const acceptedRequests = await mongo.toArray()
        
        return acceptedRequests;
    }

    async getDeclinedRequests(userId: string) {
        const mongo = await ordersRepository.aggregate([
            {
                $lookup: {
                    from: "requests",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderRequests"
                }
            },

            {
                $unwind: "$orderRequests"
            },

            {
                $match: {
                    authorId: new ObjectId(userId),
                    "orderRequests.status": "DECLINED"
                }
            },

            {
                $sort: { "date": -1 }
            },

            {
                $project: {
                    "_id": 1, 
                    "orderName": 1,
                    "requestId": "$orderRequests._id",
                    "executorId": "$orderRequests.executorId",
                    "status": "$orderRequests.status"
                }
            }
        ])
        
        const declinedRequests = await mongo.toArray()
        return declinedRequests;
    }

    async getPendingRequests(userId: string) {
        const mongo = await ordersRepository.aggregate([
            {
                $lookup: {
                    from: "requests",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderRequests"
                }
            },

            {
                $unwind: "$orderRequests"
            },

            {
                $match: {
                    authorId: new ObjectId(userId),
                    "orderRequests.status": "PENDING", 
                }
            },

            {
                $sort: { "date": -1 }
            },

            {
                $project: {
                    "_id": 1,
                    "orderName": 1,
                    "requestId": "$orderRequests._id",
                    "executorId": "$orderRequests.executorId",
                    "status": "$orderRequests.status"
                }
            }
        ])

        const pendingRequests = await mongo.toArray()
        return pendingRequests;
    }

    async getUserRequests(userId: string) {
        const mongo = await ordersRepository.aggregate([
            {
                $lookup: {
                    from: "requests",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderRequests"
                }
            },

            {
                $unwind: "$orderRequests"
            },

            {
                $match: {
                    authorId: new ObjectId(userId)
                }
            },

            {
                $sort: { "date": -1 }
            },

            {
                $project: {
                    "_id": 1,
                    "orderName": 1,
                    "requestId": "$orderRequests._id",
                    "executorId": "$orderRequests.executorId",
                    "status": "$orderRequests.status"
                }
            }
        ])
        
        const userRequests = await mongo.toArray()
        return userRequests;
    }
}

export const requestsService = new RequestsService();