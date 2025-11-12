import { BadRequestException, NotFoundException } from '@nestjs/common';

export const BOOKING_ERROR_MESSAGES = {
  BOOKING_ALREADY_EXISTS: 'Booking already exists',
  NO_SEATS_AVAILABLE: 'No seats available',
  EVENT_NOT_FOUND: 'Event not found',
} as const;

export const HTTP_ERRORS_BY_MESSAGE: Record<
  (typeof BOOKING_ERROR_MESSAGES)[keyof typeof BOOKING_ERROR_MESSAGES],
  typeof NotFoundException | typeof BadRequestException
> = {
  [BOOKING_ERROR_MESSAGES.EVENT_NOT_FOUND]: NotFoundException,
  [BOOKING_ERROR_MESSAGES.NO_SEATS_AVAILABLE]: BadRequestException,
  [BOOKING_ERROR_MESSAGES.BOOKING_ALREADY_EXISTS]: BadRequestException,
};
