import { NextResponse } from 'next/server';
import { INITIAL_VEHICLES, INITIAL_BOOKINGS } from '@/lib/mock-data';
import { checkVehicleAvailability } from '@/lib/availability';
import { calculateRentalPrice } from '@/lib/pricing';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vehicleId, pickupTime, returnTime, customer, location } = body;

    if (!vehicleId || !pickupTime || !returnTime || !customer) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking parameters.' },
        { status: 400 }
      );
    }

    const vehicle = INITIAL_VEHICLES.find((v) => v.id === vehicleId);
    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found.' },
        { status: 404 }
      );
    }

    // Availability validation against conflicting bookings
    const availability = checkVehicleAvailability(
      vehicle,
      pickupTime,
      returnTime,
      INITIAL_BOOKINGS,
      []
    );

    if (!availability.isAvailable) {
      return NextResponse.json(
        { success: false, error: availability.reason },
        { status: 409 }
      );
    }

    const pricing = calculateRentalPrice(vehicle, pickupTime, returnTime);
    const bookingRef = `AT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      bookingRef,
      pricing,
      status: 'pending',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
