import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true
  },
  type: {
    type: String,
    required: true 
  },
  shortDescription: {
    type: String,
    required: [true, 'Please add a short description'],
    maxlength: 300
  },
  // Added detailedDescription field
  detailedDescription: {
    type: String,
    required: true
  },
  outcome: {
    type: String
  },
  duration: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date
  },
  technologies: {
    type: [String],
    required: true
  },
  teamMembers: [{
    name: String,
    role: String
  }],
  links: {
    github: {
      type: String,
      required: [true, 'GitHub link is mandatory']
    },
    live: {
      type: String,
      default: ''
    },
    documentation: {
      type: String,
      default: ''
    },
    presentation: {
      type: String,
      default: ''
    }
  },
  media: {
    screenshots: [String], 
    videoDemo: {
      type: String,
      default: ''
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Changed views to Array of ObjectIds
  views: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Project', projectSchema);