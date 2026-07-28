import { Role } from '@prisma/client';

import { ForbiddenException } from '../../../common/exceptions/ForbiddenException.js';

import type { AuthenticatedUser } from '../../../common/types/authenticated-user.js';

export function ensureOrganizerOrAdmin(
  user: AuthenticatedUser,
): void {

  if (
    user.role !== Role.ADMIN &&
    user.role !== Role.ORGANIZER
  ) {
    throw new ForbiddenException(
      'Only admins and organizers can create events',
    );
  }

}