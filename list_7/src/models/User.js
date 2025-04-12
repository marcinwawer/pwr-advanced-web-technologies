const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    email: { type: String, required: true },
    login: { type: String, required: true }
}, { toJSON: { virtuals: true } });
  
userSchema.virtual('id').get(function() {
    return this._id.toString();
});
  
userSchema.virtual('todos', {
    ref: 'Todo',
    localField: '_id',
    foreignField: 'userId'
});

const User = mongoose.model('User', userSchema);
module.exports = User