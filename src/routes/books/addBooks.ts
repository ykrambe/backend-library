import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Book } from "../../models/book";
import { generateBookCode } from "../../utils/generateCode";

const router = express.Router();

const pipelineValidation = [
	body("title")
	.not()
	.isEmpty()
	.withMessage("Title of Book Is Required")
	.bail(),

	body("author")
	.not()
	.isEmpty()
	.withMessage("Author of Book Is Required")
	.bail(),

	body("stock")
	.not()
	.isEmpty()
	.withMessage("Stock of Books Is Required")
	.bail()
	.isInt({ gt: 0 }).withMessage('Stock must greater than 0'),
]

router.post(
  "/api/books", pipelineValidation, async (req: Request, res: Response) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({
        status: "error",
        message: "Data Not Valid",
        errors: errors.array(),
      });
    }

		const checkBook = await Book.findOne({ title: req.body.code, author: req.body.author });
		if (checkBook) {
			res.status(401).send({
				status: "error",
        message: `Book with title ${req.body.title} and author ${req.body.author} Already Exist`,
			})
		}

    let createBook = null;
		let codeBook = null;

    try {
			// generate code of book
			codeBook = await generateBookCode(req.body.title, req.body.author)

			//check code of book
			const checkCode = await Book.findOne({ code: codeBook });
			if (checkCode) {
				codeBook = await generateBookCode(req.body.title, req.body.author)
			}

      createBook = await Book.create({
        ...req.body,
				code: codeBook
      });
    } catch (err) {
      res.status(401).send({
				status: "error",
        message: `Error create new book`,
				errors: err
			})
    }

    res.status(201).send({ 
			status: "success",
			data: createBook
		});
  }
);

export default router;
