import express, { Request, Response } from "express";
import { Member } from "../../models/member";

const router = express.Router();

router.get('/api/members', async (req: Request, res:Response) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	const members = await Member.aggregate([
		{ $sort: { name: 1 } }, // Sort by title
		{ $skip: skip }, // Skip for pagination
		{ $limit: limit } // limit result
]);

const totalMembers = await Member.countDocuments();

res.status(200).send({
	status: "success",
	totalMembers: totalMembers,
	totalPages: Math.ceil(totalMembers / limit),
	currentPage: page,
	data: members
});
});

export default router;
