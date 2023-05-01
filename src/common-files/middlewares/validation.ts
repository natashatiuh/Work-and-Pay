export const validation = (schema) => {
    return async (req, res, next) => {
    try {
            req.validated = await schema.validateAsync(req.body)
            next()
        } catch(error) {
            console.log(error)
            res.send('Invalid data sent!')
    }
}
}