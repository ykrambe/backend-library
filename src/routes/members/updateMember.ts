import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Member } from "../../models/member";

const router = express.Router();

const pipelineValidation = [
	body("name")
	.not()
	.isEmpty()
	.withMessage("Title of Member to update is Required")
	.bail()
	.isLength({ max: 35, min: 4 })
	.withMessage("Minimnum length is 4 and maximum length is 35"),

	body("address")
	.not()
	.isEmpty()
	.withMessage("Author of Member to update is Required")
	.bail()
	.isLength({ max: 225, min: 6 })
  .withMessage("Minimnum length is 6 and maximum length is 225"),

	body("job")
	.not()
	.isEmpty()
	.withMessage("Stock of Members to update is Required")
	.bail()
]

router.put(
  "/api/members/:id", pipelineValidation, async (req: Request, res: Response) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({
        status: "error",
        message: "Data Not Valid",
        errors: errors.array(),
      });
    }

		const {
			name,
			address,
			job
		} = req.body

		let updateMember = null;

		try {
			updateMember = await Member.findByIdAndUpdate(
				req.params.id,
				{
					$set: {
						name: name,
						address: address,
						job: job
					}
				},
				{
					new: true
				}
			);
			if (!updateMember) {
				res.status(401).send({
					status: "error",
					message:`Error to update new member`,
				})
			}
		} catch (err) {
			res.status(401).send({
				status: "error",
        message: `Error to update new member`,
				errors: err
			})
		}

    res.status(201).send({ 
			status: "success",
			message: `Successfully update member`,
			data: updateMember
		});
  }
);

export default router;
