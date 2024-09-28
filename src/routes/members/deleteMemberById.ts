import express, { Request, Response } from "express";
import { Member } from "../../models/member";

const router = express.Router();

router.delete('/api/members/:id', async (req: Request, res:Response) => {

	const deleteMember = await Member.findByIdAndDelete(req.params.id);

	if (!deleteMember) {
		res.status(401).send({
			status: "error",
			message:`Member with ID ${req.params.id} Not Found`,
		})
	}

	res.status(204).send({
		status: "success",
		message: "Member with ID " + req.params.id + " has been deleted",
	});

});

export default router;
