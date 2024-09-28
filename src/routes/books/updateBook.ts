import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Book } from "../../models/book";
import { generateBookCode } from "../../utils/generateCode";
import { set } from "mongoose";

const router = express.Router();

const pipelineValidation = [
	body("title")
	.not()
	.isEmpty()
	.withMessage("Title of Book to update is Required")
	.bail(),

	body("author")
	.not()
	.isEmpty()
	.withMessage("Author of Book to update is Required")
	.bail(),

	body("stock")
	.not()
	.isEmpty()
	.withMessage("Stock of Books to update is Required")
	.bail()
	.isInt({ gt: 0 }).withMessage('Stock harus lebih besar dari 0'),
]

router.put(
  "/api/books/:id", pipelineValidation, async (req: Request, res: Response) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({
        status: "error",
        message: "Data Not Valid",
        errors: errors.array(),
      });
    }

		const {
			title,
			author,
			stock
		} = req.body

		let updateBook = null;

		try {
			updateBook = await Book.findByIdAndUpdate(
				req.params.id,
				{
					$set: {
						title: title,
						author: author,
						stock: stock
					}
				},
				{
					new: true
				}
			);
			if (!updateBook) {
				res.status(401).send({
					status: "error",
					message:`Error to update new book`,
				})
			}
		} catch (err) {
			res.status(401).send({
				status: "error",
        message: `Error to update new book`,
				errors: err
			})
		}

    res.status(201).send({ 
			status: "success",
			message: "Successfully update book",
			data: updateBook
		});
  }
);

export default router;
