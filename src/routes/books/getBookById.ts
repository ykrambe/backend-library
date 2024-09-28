import express, { Request, Response } from "express";
import { Book } from "../../models/book";

const router = express.Router();

router.get('/api/books/:id', async (req: Request, res:Response) => {

	const getBook = await Book.findById(req.params.id);

	if (!getBook) {
		res.status(401).send({
			status: "error",
			message:`Book with ID ${req.params.id} Not Found`,
		})
	}

	res.status(200).send({
		status: "success",
		data: getBook
	});

});

export default router;
