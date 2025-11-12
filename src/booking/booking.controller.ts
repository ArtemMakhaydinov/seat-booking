import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { BookingDto } from './types';
import { BookingService } from './booking.service';
import Ajv from 'ajv';
import { reservePostSchema } from './schemas';
import { HTTP_ERRORS_BY_MESSAGE } from './const/error-messages';
import { bigintReplacer } from 'src/utils/bigint-replacer';

@Controller('api/bookings')
export class BookingController {
  private readonly validator: Ajv;

  constructor(private readonly bookingService: BookingService) {
    this.validator = new Ajv();
    this.validator.addSchema(reservePostSchema, 'reservePost');
  }

  @Post('/reserve')
  async create(@Body() body: BookingDto) {
    const validate = this.validator.getSchema('reservePost');
    if (!validate) {
      throw new InternalServerErrorException('Validator schema not found');
    }

    if (!body || !validate(body)) {
      throw new BadRequestException(
        validate.errors?.map((error) => error.message).join(', ') ??
          'Invalid request body',
      );
    }

    try {
      const record = await this.bookingService.checkAndCreateBooking(body);
      return JSON.stringify(record, bigintReplacer);
    } catch (error) {
      const httpError =
        HTTP_ERRORS_BY_MESSAGE[error.message] || InternalServerErrorException;
      throw new httpError(error.message);
    }
  }
}
