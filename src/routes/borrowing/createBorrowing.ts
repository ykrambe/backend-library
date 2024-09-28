import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Book } from "../../models/book";
import { Member } from "../../models/member";
import { Borrowing } from "../../models/borrowing";

const router = express.Router();

const pipelineValidation = [
	body("codeBooks")
	.isArray({ min: 1, max: 2 })
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
	.withMessage("code of Member Is Required")
	.bail()
]

interface dataBookType {
	bookID: string;
	code: string;
	status: string;
}

router.post(
  "/api/borrowing", pipelineValidation, async (req: Request, res: Response) => {
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
        message: `Member with code '${codeMember}' Not Found`,
			})
		}else {
			const checkBorrowingMember = await Borrowing.countDocuments({ 
				member: getMember.id,
				status: "Process"
			});

			if (checkBorrowingMember >= 2) {
				return res.status(400).send({
					status: "error",
					message: `Member has borrowing not complete`,
				})
			}
			if (getMember.status === "Inactive" && getMember.inactiveUntil) {
				if(getMember.inactiveUntil.getTime() > new Date().getTime()) {
					return res.status(400).send({
						status: "error",
						message: `Member has penalty, cannot borrow book until ${getMember.inactiveUntil}`,
					})
				}else {
					const updateMemberToActive = await Member.findByIdAndUpdate(
						getMember.id, 
						{
							status: "Active",
							inactiveUntil: null
						},
						{
							new: true
						}
					)
				}

				
			}

		}

		let dataBooks: dataBookType[] = [];

		for (let i = 0; i < codeBooks.length; i++) {
			const checkBook = await Book.findOne({ code: codeBooks[i], stock: { $gt: 1 } });
			if (!checkBook) {
				return res.status(400).send({
					status: "error",
					message: `Book not found or stock is issuficient`,
				})
			}else {
				dataBooks.push({
					bookID: checkBook.id,
					code: checkBook.code,
					status: "Borrowed"
				})
			}			
		}

		let createBorrowing = null

		try {
			createBorrowing = await Borrowing.create({
				member: getMember.id,
				books: dataBooks,
				borrowDate: new Date(),
				returnDate: null,
				status: "Process",
			})

			if (createBorrowing) {
				for (let i = 0; i < dataBooks.length; i++) {
					const getBook = await Book.findById(dataBooks[i].bookID);
					if (getBook) {
						getBook.set({
							stock: getBook.stock - 1,
							borrowed: getBook.borrowed + 1,
							updatedAt: new Date(),
						})

						await getBook.save()
					}
				}
			}
		} catch (err) {
			return res.status(400).send({
				status: "error",
				message: `error when creating borrowing`,
				error: err
			})
		}
		

    return res.status(201).send({ 
			status: "success",
			data: createBorrowing
		});
  }
);

export default router;
