/**
 * @file Member Schema
 * @copyright yusuf rambe, 2024
 * @version 1.0.0
 * @module library/src/models/member.ts
 */

import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new Book

interface MemberAttrs {
  code: string;
  name: string;
  address: string;
  job: number;
  status: string;
  inactiveUntil: Date | null;
}

// An interface that describes the properties
// that a Member Document has
interface MemberDoc extends MemberAttrs, mongoose.Document {}

// An interface that describes the properties
// that a Member Model has
interface MemberModel extends mongoose.Model<MemberDoc> {
  build(attrs: MemberAttrs): MemberDoc;
}

// Mongoose Schema
const MemberSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
    },
		name: {
      type: String,
      required: true,
    },
		address: {
      type: String,
    },
		job: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
    },
    inactiveUntil: {
      type: Date,
      default: null,
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

MemberSchema.statics.build = (attrs: MemberAttrs) => {
  return new Member(attrs);
}

const Member = mongoose.model<MemberDoc, MemberModel>("Member", MemberSchema)

export { Member };

