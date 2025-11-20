import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "../_helpers";
import { writeFileSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { privacy, terms, cookies } = await req.json();
    
    const isVercel = !!process.env.VERCEL;
    
    if (isVercel) {
      return NextResponse.json(
        {
          ok: false,
          error: "File system writes are not supported on Vercel serverless functions.",
          instruction: "Для обновления контента отредактируйте файлы в /public/cms/ в GitHub репозитории."
        },
        { status: 501 }
      );
    }

    if (privacy !== undefined) {
      const privacyPath = join(process.cwd(), "public", "cms", "privacy.md");
      writeFileSync(privacyPath, privacy, "utf-8");
    }
    
    if (terms !== undefined) {
      const termsPath = join(process.cwd(), "public", "cms", "terms.md");
      writeFileSync(termsPath, terms, "utf-8");
    }
    
    if (cookies !== undefined) {
      const cookiesPath = join(process.cwd(), "public", "cms", "cookies.md");
      writeFileSync(cookiesPath, cookies, "utf-8");
    }
    
    return NextResponse.json({ ok: true, message: "Policies успешно сохранены" });
  } catch (error: any) {
    console.error("Error saving policies:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Ошибка при сохранении policies" },
      { status: 500 }
    );
  }
}
