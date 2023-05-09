import { authorizationService } from "./authorizationService";
import { validation } from "../common-files/middlewares/validation";
import { registrationSchema } from "./schemas/registrationSchema";
import { logInSchema } from "./schemas/logInSchema";
import { deleteUserSchema } from "./schemas/deleteUserSchema";
import { editUserSchema } from "./schemas/editUserSchema";
import { changePasswordSchema } from "./schemas/changePasswordSchema";
import { auth } from "../common-files/middlewares/authorization";

const express = require('express');

export const router = express.Router()

router.post('/', validation(registrationSchema), async (req, res) => {
    try{
        const {userName, yearOfBirth, country, city, password} = req.body as any
        const didCreateUser = await authorizationService.registerUser(userName, yearOfBirth, country, city, password);
        if (didCreateUser === true) {
           res.send('The user was registrated!') 
        } else {
            res.send('Only adults are allowed!')
        }
    } catch(error) {
        console.log(error)
        res.send(error)
    }
}) 

router.get('/', validation(logInSchema), async (req, res) => {
    try{
        const {userName, password} = req.body as any
        const token = await authorizationService.logInUser(userName, password)
        if (token) {
            res.send(`The user '${userName}' was authorized successfully! Token is ${token}`)
        } else {
            res.send(`The user does NOT exist!`)
        }
    } catch(error) {
        console.log(error)
        res.send('Error!')
    }
} )

router.delete('/', auth(), validation(deleteUserSchema), async (req, res) => {
    try{
        const { password } = req.body as any
        const user = await authorizationService.deleteUser(req.userId, password)
        if(user === true) {
            res.send(`The user was deleted!`);
        } else {
            res.send(`The user does NOT exist!`);
        }
        
    } catch(error) {
        console.log(error)
        res.send('Error!') 
    }
})

router.patch('/', auth(), validation(editUserSchema), async (req, res) => {
    try{
        const {userName, yearOfBirth, country, city} = req.body as any
        await authorizationService.editUser(req.userId, userName, yearOfBirth, country, city)
        res.send(`The information about the user ${userName} was changed!`)
    } catch(error) {
        console.log(error)
        res.send('Error!')
    }
})

router.patch('/password', auth(), validation(changePasswordSchema), async (req, res) => {
    try{
        const {oldPassword, newPassword} = req.body as any
        const isTrueUser = await authorizationService.checkUser(req.userId)
        if(isTrueUser) {
            const password = await authorizationService.changePassword(oldPassword, newPassword)

            if(password === true) {
                res.send('Your password was changed!')
            } else {
                res.send('Your old password is NOT correct!')
            }

        } else {
            res.send('You are NOT the true user!')
        }
        
    } catch(error) {
        console.log(error)
        res.send('Error!')
    }
})

router.get('/all', async (req, res) => {
    try{
        const users = await authorizationService.getUsers()
        res.send(users)
    } catch(error) {
        console.log(error)
        res.send('Error!')
    }
})






