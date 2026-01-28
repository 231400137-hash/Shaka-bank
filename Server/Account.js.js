const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['checking', 'savings', 'credit', 'loan', 'investment'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  availableBalance: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  interestRate: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'frozen', 'closed'],
    default: 'active'
  },
  lastStatementBalance: {
    type: Number,
    default: 0
  },
  lastStatementDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate account number before saving
AccountSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastAccount = await this.constructor.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    const lastNumber = lastAccount ? parseInt(lastAccount.accountNumber) : 1000000000;
    this.accountNumber = (lastNumber + 1).toString().padStart(10, '0');
  }
  next();
});

module.exports = mongoose.model('Account', AccountSchema);