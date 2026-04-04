import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nessun file ricevuto" },
        { status: 400 },
      );
    }

const uniqueName = `${Date.now()}-${file.name}`;

const blob = await put(uniqueName, file, {      access: "public",
    });

    return NextResponse.json({ url: blob.url });
 } catch (error) {
  console.error("UPLOAD IMAGE ERROR:", error);

  return NextResponse.json(
    { error: "Errore durante upload immagine" },
    { status: 500 },
  );
}
}