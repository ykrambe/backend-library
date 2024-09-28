import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Book } from "../../models/book";
import { Member } from "../../models/member";
import { Borrowing } from "../../models/borrowing";
import { isMoreThanOneWeek } from "../../utils/timestampFunction";

const router = express.Router();

const pipelineValidation = [
	body("codeBooks")
	.isArray({ min: 1})
	.withMessage("codeBooks must be an array with minimum length of 1 and maximum length of 2")
	.not()
	.isEmpty()
	.withMessage("code of Book Is Required")
	.bail()
	.custom((value) => {
		const uniqueValues = new Set(value);
		if (value.length !== uniqueValues.size) {
			throw new Error("codeBooks must have unique values");
		}
		return true;
	})
	.bail(),

	body("codeMember")
	.not()
	.isEmpty()
	.withMessage("code of member Is Required")
	.bail()
]

router.post(
  "/api/return-borrowing", pipelineValidation, async (req: Request, res: Response) => {
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({
        status: "error",
        message: "Data Not Valid",
        errors: errors.array(),
      });
    }
		
		const codeBooks: Array<string> = req.body.codeBooks;
		const codeMember: string = req.body.codeMember;
		// check if member exist
		const getMember = await Member.findOne({ code: codeMember });
		if (!getMember) {
				return res.status(401).send({
					status: "error",
					message: `Member with code ${codeMember} Not Found`,
				})
			}

		// check if borrowing exist
		for (let i = 0; i < codeBooks.length; i++) {
			const checkBorrowingBook = await Borrowing.findOne({
				member: getMember.id,
				"books.code": codeBooks[i],
				"books.status": "Borrowed",
				status: "Process"
			}).sort({ createdAt: 1 });

			if (!checkBorrowingBook) {
				return res.status(400).send({
					status: "error",
					message: `Member never borrow book with code ${codeBooks[i]}`,
				})
			}		
		}

		let returnedBook: any[] = [];

	
		// update borrowing base on codebooks
		for (let i = 0; i < codeBooks.length; i++) {
			let returnBorrowing = await Borrowing.findOneAndUpdate(
				{
					member: getMember.id,
					"books.code": codeBooks[i],
					"books.status": "Borrowed",
					status: "Process"
				},
				{
					$set: {
						"books.$.status": "Returned",
						returnDate: new Date(),
					}
				},
				{
					new: true
				}
			).sort({ createdAt: 1 });

			if (!returnBorrowing) {
				return res.status(400).send({
					status: "error",
					message: `Error return book with code ${codeBooks[i]}`,
				})
			}

			const updateStockBook = await Book.findOneAndUpdate(
				{
					code: codeBooks[i],
				},
				{
					$inc: {
						stock: 1,
						borrowed: -1,
					}
				},
				{
					new: true
				}
			)

			if (!updateStockBook) {
				return res.status(400).send({
					status: "error",
					message: `Error update book with code ${codeBooks[i]}`,
				})
			}

			if (isMoreThanOneWeek(returnBorrowing.borrowDate)) {
				const inactiveMember = await Member.findByIdAndUpdate(
					getMember.id,
					{
						$set: {
							status: "Inactive",
							inactiveUntil: new Date(new Date().setDate(new Date().getDate() + 3)) // have penalty for 3 days later
						}
					},
					{
						new: true
					}
				)

				if (!inactiveMember) {
					return res.status(400).send({
						status: "error",
						message: `Error update status member with code ${codeBooks[i]}`,
					})
				}
			}			
			
			if (returnBorrowing.books.findIndex((book:any) => book.status === "Borrowed") === -1) {
				returnBorrowing.set({
					status: "Done"
				})
				await returnBorrowing.save()
			}

			const index:any = returnedBook.findIndex((x:any) => x.id === returnBorrowing?.id) || 0

			if (index === -1) {
				returnedBook.push(returnBorrowing)
			}else{
				returnedBook[index] = returnBorrowing
			}
		}
		
    return res.status(201).send({ 
			status: "success",
			data: returnedBook
		});
  }
);

export default router;
