import { Event, EventStatus, Role } from "@prisma/client";

import { NotFoundException } from "../../../common/exceptions/NotFoundException.js";
import { ForbiddenException } from "../../../common/exceptions/ForbiddenException.js";

import type { AuthenticatedUser } from "../../../common/types/authenticated-user.js";
import { BadRequestException } from "../../../common/exceptions/BadRequestException.js";

export function ensureEventExists(event: Event | null): asserts event is Event {
  if (!event) {
    throw new NotFoundException("Event not found");
  }
}

export function ensurePublicEvent(event: Event): void {
  if (event.status !== EventStatus.PUBLISHED) {
    throw new NotFoundException("Event not found");
  }
}

export function ensureEventOwner(
  currentUser: AuthenticatedUser,
  event: Event,
): void {
  if (currentUser.role === Role.ADMIN) {
    return;
  }

  if (event.organizerId !== currentUser.id) {
    throw new ForbiddenException("You are not allowed to access this event");
  }
}

export function ensureEventEditable(event: Event): void {
  if (
    event.status === EventStatus.CANCELLED ||
    event.status === EventStatus.COMPLETED
  ) {
    throw new ForbiddenException("This event cannot be updated");
  }
}

export function ensurePublishable(event: Event): void {
  if (event.status === EventStatus.PUBLISHED) {
    throw new BadRequestException("Event is already published");
  }

  if (event.status === EventStatus.CANCELLED) {
    throw new BadRequestException("Cancelled events cannot be published");
  }

  if (event.status === EventStatus.COMPLETED) {
    throw new BadRequestException("Completed events cannot be published");
  }
}

export function ensureCancelable(event: Event): void {
  if (event.status === EventStatus.CANCELLED) {
    throw new BadRequestException("Event is already cancelled");
  }

  if (event.status === EventStatus.COMPLETED) {
    throw new BadRequestException("Completed events cannot be cancelled");
  }
}
