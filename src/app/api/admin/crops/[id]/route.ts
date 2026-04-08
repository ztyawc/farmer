import { ZodError } from "zod";

import { hasAdminSession } from "@/lib/admin-auth";
import {
  CropNotFoundError,
  CropVersionConflictError,
  deleteCropById,
  updateCropById,
} from "@/lib/crop-service";

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
        error: "未授权访问",
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
          error: error.issues[0]?.message ?? "提交数据格式错误",
        },
        { status: 400 },
      );
    }

    if (error instanceof CropNotFoundError) {
      return Response.json(
        {
          error: error.message,
        },
        { status: 404 },
      );
    }

    if (error instanceof CropVersionConflictError) {
      return Response.json(
        {
          error: error.message,
          crop: error.latestCrop,
        },
        { status: 409 },
      );
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : "更新作物失败",
      },
      { status: 400 },
    );
  }
}
