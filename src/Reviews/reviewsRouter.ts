import { reviewsService } from "./reviewsService";
import { addReviewToExecutorSchema } from "./schemas/addReviewToExecutorSchema"; 
import { deleteReviewSchema } from "./schemas/deleteExecutorReviewSchema";
import { addReviewToAuthorSchema } from "./schemas/addReviewToAuthorSchema";
import { validation } from "../common-files/middlewares/validation";
import { auth } from "../common-files/middlewares/authorization";

const express = require('express');

export const router = express.Router();

router.post('/to-executor', auth(), validation(addReviewToExecutorSchema), async (req, res) => {
    try{
        const { orderId, recipientId, mark, comment } = req.body as any
        const review = await reviewsService.addReviewToExecutor(orderId, recipientId, req.userId, mark, comment)
        if(review) {
            res.send('The review was added!')
        } else {
            res.send('The review was NOT sent!')
        } 
        
    } catch(error) {
        console.log(error)
        res.send(error)
    } 
})

router.post('/to-author', auth(), validation(addReviewToAuthorSchema), async (req, res) => {
    try{
        const { orderId, recipientId, mark, comment } = req.body as any
        const review = await reviewsService.addReviewToAuthor(orderId, recipientId, req.userId, mark, comment)
        console.log(review)
        if(review) {
            res.send('The review was added!')
        } else {
            res.send('The review was NOT sent!')
        } 
        
    } catch(error) {
        console.log(error)
        res.send(error)
    } 
})



router.delete('/', auth(), validation(deleteReviewSchema), async (req, res) => {
    try{
        const { reviewId } = req.body as any
        const review = await reviewsService.deleteReview(reviewId, req.userId)
        console.log("I need this:")
        console.log(review)
        console.log(req.userId)
        if(review) {
            res.send('The review was deleted!')
        } else {
            res.send('The review does NOT exist!')
        }
        
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})


router.get('/', async (req, res) => {
    try{
        const reviews = await reviewsService.getReviews();
        res.send(reviews)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/user-reviews', auth(), async (req, res) => {
    try{
        const userReviews = await reviewsService.getUserReviews(req.userId);
        res.send(userReviews)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

