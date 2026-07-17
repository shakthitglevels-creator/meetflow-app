import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../../shared/response";
import { createMeetingService, joinMeetingService, leaveMeetingService, getMeetingDetailsService, getMeetingParticipantsService } from "../services/meeting.service";

export const createMeetingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Logged in user comes from auth middleware
    const hostId = (req as any).user.userId;

    // Optional title from frontend
    const { title } = req.body;

    // Business logic
    const meeting = await createMeetingService(hostId, title);
    

    return sendSuccess(res, "Meeting created successfully", meeting, 201);
  } catch (error) {
    next(error);
  }
};

// Handles joining an existing meeting 
export const joinMeetingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {


    // public meeting code comes from the url
    const meetingCode = Array.isArray(req.params.meetingCode)
      ? req.params.meetingCode[0]
      : req.params.meetingCode;
    
    // logged in user comes from the auth middleware
    const userId = (req as any).user.userId

    // Service handles all joining business rules
    const result = await joinMeetingService(
      meetingCode,
      userId
    )


    return sendSuccess(
      res, 
      "Meeting joined successfully",
      result
    )
  } catch (error) {
    next(error)
  }
}



// Handles leaving an existing meeting
export const leaveMeetingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Meeting code comes from the URL parameter
    const meetingCode = Array.isArray(req.params.meetingCode)
      ? req.params.meetingCode[0]
      : req.params.meetingCode;

    // Logged-in user comes from auth middleware
    const userId = (req as any).user.userId;

    // Service handles leave-meeting business rules
    const result = await leaveMeetingService(
      meetingCode,
      userId
    );

    return sendSuccess(
      res,
      "Meeting left successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};



// Handles fetching meeting preview/details
export const getMeetingDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Meeting code comes from URL params
    const meetingCode = Array.isArray(req.params.meetingCode)
      ? req.params.meetingCode[0]
      : req.params.meetingCode;

    // Service fetches meeting, host, and participant count
    const result = await getMeetingDetailsService(
      meetingCode
    );

    return sendSuccess(
      res,
      "Meeting details fetched successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};



// Handles fetching currently joined participants
export const getMeetingParticipantsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Meeting code comes from the URL
    const meetingCode = Array.isArray(req.params.meetingCode)
      ? req.params.meetingCode[0]
      : req.params.meetingCode;

    // Service fetches and formats participant data
    const participants =
      await getMeetingParticipantsService(meetingCode);

    return sendSuccess(
      res,
      "Meeting participants fetched successfully",
      participants
    );
  } catch (error) {
    next(error);
  }
};