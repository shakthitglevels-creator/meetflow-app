import { Router } from "express";
import { authMiddleware } from "../../auth/middlewares/auth.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { createMeetingController } from "../controllers/meeting.controller";
import { createMeetingSchema } from "../validators/create-meeting.validator";
import { validateParams } from "../middleware/validate-params.middleware";
import { joinMeetingParamsSchema } from "../validators/join-meeting.validator";
import { joinMeetingController } from "../controllers/meeting.controller";


const meetingRouter = Router()


/**
 * @openapi
 * /api/meetings:
 *   post:
 *     tags:
 *       - Meetings
 *     summary: Create an instant meeting
 *     description: Creates a new instant meeting for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Backend Team Discussion
 *                 description: Optional meeting title. Defaults to Untitled Meeting.
 *     responses:
 *       201:
 *         description: Meeting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Meeting created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                       example: Untitled Meeting
 *                     meetingCode:
 *                       type: string
 *                       example: 8XK29Q
 *                     hostId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: open
 *                     startedAt:
 *                       type: string
 *                       format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Missing or invalid access token
 *       400:
 *         description: Validation failed
 */
// create a new meeting 
meetingRouter.post("/", authMiddleware, validate(createMeetingSchema), createMeetingController)


/**
 * @openapi
 * /api/meetings/{meetingCode}/join:
 *   post:
 *     tags:
 *       - Meetings
 *     summary: Join an existing meeting
 *     description: Allows an authenticated user to join an open meeting using its meeting code.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meetingCode
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 6
 *           maxLength: 6
 *         example: 8XK29Q
 *     responses:
 *       200:
 *         description: Meeting joined successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Meeting joined successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     meeting:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         meetingCode:
 *                           type: string
 *                         hostId:
 *                           type: string
 *                         status:
 *                           type: string
 *                           example: open
 *                         startedAt:
 *                           type: string
 *                           format: date-time
 *                     participant:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum:
 *                             - host
 *                             - participant
 *                         status:
 *                           type: string
 *                           enum:
 *                             - joined
 *                             - left
 *                         joinedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid meeting code format
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Meeting is not available to join
 *       404:
 *         description: Meeting not found
 */
meetingRouter.post("/:meetingCode/join", authMiddleware, validateParams(joinMeetingParamsSchema),joinMeetingController);

export default meetingRouter;