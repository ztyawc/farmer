import { ZodError } from "zod";

import { hasAdminSession } from "@/lib/admin-auth";
import { deleteCropById, updateCropById } from "@/lib/crop-service";

export const dynamic = "force-dynamic";

function hasPrismaErrorCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === code
  );
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/crops/[id]">,
) {
  const isAdmin = await hasAdminSession();

  if (!isAdmin) {
    return Response.json(
      {
        error: "未授权访问",
      },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    await deleteCropById(id);

    return Response.json({
      success: true,
    });
  } catch (error) {
    if (hasPrismaErrorCode(error, "P2025")) {
      return Response.json(
        {
          error: "作物记录不存在",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        error: "删除作物失败",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/crops/[id]">,
) {
  const isAdmin = await hasAdminSession();

  if (!isAdmin) {
    return Response.json(
      {
        error: "鏈巿鏉冭闂?",
      },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const crop = await updateCropById(id, body);

    return Response.json({
      crop,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          error: error.issues[0]?.message ?? "鎻愪氦鏁版嵁鏍煎紡閿欒",
        },
        { status: 400 },
      );
    }

    if (hasPrismaErrorCode(error, "P2025")) {
      return Response.json(
        {
          error: "浣滅墿璁板綍涓嶅瓨鍦?",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : "鏇存柊浣滅墿澶辫触",
      },
      { status: 400 },
    );
  }
}
