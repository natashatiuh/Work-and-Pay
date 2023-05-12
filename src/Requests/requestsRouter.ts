import { requestsService } from "./requestsService";
import { sendRequestSchema } from "./schemas/sendRequestSchema";
import { acceptRequestSchema } from "./schemas/acceptRequestSchema";
import { declineRequestSchema } from "./schemas/declineRequestSchema";
import { cancelRequestSchema } from "./schemas/cancelRequestSchema";
import { getOrderRequestsSchema } from "./schemas/getOrderRequestsSchema";
import { validation } from "../common-files/middlewares/validation";
import { auth } from "../common-files/middlewares/authorization"; 


const express = require('express');

export const router = express.Router()

router.post('/', auth(), validation(sendRequestSchema), async (req, res) => {
    try{
      const { orderId } = req.body as any;
      const isTrueOrder = await requestsService.checkOrder(orderId)
      if (isTrueOrder === true) {
        await requestsService.sendRequest(orderId, req.userId);
        res.send('The request was sent!')
      } else {
        res.send('The order does NOT exist!')
      }
        
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.patch('/', auth(), validation(acceptRequestSchema), async (req, res) => {
    try{
        const { requestId } = req.body as any;
        const isTrueRequest = await requestsService.checkUserRequest(requestId, req.userId)
        if (isTrueRequest === true) {
           await requestsService.acceptRequest(requestId)
           res.send(`The request was accepted!`)
        } else {
            res.send(`The request does NOT exist!`)
        }

    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.patch('/decline', auth(), validation(declineRequestSchema), async (req, res) => {
    try{
        const { requestId } = req.body as any;
        const isTrueRequest = await requestsService.checkUserRequest(requestId, req.userId)
        if(isTrueRequest === true) {
            await requestsService.declineRequest(requestId)
            res.send('The request was declined!')
        } else {
            res.send(`The request does NOT exist!`)
        }
        
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.delete('/', auth(), validation(cancelRequestSchema), async (req, res) => {
    try{
        const { requestId } = req.body as any;
        const isTrueRequest = await requestsService.checkUserRequest(requestId, req.userId)
        if(isTrueRequest === true) {
            await requestsService.cancelRequest(requestId)
            res.send('The request was cancelled!')
        } else {
            res.send('The request does NOT exist!')
        }
        
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/order', auth(),  validation(getOrderRequestsSchema), async (req, res) => {
    try{
        const { orderId } = req.body as any;
        const isTrueOrder = await requestsService.checkOrder(orderId)
        if(isTrueOrder === true) {
            const orderRequests = await requestsService.getOrderRequests(orderId);
            res.send(orderRequests)
        } else {
            res.send('This order does NOT have any requests!')
        }
        
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/accepted', auth(), async (req, res) => {
    try{
        const acceptedRequests = await requestsService.getAcceptedRequests(req.userId);
        res.send(acceptedRequests)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/declined', auth(), async (req, res) => {
    try{
        const declinedRequests = await requestsService.getDeclinedRequests(req.userId);
        res.send(declinedRequests)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/pending', auth(), async (req, res) => {
    try{
        const pendingRequests = await requestsService.getPendingRequests(req.userId);
        res.send(pendingRequests)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/users', auth(), async (req, res) => {
    try{
        const userRequests = await requestsService.getUserRequests(req.userId)
        res.send(userRequests)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
}) 


