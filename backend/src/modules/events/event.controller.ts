import type { Request, Response } from "express";

import { successResponse } from "../../common/utils/api-response.js";

import { EventService } from "./event.service.js";

import { createEventSchema, eventIdParamSchema, updateEventBodySchema } from "./event.validation.js";
import {
  organizerEventsQuerySchema,
  publicEventsQuerySchema,
} from "./event.query.js";

export class EventController {
  constructor(private readonly service = new EventService()) {}

  // create event
  create = async (req: Request, res: Response) => {
    const payload = createEventSchema.parse(req.body);

    const event = await this.service.create(req.user!, payload);

    successResponse(res, event, "Event created successfully", 201);
  };

  // find all events
  findAll = async (req: Request, res: Response) => {
    const query = publicEventsQuerySchema.parse(req.query);

    const result = await this.service.findAll(query);

    successResponse(res, result, "Events fetched successfully");
  };

  // find by Organizer
  findMyEvents = async (req: Request, res: Response) => {
    const query = organizerEventsQuerySchema.parse(req.query);

    const result = await this.service.findMyEvents(req.user!, query);

    successResponse(res, result, "Events fetched successfully");
  };

  // find event by id
  findById = async (req: Request, res: Response) => {
    const { id } = eventIdParamSchema.parse(req.params);

    const event = await this.service.findPublicById(id);

    successResponse(res, event, "Event fetched successfully");
  };

  // update event only admin (all) or organizer (own events)
  update = async (req: Request, res: Response) => {
    const { id } = eventIdParamSchema.parse(req.params);

    const body = updateEventBodySchema.parse(req.body);

    const event = await this.service.update(req.user!, id, body);

    successResponse(res, event, "Event updated successfully");
  };
}
