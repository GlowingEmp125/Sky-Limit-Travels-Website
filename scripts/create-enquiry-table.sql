-- SQL script to create the Enquiry table
CREATE TABLE IF NOT EXISTS "Enquiry" (
  "id" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'GENERAL',
  "flightDetails" TEXT,
  "holidayDetails" TEXT,
  "packageDetails" TEXT,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
); 