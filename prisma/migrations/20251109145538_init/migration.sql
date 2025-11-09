-- CreateTable
CREATE TABLE "Events" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "total_seats" INTEGER NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookings" (
    "id" BIGSERIAL NOT NULL,
    "event_id" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bookings_event_id_idx" ON "Bookings"("event_id");

-- CreateIndex
CREATE INDEX "Bookings_user_id_idx" ON "Bookings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookings_event_id_user_id_key" ON "Bookings"("event_id", "user_id");

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
