import express, { Request, Response } from "express";
import { Member } from "../../models/member";

const router = express.Router();

router.get('/api/members/:id', async (req: Request, res:Response) => {

	const getMember = await Member.findById(req.params.id);

	if (!getMember) {
		res.status(401).send({
			status: "error",
			message:`Member with ID ${req.params.id} Not Found`,
		})
	}

	res.status(200).send({
		status: "success",
		data: getMember
	});

});

export default router;
