const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['transfer', 'payment', 'deposit', 'withdrawal', 'fee', 'interest', 'other'],
    default: 'other'
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  date: {
    type: Date,
    default: Date.now
  },
  runningBalance: {
    type: Number,
    required: true
  },
  notes: String,
  metadata: {
    sourceAccount: String,
    destinationAccount: String,
    billId: mongoose.Schema.Types.ObjectId,
    paymentMethod: String
  }
});

// Generate reference before saving
TransactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.reference = `TX${timestamp}${random}`.slice(0, 20);
  }
  next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);