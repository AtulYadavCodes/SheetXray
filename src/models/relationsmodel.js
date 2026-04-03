import mongoose from 'mongoose';

const relationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    relationType: {
      type: String,
      enum: ['member', 'admin', 'owner'],
      default: 'member',
    },
  },
  {
    timestamps: true,
  }
);

relationSchema.index({ user: 1, group: 1 }, { unique: true });

const Relation = mongoose.model('Relation', relationSchema);

export default Relation;