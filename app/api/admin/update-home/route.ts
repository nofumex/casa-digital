import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "../_helpers";
import { writeFileSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await req.json();
    
    const isVercel = !!process.env.VERCEL;
    
    if (isVercel) {
      return NextResponse.json(
        {
          ok: false,
          error: "File system writes are not supported on Vercel serverless functions.",
          instruction: "Для обновления контента отредактируйте файл /public/cms/home.json в GitHub репозитории."
        },
        { status: 501 }
      );
    }

    const filePath = join(process.cwd(), "public", "cms", "home.json");
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    
    return NextResponse.json({ ok: true, message: "Home успешно сохранен" });
  } catch (error: any) {
    console.error("Error saving home:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Ошибка при сохранении home" },
      { status: 500 }
    );
  }
}
