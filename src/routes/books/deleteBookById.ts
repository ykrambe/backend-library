import express, { Request, Response } from "express";
import { Book } from "../../models/book";

const router = express.Router();

router.delete('/api/books/:id', async (req: Request, res:Response) => {

	const deleteBook = await Book.findByIdAndDelete(req.params.id);

	if (!deleteBook) {
		res.status(401).send({
			status: "error",
			message:`Book with ID ${req.params.id} Not Found`,
		})
	}

	res.status(204).send({
		status: "success",
		message: "Book with ID " + req.params.id + " has been deleted",
	});

});

export default router;
