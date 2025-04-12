const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    _id: { type: Number },
    title: { type: String, required: true },
    completed: { type: Boolean, required: true },
    userId: { type: Number, required: true, ref: 'User' }
}, { toJSON: { virtuals: true } });
  
todoSchema.virtual('id').get(function() {
    return this._id.toString();
});
  
todoSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo