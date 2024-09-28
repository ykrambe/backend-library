import express, { Request, Response } from "express";
import { Borrowing } from "../../models/borrowing";
import { create } from "ts-node";

const router = express.Router();

router.get('/api/borrowing', async (req: Request, res:Response) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	const borrowings = await Borrowing.aggregate([
		{ $sort: { createdAt: -1 } }, // Sort by createdAt
		{ $skip: skip }, // Skip for pagination
		{ $limit: limit } // limit result
]);

const totalBorrowing = await Borrowing.countDocuments();

res.status(200).send({
	status: "success",
	totalBorrowing: totalBorrowing,
	totalPages: Math.ceil(totalBorrowing / limit),
	currentPage: page,
	data: borrowings
});
});

export default router;
