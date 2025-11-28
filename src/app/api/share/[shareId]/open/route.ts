import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params
    const session = await auth()
    
    // Allow anonymous users to open doors
    const userId = session?.user?.id || "anonymous"

    const { day, force } = await req.json()

    if (!day || day < 1 || day > 25) {
      return NextResponse.json(
        { error: "Invalid day" },
        { status: 400 }
      )
    }

    const calendar = await prisma.calendar.findUnique({
      where: { shareId },
    })

    if (!calendar) {
      return NextResponse.json(
        { error: "Calendar not found" },
        { status: 404 }
      )
    }

    // Check if user is owner trying to force open
    const isOwner = session?.user?.id === calendar.userId
    const allowForceOpen = force === true && isOwner

    // Check if door should be openable (December 1-25 only)
    // Skip this check if owner is forcing open
    if (!allowForceOpen) {
      const now = new Date()
      const currentMonth = now.getMonth() + 1 // 0-indexed
      const currentDay = now.getDate()

      if (currentMonth !== 12 || day > currentDay) {
        return NextResponse.json(
          { error: "This door cannot be opened yet!" },
          { status: 403 }
        )
      }
    }

    // Check if already opened
    const existing = await prisma.openedDoor.findUnique({
      where: {
        userId_calendarId_day: {
          userId,
          calendarId: calendar.id,
          day,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ alreadyOpened: true, openedAt: existing.openedAt })
    }

    // Mark as opened
    const openedDoor = await prisma.openedDoor.create({
      data: {
        day,
        userId,
        calendarId: calendar.id,
      },
    })

    return NextResponse.json({ alreadyOpened: false, openedAt: openedDoor.openedAt })
  } catch (error) {
    console.error("Error opening door:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params
    const session = await auth()
    
    const userId = session?.user?.id || "anonymous"

    const calendar = await prisma.calendar.findUnique({
      where: { shareId },
    })

    if (!calendar) {
      return NextResponse.json(
        { error: "Calendar not found" },
        { status: 404 }
      )
    }

    const openedDoors = await prisma.openedDoor.findMany({
      where: {
        userId,
        calendarId: calendar.id,
      },
      select: {
        day: true,
        openedAt: true,
      },
    })

    return NextResponse.json(openedDoors)
  } catch (error) {
    console.error("Error fetching opened doors:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
