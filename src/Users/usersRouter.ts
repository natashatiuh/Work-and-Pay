import { usersService } from "../Users/UsersService";
import { validation } from "../common-files/middlewares/validation";
import { registrationSchema } from "./schemas/registrationSchema";
import { logInSchema } from "./schemas/logInSchema";
import { deleteUserSchema } from "./schemas/deleteUserSchema";
import { editUserSchema } from "./schemas/editUserSchema";
import { changePasswordSchema } from "./schemas/changePasswordSchema";

const express = require('express');

export const router = express.Router()

router.post('/', validation(registrationSchema), async (req, res) => {
    try{
        const {userName, yearOfBirth, country, city, password} = req.body as any
        const didCreateUser = await usersService.registerUser(userName, yearOfBirth, country, city, password);
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
        await usersService.logInUser(userName, password)
        res.send(`The user '${userName}' was authorized successfully!`)
    } catch(error) {
        console.log(error)
        res.send('Error!')
    }
} )

router.delete('/', validation(deleteUserSchema), async (req, res) => {
    try{
        const { userId, password } = req.body as any
        await usersService.deleteUser(userId, password)
        res.send(`The user was deleted!`);
    } catch(error) {
        console.log(error)
        res.send('Error!') 
    }
})

router.patch('/', validation(editUserSchema), async (req, res) => {
    try{
        const {userId, userName, yearOfBirth, country, city} = req.body as any
        await usersService.editUser(userId, userName, yearOfBirth, country, city)
        res.send(`The information about the user ${userName} was changed!`)
    } catch(error) {
        console.log(error)
        res.send('Error!')
    }
})

router.patch('/password', validation(changePasswordSchema), async (req, res) => {
    try{
        const {oldPassword, newPassword} = req.body as any
        await usersService.changePassword(oldPassword, newPassword)
        res.send('Your password was changed!')
    } catch(error) {
        console.log(error)
        res.send('Error!')
    }
})

router.get('/all', async (req, res) => {
    try{
        const users = await usersService.getUsers()
        res.send(users)
    } catch(error) {
        console.log(error)
        res.send('Error!')
    }
})






