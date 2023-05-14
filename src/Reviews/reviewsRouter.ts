import { reviewsService } from "./reviewsService";
import { addReviewToExecutorSchema } from "./schemas/addReviewToExecutorSchema"; 
import { deleteAuthorsReviewSchema } from "./schemas/deleteAuthorsReviewSchema";
import { deleteExecutorsReviewSchema } from "./schemas/deleteExecutorReviewSchema";
import { getUserReviewsSchema } from "./schemas/getUserReviews";
import { addReviewToAuthorSchema } from "./schemas/addReviewToAuthorSchema";
import { validation } from "../common-files/middlewares/validation";
import { auth } from "../common-files/middlewares/authorization";

const express = require('express');

export const router = express.Router();

router.post('/to-executor', auth(), validation(addReviewToExecutorSchema), async (req, res) => {
    try{
        const { orderId, executorId, mark, comment } = req.body as any
        const review = await reviewsService.addReviewToExecutor(req.userId, orderId, executorId, mark, comment)
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
        const { orderId, authorsId, mark, comment } = req.body as any
        const review = await reviewsService.addReviewToAuthor(req.userId, orderId, authorsId, mark, comment)
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



router.delete('/author', auth(), validation(deleteAuthorsReviewSchema), async (req, res) => {
    try{
        const { reviewId } = req.body as any
        const review = await reviewsService.deleteAuthorsReview(reviewId, req.userId)
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

router.delete('/executor', auth(), validation(deleteExecutorsReviewSchema), async (req, res) => {
    try{
        const { reviewId } = req.body as any
        const review = await reviewsService.deleteExecutorsReview(reviewId, req.userId)
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

router.get('/user-reviews', validation(getUserReviewsSchema), async (req, res) => {
    try{
        const { userId } = req.body as any
        const userReviews = await reviewsService.getUserReviews(userId);
        res.send(userReviews)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

