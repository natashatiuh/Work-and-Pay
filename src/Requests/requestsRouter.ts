import { requestsService } from "./requestsService";
import { sendRequestSchema } from "./schemas/sendRequestSchema";
import { acceptRequestSchema } from "./schemas/acceptRequestSchema";
import { declineRequestSchema } from "./schemas/declineRequestSchema";
import { cancelRequestSchema } from "./schemas/cancelRequestSchema";
import { getOrderRequestsSchema } from "./schemas/getOrderRequestsSchema";
import { getUserRequestsSchema } from "./schemas/getUserRequestsSchema";
import { validation } from "../common-files/middlewares/validation"; 


const express = require('express');

export const router = express.Router()

router.post('/', validation(sendRequestSchema), async (req, res) => {
    try{
      const { orderId, executorId } = req.body as any;
      await requestsService.sendRequest(orderId, executorId);
      res.send('The request was sent!')  
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.patch('/', validation(acceptRequestSchema), async (req, res) => {
    try{
        const { requestId } = req.body as any;
        await requestsService.acceptRequest(requestId)
        res.send('The request was accepted!')
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.patch('/decline', validation(declineRequestSchema), async (req, res) => {
    try{
        const { requestId } = req.body as any;
        await requestsService.declineRequest(requestId)
        res.send('The request was declined!')
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.delete('/', validation(cancelRequestSchema), async (req, res) => {
    try{
        const { requestId } = req.body as any;
        await requestsService.cancelRequest(requestId)
        res.send('The request was cancelled!')
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/order', validation(getOrderRequestsSchema), async (req, res) => {
    try{
        const { orderId } = req.body as any;
        const orderRequests = await requestsService.getOrderRequests(orderId);
        res.send(orderRequests)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/accepted', async (req, res) => {
    try{
        const acceptedRequests = await requestsService.getAcceptedRequests();
        res.send(acceptedRequests)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/declined', async (req, res) => {
    try{
        const declinedRequests = await requestsService.getDeclinedRequests();
        res.send(declinedRequests)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/pending', async (req, res) => {
    try{
        const pendingRequests = await requestsService.getPendingRequests();
        res.send(pendingRequests)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/users', validation(getUserRequestsSchema), async (req, res) => {
    try{
        const { userId } = req.body as any
        const userRequests = await requestsService.getUserRequests(userId)
        res.send(userRequests)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
}) 


