import Order from '../models/Order.js';

export const allOrder = async (req, res) => {

    try {
        
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).send('Access Denied. No token provided.');
        }

        const allorder = await Order.find().lean();

        res.send({
            'status': true,
            'data': allorder
        });

    } catch (error) {
        console.log(error);
        res.status(500);
    }
}