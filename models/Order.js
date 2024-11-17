import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    customer_id: {
        type:String
    },
    total_price: {
        type:Number 
    },
    total_quantity: {
        type:Number 
    },
    createAt: {
        type: String,
        default: Date.now()
    }

});

const Order = mongoose.model('Sales', OrderSchema);

export default Order;