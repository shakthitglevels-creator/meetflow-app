import { Router } from "express";
import { authMiddleware } from "../../auth/middlewares/auth.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { createMeetingController } from "../controllers/meeting.controller";
import { createMeetingSchema } from "../validators/create-meeting.validator";
import { validateParams } from "../middleware/validate-params.middleware";
import { joinMeetingParamsSchema } from "../validators/join-meeting.validator";
import { joinMeetingController, leaveMeetingController, getMeetingDetailsController } from "../controllers/meeting.controller";


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
 * /api/meetings/{meetingCode}:
 *   get:
 *     tags:
 *       - Meetings
 *     summary: Get meeting details
 *     description: Returns meeting preview information, host details, and the number of currently joined participants.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meetingCode
 *         required: true
 *         description: Six-character public meeting code
 *         schema:
 *           type: string
 *           minLength: 6
 *           maxLength: 6
 *         example: 8XK29Q
 *     responses:
 *       200:
 *         description: Meeting details fetched successfully
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
 *                   example: Meeting details fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 66a4cdd90ea8fe6863b98c243
 *                     title:
 *                       type: string
 *                       example: Backend Team Discussion
 *                     meetingCode:
 *                       type: string
 *                       example: 8XK29Q
 *                     status:
 *                       type: string
 *                       enum:
 *                         - scheduled
 *                         - open
 *                         - ended
 *                         - cancelled
 *                       example: open
 *                     host:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                           example: Shakthivel
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: shakthi@example.com
 *                         avatar:
 *                           type: string
 *                           nullable: true
 *                     participantCount:
 *                       type: integer
 *                       example: 2
 *                     scheduledAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     startedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     endedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid meeting code format
 *       401:
 *         description: Missing, invalid, or expired access token
 *       404:
 *         description: Meeting not found
 */
meetingRouter.get(
  "/:meetingCode",
  authMiddleware,
  validateParams(joinMeetingParamsSchema),
  getMeetingDetailsController
); 



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


/**
 * @openapi
 * /api/meetings/{meetingCode}/leave:
 *   post:
 *     tags:
 *       - Meetings
 *     summary: Leave a meeting
 *     description: Marks the authenticated participant as left without deleting their participation record.
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
 *         description: Meeting left successfully
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
 *                   example: Meeting left successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     meetingCode:
 *                       type: string
 *                       example: 8XK29Q
 *                     participantId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: left
 *                       enum:
 *                         - joined
 *                         - left
 *                     leftAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid meeting code format
 *       401:
 *         description: Missing, invalid, or expired access token
 *       404:
 *         description: Meeting or participant record not found
 *       500:
 *         description: Unable to update participant state
 */
meetingRouter.post(
  "/:meetingCode/leave",
  authMiddleware,
  validateParams(joinMeetingParamsSchema),
  leaveMeetingController
);









export default meetingRouter;




