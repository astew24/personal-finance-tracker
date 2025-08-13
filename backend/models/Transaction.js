const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Account ID is required'],
    index: true
  },
  plaidTransactionId: {
    type: String,
    sparse: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    validate: {
      validator: function(v) {
        return v !== 0; // Amount cannot be zero
      },
      message: 'Amount cannot be zero'
    }
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'],
    uppercase: true
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['income', 'expense', 'transfer'],
    lowercase: true
  },
  category: {
    primary: {
      type: String,
      required: [true, 'Primary category is required'],
      trim: true
    },
    secondary: {
      type: String,
      trim: true
    },
    plaidCategoryId: String
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  merchant: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Merchant name cannot exceed 100 characters']
    },
    id: String,
    website: String,
    logo: String
  },
  date: {
    type: Date,
    required: [true, 'Transaction date is required'],
    default: Date.now,
    index: true
  },
  postedDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'posted', 'cancelled', 'failed'],
    default: 'pending',
    lowercase: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      lowercase: true
    },
    interval: {
      type: Number,
      default: 1,
      min: 1
    },
    nextDueDate: Date,
    endDate: Date,
    originalTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  },
  split: {
    isSplit: {
      type: Boolean,
      default: false
    },
    totalAmount: Number,
    splits: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      amount: Number,
      percentage: Number,
      description: String
    }]
  },
  location: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  metadata: {
    plaidData: mongoose.Schema.Types.Mixed,
    customFields: mongoose.Schema.Types.Mixed,
    importSource: String,
    importDate: Date
  },
  isReconciled: {
    type: Boolean,
    default: false
  },
  reconciliationDate: Date,
  isHidden: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for absolute amount
transactionSchema.virtual('absoluteAmount').get(function() {
  return Math.abs(this.amount);
});

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  const sign = this.type === 'income' ? '+' : '-';
  return `${sign}${this.currency} ${Math.abs(this.amount).toFixed(2)}`;
});

// Virtual for transaction age
transactionSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.date) / (1000 * 60 * 60 * 24));
});

// Virtual for category display
transactionSchema.virtual('categoryDisplay').get(function() {
  if (this.category.secondary) {
    return `${this.category.primary} > ${this.category.secondary}`;
  }
  return this.category.primary;
});

// Indexes for better query performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, account: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1, date: -1 });
transactionSchema.index({ user: 1, amount: 1 });
transactionSchema.index({ user: 1, merchant: 1 });
transactionSchema.index({ plaidTransactionId: 1 }, { sparse: true });

// Pre-save middleware to set posted date if not provided
transactionSchema.pre('save', function(next) {
  if (this.status === 'posted' && !this.postedDate) {
    this.postedDate = new Date();
  }
  next();
});

// Pre-save middleware to validate amount based on type
transactionSchema.pre('save', function(next) {
  if (this.type === 'income' && this.amount < 0) {
    this.amount = Math.abs(this.amount);
  } else if (this.type === 'expense' && this.amount > 0) {
    this.amount = -Math.abs(this.amount);
  }
  next();
});

// Static method to find transactions by user and date range
transactionSchema.statics.findByUserAndDateRange = function(userId, startDate, endDate) {
  return this.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });
};

// Static method to find transactions by category
transactionSchema.statics.findByCategory = function(userId, category, limit = 50) {
  return this.find({
    user: userId,
    'category.primary': category
  }).sort({ date: -1 }).limit(limit);
};

// Static method to get spending summary by category
transactionSchema.statics.getSpendingByCategory = function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        type: 'expense',
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$category.primary',
        totalAmount: { $sum: { $abs: '$amount' } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);
};

// Static method to get monthly spending trends
transactionSchema.statics.getMonthlyTrends = function(userId, months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type'
        },
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
};

// Instance method to duplicate transaction
transactionSchema.methods.duplicate = function() {
  const duplicate = new this.constructor(this.toObject());
  duplicate._id = undefined;
  duplicate.date = new Date();
  duplicate.status = 'pending';
  duplicate.description = `Copy of ${this.description}`;
  duplicate.attachments = [];
  duplicate.notes = '';
  duplicate.isReconciled = false;
  duplicate.reconciliationDate = undefined;
  return duplicate;
};

// Instance method to mark as reconciled
transactionSchema.methods.markReconciled = function() {
  this.isReconciled = true;
  this.reconciliationDate = new Date();
  return this.save();
};

// Instance method to add tag
transactionSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag.toLowerCase())) {
    this.tags.push(tag.toLowerCase());
  }
  return this.save();
};

// Instance method to remove tag
transactionSchema.methods.removeTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag.toLowerCase());
  return this.save();
};

module.exports = mongoose.model('Transaction', transactionSchema);
