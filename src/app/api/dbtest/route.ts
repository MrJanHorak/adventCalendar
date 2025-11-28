import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`
    return NextResponse.json({ status: "ok", db: result })
  } catch (e: any) {
    console.error("[dbtest] Database connectivity check failed", {
      message: e?.message,
      code: e?.code,
      stack: e?.stack,
    })
    return NextResponse.json({ status: "error", error: e?.message }, { status: 500 })
  }
}
