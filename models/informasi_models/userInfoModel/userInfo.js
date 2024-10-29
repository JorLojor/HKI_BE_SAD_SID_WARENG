const mongoose = require('mongoose');

const userInfo = new mongoose.Schema({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    history: [{ type: String, required: false, max: 5 }],    
    
}, { timestamp: true });

module.exports = mongoose.model('userInfo',userInfo);
