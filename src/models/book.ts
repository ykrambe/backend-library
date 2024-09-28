/**
 * @file Book Schema
 * @copyright yusuf rambe, 2024
 * @version 1.0.0
 * @module library/src/models/book.ts
 */

import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new Book

interface BookAttrs {
  code: string;
  title: string;
  author: string;
  stock: number;
	borrowed: number;
	// status: string;

}

// An interface that describes the properties
// that a Book Document has
interface BookDoc extends BookAttrs, mongoose.Document {}

// An interface that describes the properties
// that a Book Model has
interface BookModel extends mongoose.Model<BookDoc> {
  build(attrs: BookAttrs): BookDoc;
}

// Mongoose Schema
const BookSchema = new mongoose.Schema(
  {
    code: {
      type: String,
    },
		title: {
      type: String,
    },
		author: {
      type: String,
    },
		stock: {
      type: Number,
    },
		borrowed: {
			type: Number,
			default: 0,
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
  },
	
)

BookSchema.statics.build = (attrs: BookAttrs) => {
  return new Book(attrs);
}

const Book = mongoose.model<BookDoc, BookModel>("Book", BookSchema)

export { Book };

