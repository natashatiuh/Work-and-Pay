import { reviewsService } from "./reviewsService";
import { addReviewSchema } from "./schemas/addReviewSchema"; 
import { deleteReviewSchema } from "./schemas/deleteReviewSchema";
import { getUserReviewsSchema } from "./schemas/getUserReviews";
import { validation } from "../common-files/middlewares/validation";

const express = require('express');

export const router = express.Router();

router.post('/', validation(addReviewSchema), async (req, res) => {
    try{
        const { userId, mark, comment } = req.body as any
        await reviewsService.addReview(userId, mark, comment)
        res.send('The review was added!')
    } catch(error) {
        console.log(error)
        res.send(error)
    } 
})

router.delete('/', validation(deleteReviewSchema), async (req, res) => {
    try{
        const { reviewId } = req.body as any
        await reviewsService.deleteReview(reviewId)
        res.send('The review was deleted!')
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

