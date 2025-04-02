import prisma from "../lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, text } = body;

    const newPrompt = await prisma.prompt.create({
      data: {
        name,
        text,
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Prompt Created Successfully!",
        data: newPrompt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json(
      { success: false, message: "Error creating prompt" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const prompts = await prisma.prompt.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Prompts Fetched Successfully!",
        prompts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching prompts" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const idInt = parseInt(id, 10);
    const prompt = await prisma.prompt.findUnique({ where: { id: idInt } });

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "Prompt not found" },
        { status: 404 }
      );
    }

    await prisma.prompt.delete({ where: { id: idInt } });

    return NextResponse.json(
      { success: true, message: "Prompt deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting prompt" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const idInt = parseInt(id, 10);
    const prompt = await prisma.prompt.findUnique({ where: { id: idInt } });

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "Prompt not found" },
        { status: 404 }
      );
    }

    const { text } = await request.json();

    const updatedPrompt = await prisma.prompt.update({
      where: { id: idInt },
      data: { text, modifiedAt: new Date() },
    });

    console.log("Updated Prompt:", updatedPrompt);

    return NextResponse.json(
      {
        success: true,
        message: "Prompt updated successfully",
        data: updatedPrompt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating prompt:", error);
    return NextResponse.json(
      { success: false, message: "Error updating prompt" },
      { status: 500 }
    );
  }
}
