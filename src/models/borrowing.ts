/**
 * @file Borrowing Schema
 * @copyright yusuf rambe, 2024
 * @version 1.0.0
 * @module library/src/models/borrowing.ts
 */

import mongoose, { Date } from "mongoose";

// An interface that describes the properties
// that are required to create a new Borrowing

interface BorrowingAttrs {
  member: any;
  books: any;
  borrowDate: Date;
  returnDate: Date | null;
	status: string;
}

// An interface that describes the properties
// that a Borrowing Document has
interface BorrowingDoc extends BorrowingAttrs, mongoose.Document {}

// An interface that describes the properties
// that a Borrowing Model has
interface BorrowingModel extends mongoose.Model<BorrowingDoc> {
  build(attrs: BorrowingAttrs): BorrowingDoc;
}

// Mongoose Schema
const BorrowingSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
    },
    books: [
      {
        bookID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
        code: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["Borrowed", "Returned"],
        }
      },
    ],
		borrowDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Process", "Done"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
)

BorrowingSchema.statics.build = (attrs: BorrowingAttrs) => {
  return new Borrowing(attrs);
}

const Borrowing = mongoose.model<BorrowingDoc, BorrowingModel>("Borrowing", BorrowingSchema)

export { Borrowing };

