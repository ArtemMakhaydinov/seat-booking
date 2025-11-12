import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';
import { BookingDto } from './types';
import { Bookings, Events } from '@prisma/client';
import { BOOKING_ERROR_MESSAGES } from './const/error-messages';

@Injectable()
export class BookingService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async checkAndCreateBooking(dto: BookingDto): Promise<Bookings> {
    this.logger.info('Creating booking', { dto });
    const record = await this.prisma.$transaction<Bookings>(
      async (connection) => {
        await this.checkAvailableSeats(dto.eventId, connection);
        await this.checkBookingExists(dto.eventId, dto.userId, connection);
        return await this.createBooking(dto, connection);
      },
    );

    return record;
  }

  private async checkAvailableSeats(
    eventId: number,
    connection: typeof PrismaClient = this.prisma,
  ): Promise<number> {
    const event = await this.getEvent(eventId, connection);
    if (!event) throw new Error(BOOKING_ERROR_MESSAGES.EVENT_NOT_FOUND);

    const bookedSeatsCount = await this.countBookedSeats(eventId, connection);
    const availableSeats = event.total_seats - bookedSeatsCount;
    if (availableSeats <= 0) {
      this.logger.error('No seats available', { eventId });
      throw new Error(BOOKING_ERROR_MESSAGES.NO_SEATS_AVAILABLE);
    }

    return availableSeats;
  }

  private async checkBookingExists(
    eventId: number,
    userId: string,
    connection: typeof PrismaClient = this.prisma,
  ): Promise<void> {
    const booking = await this.getBooking(eventId, userId, connection);
    if (booking) {
      this.logger.error('Booking already exists', { eventId, userId });
      throw new Error(BOOKING_ERROR_MESSAGES.BOOKING_ALREADY_EXISTS);
    }
  }

  private async getEvent(
    eventId: number,
    connection: typeof PrismaClient = this.prisma,
  ): Promise<Events | null> {
    this.logger.info('Getting event', { eventId });
    const event = await connection.events.findUnique({
      where: {
        id: eventId,
      },
    });
    this.logger.info('Complete getting event', { event });
    return event;
  }

  private async countBookedSeats(
    eventId: number,
    connection: typeof PrismaClient = this.prisma,
  ): Promise<number> {
    this.logger.info('Counting booked seats', { eventId });
    const count = await connection.bookings.count({
      where: {
        event_id: eventId,
      },
    });
    this.logger.info('Complete counting booked seats', { count });
    return count;
  }

  private async getBooking(
    eventId: number,
    userId: string,
    connection: typeof PrismaClient = this.prisma,
  ): Promise<Bookings | null> {
    this.logger.info('Getting booking', { eventId, userId });
    const booking = await connection.bookings.findUnique({
      where: {
        event_id_user_id: { event_id: eventId, user_id: userId },
      },
    });
    this.logger.info('Complete getting booking', { booking });
    return booking;
  }

  private async createBooking(
    dto: BookingDto,
    connection: typeof PrismaClient = this.prisma,
  ): Promise<Bookings> {
    this.logger.info('Creating booking', { dto });
    const booking = await connection.bookings.create({
      data: {
        event_id: dto.eventId,
        user_id: dto.userId,
      },
    });
    this.logger.info('Complete creating booking', { booking });
    return booking;
  }
}
