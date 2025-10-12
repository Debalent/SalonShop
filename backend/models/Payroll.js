const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employee is required']
  },
  payPeriod: {
    startDate: {
      type: Date,
      required: [true, 'Pay period start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'Pay period end date is required']
    }
  },
  hoursWorked: {
    type: Number,
    required: [true, 'Hours worked is required'],
    min: [0, 'Hours worked cannot be negative']
  },
  regularHours: {
    type: Number,
    default: 0
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [0, 'Hourly rate cannot be negative']
  },
  grossPay: {
    type: Number,
    required: [true, 'Gross pay is required'],
    min: [0, 'Gross pay cannot be negative']
  },
  commissionEarnings: {
    type: Number,
    default: 0
  },
  tipEarnings: {
    type: Number,
    default: 0
  },
  bonuses: [{
    amount: Number,
    description: String,
    date: Date
  }],
  deductions: [{
    type: {
      type: String,
      enum: ['tax', 'insurance', 'retirement', 'uniform', 'other'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String
  }],
  taxes: {
    federal: {
      type: Number,
      default: 0
    },
    state: {
      type: Number,
      default: 0
    },
    local: {
      type: Number,
      default: 0
    },
    socialSecurity: {
      type: Number,
      default: 0
    },
    medicare: {
      type: Number,
      default: 0
    },
    unemployment: {
      type: Number,
      default: 0
    }
  },
  netPay: {
    type: Number,
    required: [true, 'Net pay is required']
  },
  paymentMethod: {
    type: String,
    enum: ['direct_deposit', 'check', 'cash', 'digital_wallet'],
    default: 'direct_deposit'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processed', 'paid', 'failed'],
    default: 'pending'
  },
  paymentDate: Date,
  paystubGenerated: {
    type: Boolean,
    default: false
  },
  paystubUrl: String,
  notes: String,
  adjustments: [{
    type: {
      type: String,
      enum: ['bonus', 'deduction', 'correction'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
payrollSchema.index({ employee: 1, 'payPeriod.startDate': 1, 'payPeriod.endDate': 1 });
payrollSchema.index({ paymentStatus: 1 });
payrollSchema.index({ 'payPeriod.endDate': -1 });

// Pre-save middleware to calculate totals
payrollSchema.pre('save', function(next) {
  // Calculate gross pay
  this.grossPay = (this.regularHours * this.hourlyRate) + 
                  (this.overtimeHours * this.hourlyRate * 1.5) +
                  this.commissionEarnings +
                  this.tipEarnings;
  
  // Add bonuses
  const totalBonuses = this.bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
  this.grossPay += totalBonuses;
  
  // Calculate total deductions
  const totalDeductions = this.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  
  // Calculate total taxes
  const totalTaxes = Object.values(this.taxes).reduce((sum, tax) => sum + tax, 0);
  
  // Calculate net pay
  this.netPay = this.grossPay - totalDeductions - totalTaxes;
  
  this.updatedAt = Date.now();
  next();
});

// Virtual for total tax amount
payrollSchema.virtual('totalTaxes').get(function() {
  return Object.values(this.taxes).reduce((sum, tax) => sum + tax, 0);
});

// Virtual for total deductions
payrollSchema.virtual('totalDeductions').get(function() {
  return this.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
});

// Method to generate paystub
payrollSchema.methods.generatePaystub = async function() {
  // Implementation for generating paystub PDF
  // This would integrate with a PDF generation service
  this.paystubGenerated = true;
  this.paystubUrl = `/paystubs/${this._id}.pdf`;
  await this.save();
  return this.paystubUrl;
};

// Static method to calculate payroll for employee
payrollSchema.statics.calculatePayrollForPeriod = async function(employeeId, startDate, endDate) {
  const User = mongoose.model('User');
  const Booking = mongoose.model('Booking');
  const Tip = mongoose.model('Tip');
  
  const employee = await User.findById(employeeId);
  if (!employee || !employee.staffInfo) {
    throw new Error('Employee not found or not a staff member');
  }
  
  // Calculate hours worked from bookings
  const bookings = await Booking.find({
    staff: employeeId,
    appointmentDate: { $gte: startDate, $lte: endDate },
    status: 'completed'
  });
  
  // Calculate total hours and commission
  let totalHours = 0;
  let commissionEarnings = 0;
  
  bookings.forEach(booking => {
    const duration = booking.totalDuration || 60; // Default 60 minutes
    totalHours += duration / 60; // Convert to hours
    
    if (employee.staffInfo.commissionRate) {
      commissionEarnings += booking.finalAmount * (employee.staffInfo.commissionRate / 100);
    }
  });
  
  // Calculate tips
  const tips = await Tip.find({
    recipient: employeeId,
    createdAt: { $gte: startDate, $lte: endDate },
    status: 'distributed'
  });
  
  const tipEarnings = tips.reduce((sum, tip) => sum + tip.amount, 0);
  
  // Determine regular vs overtime hours (assuming 40 hour work week)
  const regularHours = Math.min(totalHours, 40);
  const overtimeHours = Math.max(totalHours - 40, 0);
  
  return {
    hoursWorked: totalHours,
    regularHours,
    overtimeHours,
    hourlyRate: employee.staffInfo.hourlyRate,
    commissionEarnings,
    tipEarnings
  };
};

// Ensure virtual fields are serialized
payrollSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Payroll', payrollSchema);