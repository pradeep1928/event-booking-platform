import type { Request, Response } from "express";

import { successResponse } from "../../common/utils/api-response.js";

import { EventService } from "./event.service.js";

import { createEventSchema } from "./event.validation.js";

export class EventController {
  constructor(private readonly service = new EventService()) {}

  create = async (req: Request, res: Response) => {

    const payload = createEventSchema.parse(req.body);

    const event = await this.service.create(req.user!, payload);

    successResponse(res, event, "Event created successfully", 201);
  };
}
