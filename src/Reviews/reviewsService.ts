import { ObjectId } from "mongodb";
import { ordersRepository, reviewsRepository } from "../common-files/mongodbConnection";

class ReviewsService {
    async addReviewToExecutor(orderId: string, recipientId: string, reviewAuthorId: string, mark: number, comment: string) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

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
                    "orderRequests.executorId": new ObjectId(recipientId),
                    authorId: new ObjectId(reviewAuthorId),
                    "orderRequests.status": "ACCEPTED"
                }
            },

            {
                $project: {
                    "_id": 1,
                    "executorId": "$orderRequests.executorId"
                }
            }

        ])
        const orders = await mongo.toArray()
        console.log(orders)
        console.log(reviewAuthorId)
        if(!orders[0]) return false

        const reviews = await reviewsRepository.find({orderId: new ObjectId(orderId), recipientId: recipientId}).toArray()
        
        if(reviews.length > 0) {
            return false
        }

        const newReview = await reviewsRepository.insertOne({
            orderId: new ObjectId(orderId),
            recipientId: new ObjectId(recipientId),
            authorId: new ObjectId(reviewAuthorId),
            mark: mark,
            comment: comment,
            date: dateTime
        })
        console.log(newReview)
        
        return newReview
    }

    async addReviewToAuthor(orderId: string, recipientId: string, reviewAuthorId: string, mark: number, comment: string) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

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
                    authorId: new ObjectId(recipientId),
                    "orderRequests.executorId": new ObjectId(reviewAuthorId),
                    "orderRequests.status": "ACCEPTED"
                }
            },

            {
                $project: {
                    "-id": 1,
                    "authorId": 1,
                    "executorId": "$orderRequests.executorId"
                }
            }
        ])
        
        const orders = await mongo.toArray()

        console.log(orders)
        if(!orders[0]) return false

        const reviews = await reviewsRepository.find({orderId: orderId, recipientId: recipientId}).toArray()
        
        if(reviews.length > 0) {
            return false
        }

        const newReview = await reviewsRepository.insertOne({
            orderId: new ObjectId(orderId),
            recipientId: new ObjectId(recipientId),
            authorId: new ObjectId(reviewAuthorId),
            mark: mark,
            comment: comment,
            date: dateTime
        })
        
        return newReview 
    }

    async deleteReview(reviewId: string, reviewAuthorId: string) {
        const reviewExists = await reviewsRepository.find({_id: new ObjectId(reviewId), authorId: new ObjectId(reviewAuthorId) }).toArray()
        
        console.log(reviewExists)
        if(!reviewExists[0]) return false

        const deletedReview = await reviewsRepository.deleteOne({_id: new ObjectId(reviewId), authorId: new ObjectId(reviewAuthorId)})

        return (deletedReview.deletedCount > 0) 
    }

    async getReviews() {
        const reviews = await reviewsRepository.find().sort({ "date": -1 }).toArray()
        
        return reviews;
    }

    async getUserReviews(userId: string) {
        const userReviews = await reviewsRepository.find({recipientId: new ObjectId(userId)}).sort({"date": -1}).toArray()
        return userReviews;
    }
}

export const reviewsService = new ReviewsService