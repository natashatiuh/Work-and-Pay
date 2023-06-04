import jwt from 'jsonwebtoken';
import { authorizationService } from '../../Authorization/authorizationService';

export const auth = () => {
    return (req, res, next) => { 
        try{
            const token = req.headers.authorization
            if(!token) throw new Error('Unauthorized!')

            const tokenInfo: any = jwt.verify(token, 'secret_key')
            const userId = tokenInfo.userId

            if (userId === undefined)
                throw new Error('Invalid token!')

            console.log('AUTH MIDDLEWARE USER ID:')
            console.log(userId)
            req.userId = userId

            next()
        } catch(error) {
            console.log(error)
            res.send('Unauthorized!')
        }
    }
}


let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODU3OTExMjZ9.BGanBm2Q1Uo2JIa22_8gNSp_5qdnliuDbx-9BqnLmfw'