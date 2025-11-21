/**
 * Article Model (Mongoose Schema)
 * 
 * This file defines the database schema for articles/tasks.
 * 
 * TODO: Students should implement:
 * 1. Create Mongoose schema with required fields:
 *    - url (String, required, unique)
 *    - title (String, optional)
 *    - summary (String, optional)
 *    - content (String, optional)
 *    - status (String: pending/completed/failed)
 *    - taskId (String, references Celery task ID)
 *    - userId (ObjectId, reference to User)
 *    - createdAt (Date, auto)
 *    - updatedAt (Date, auto)
 *    - error (String, optional, for failed tasks)
 * 
 * 2. Add indexes for common queries
 * 3. Add methods for status updates
 * 4. Add validation
 */

// TODO: Uncomment when ready to implement
// import mongoose from 'mongoose';

// const articleSchema = new mongoose.Schema({
//   // TODO: Define all fields with appropriate types and validation
//   // url: { type: String, required: true, unique: true },
//   // title: String,
//   // summary: String,
//   // content: String,
//   // status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
//   // taskId: String,
//   // userId: mongoose.Schema.Types.ObjectId,
//   // createdAt: { type: Date, default: Date.now },
//   // updatedAt: { type: Date, default: Date.now },
//   // error: String
// }, { timestamps: true });

// TODO: Add indexes for better query performance
// articleSchema.index({ userId: 1, createdAt: -1 });
// articleSchema.index({ status: 1 });
// articleSchema.index({ url: 1 });

// TODO: Add methods for common operations
// Example:
// articleSchema.methods.markAsCompleted = function(title, summary, content) {
//   this.status = 'completed';
//   this.title = title;
//   this.summary = summary;
//   this.content = content;
//   return this.save();
// };

// articleSchema.methods.markAsError = function(error) {
//   this.status = 'failed';
//   this.error = error;
//   return this.save();
// };

// const Article = mongoose.model('Article', articleSchema);
// export default Article;

console.log('Article model - implement the schema and methods above');
