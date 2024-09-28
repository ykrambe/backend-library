import express, { Request, Response } from "express";
import { Borrowing } from "../../models/borrowing";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get('/api/borrowing/:id', async (req: Request, res:Response) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	const borrowings = await Borrowing.aggregate([
        { $match: { member: new ObjectId(req.params.id) } },
		{ $sort: { createdAt: 1 } }, // Sort by createdAt
		{ $skip: skip }, // Skip for pagination
		{ $limit: limit } // limit result
    ]);
    

const totalBorrowing = await Borrowing.countDocuments({
    member: req.params.id
});

res.status(200).send({
	status: "success",
	totalBorrowing: totalBorrowing,
	totalPages: Math.ceil(totalBorrowing / limit),
	currentPage: page,
	data: borrowings
});
});

export default router;
