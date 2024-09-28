import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Book } from "../../models/book";

const router = express.Router();

router.get('/api/books', async (req: Request, res:Response) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	const books = await Book.aggregate([
		{ $sort: { title: 1 } }, // Sort by title
		{ $skip: skip }, // Skip for pagination
		{ $limit: limit } // limit result
]);

const totalBooks = await Book.countDocuments();

res.status(200).send({
	status: "success",
	totalBooks,
	totalPages: Math.ceil(totalBooks / limit),
	currentPage: page,
	data: books
});
});

export default router;
