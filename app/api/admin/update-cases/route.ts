import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "../_helpers";
import { writeFileSync, existsSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const cases = await req.json();
    
    // Проверяем, можем ли мы писать в файловую систему (работает только локально)
    const isLocal = process.env.NODE_ENV === "development" || !process.env.VERCEL;
    
    if (!isLocal) {
      return NextResponse.json(
        {
          ok: false,
          error: "File system writes are not supported on Vercel serverless functions.",
          instruction: "Для обновления контента отредактируйте файл /public/cms/cases.json в GitHub репозитории и сделайте commit. Vercel автоматически задеплоит изменения.",
          alternatives: [
            "1. Редактируйте файлы напрямую в GitHub и делайте push",
            "2. Используйте локальную разработку с npm run dev",
            "3. Подключите внешнюю CMS (Sanity, Contentful)",
            "4. Используйте Vercel KV/Blob Storage (требует настройки)"
          ]
        },
        { status: 501 }
      );
    }

    // Локальная разработка - сохраняем файл
    const filePath = join(process.cwd(), "public", "cms", "cases.json");
    const dataToSave = { cases: Array.isArray(cases) ? cases : [] };
    
    writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), "utf-8");
    
    return NextResponse.json({ ok: true, message: "Кейсы успешно сохранены" });
  } catch (error: any) {
    console.error("Error saving cases:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Ошибка при сохранении кейсов" },
      { status: 500 }
    );
  }
}
