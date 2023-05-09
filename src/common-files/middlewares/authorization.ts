import jwt from 'jsonwebtoken';
import { authorizationService } from '../../Authorization/authorizationService';

export const auth = () => {
    return (req, res, next) => { 
        try{
            const token = req.headers.authorization
            if(!token) throw new Error('Unauthorized!')

            const tokenInfo: any = jwt.verify(token, 'secret_key')
            const userId = tokenInfo.userId
            console.log(tokenInfo)

            req.userId = userId
            
        } catch(error) {
            console.log(error)
            res.send('Unauthorized!')
        }
        next()
        
    }
}