const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  entity: {
    type: String,
    required: true,
    trim: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  metadata: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', auditSchema);
