
import {
  Event,
  EventStatus,
} from "@prisma/client";

import { BadRequestException } from "../../../common/exceptions/BadRequestException.js";

export function ensureEventBookable(
  event: Event,
): void {
  if (event.status !== EventStatus.PUBLISHED) {
    throw new BadRequestException(
      "Only published events can be booked",
    );
  }
}