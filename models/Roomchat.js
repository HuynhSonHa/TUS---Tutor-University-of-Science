const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoomChatScheme = new Schema({
    OrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order' // Tham chiếu đến user mà đặt hàng 
    },
    StudentMessage: {
        type: Array,
       
    },
    TutorMessage: {
        type: Array,
       
    },
    message: {
        type: Array,
        default: ''
    },
   
    
    
});


module.exports = mongoose.model('RoomChat', RoomChatScheme);