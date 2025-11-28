import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params

    const calendar = await prisma.calendar.findUnique({
      where: { shareId },
      include: {
        entries: {
          orderBy: { day: "asc" }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
    })

    if (!calendar) {
      return NextResponse.json(
        { error: "Calendar not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(calendar)
  } catch (error) {
    console.error("Error fetching shared calendar:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
