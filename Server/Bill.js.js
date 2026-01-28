const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['electricity', 'water', 'internet', 'phone', 'credit', 'loan', 'insurance', 'other'],
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  amountDue: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'scheduled'],
    default: 'pending'
  },
  paymentDate: Date,
  frequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'annually', 'one-time'],
    default: 'monthly'
  },
  autoPay: {
    type: Boolean,
    default: false
  },
  reference: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bill', BillSchema);