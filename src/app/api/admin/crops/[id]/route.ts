import { Prisma } from "@prisma/client";

import { hasAdminSession } from "@/lib/admin-auth";
import { deleteCropById } from "@/lib/crop-service";

export const dynamic = "force-dynamic";

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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
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
