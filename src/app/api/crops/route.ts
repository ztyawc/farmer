import { ZodError } from "zod";

import { createCrop, getCrops, parseSortMode } from "@/lib/crop-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = parseSortMode(searchParams.get("sort"));
  const crops = await getCrops(sort);

  return Response.json({
    sort,
    crops,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const crop = await createCrop(body);

    return Response.json(
      {
        crop,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          error: error.issues[0]?.message ?? "提交数据格式错误",
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : "创建作物失败",
      },
      { status: 400 },
    );
  }
}
