import { NextResponse } from 'next/server';
import { INITIAL_VEHICLES } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let list = INITIAL_VEHICLES.filter((v) => v.isPublished);

  if (category) {
    list = list.filter((v) => v.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter((v) => v.name.toLowerCase().includes(q) || v.model.toLowerCase().includes(q));
  }

  return NextResponse.json({
    success: true,
    count: list.length,
    vehicles: list,
  });
}
