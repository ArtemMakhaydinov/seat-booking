import { JSONSchemaType } from 'ajv/dist/core';
import { BookingDto } from '../types';

export const reservePostSchema: JSONSchemaType<BookingDto> = {
  type: 'object',
  properties: {
    eventId: {
      type: 'number',
    },
    userId: {
      type: 'string',
    },
  },
  required: ['eventId', 'userId'],
};
