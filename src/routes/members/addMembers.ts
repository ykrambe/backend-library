import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { generateMemberCode } from "../../utils/generateCode";
import { Member } from "../../models/member";

const router = express.Router();

const pipelineValidation = [
	body("name")
	.not()
	.isEmpty()
	.withMessage("name of Book Is Required")
	.bail()
  .isLength({ max: 35, min: 4 })
  .withMessage("Minimnum length is 4 and maximum length is 35"),

	body("address")
	.not()
	.isEmpty()
	.withMessage("Author of Book Is Required")
	.bail()
  .isLength({ max: 225, min: 6 })
  .withMessage("Minimnum length is 6 and maximum length is 225"),

	body("job")
	.not()
	.isEmpty()
	.withMessage("Stock of Books Is Required")
	.bail()
]

router.post(
  "/api/members", pipelineValidation, async (req: Request, res: Response) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({
        status: "error",
        message: "Data Not Valid",
        errors: errors.array(),
      });
    }

		const {
			name, address, job
		} = req.body

		const checkMembers = await Member.findOne({ name: name });
		if (checkMembers) {
			res.status(401).send({
				status: "error",
        message: `Members with name ${name} Already Exist`,
			})
		}

    let createMember = null;
		let codeMember = null;

    try {
			// generate code of book
			codeMember = await generateMemberCode(name, job)

			//check code of book
			const checkMember = await Member.findOne({ code: codeMember });
			if (checkMember) {
				codeMember = await generateMemberCode(name, job)
			}

      createMember = await Member.create({
        ...req.body,
				code: codeMember,
				status: "Active",				
      });
    } catch (err) {
      res.status(401).send({
				status: "error",
        message: `Error create new member`,
				errors: err
			})
    }

    res.status(201).send({ 
			status: "success",
			message: `Successfully create new member`,
			data: createMember
		});
  }
);

export default router;
