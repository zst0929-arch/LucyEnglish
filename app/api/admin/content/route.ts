import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { courses } from "@/lib/courses";
import { resourceLibrary } from "@/lib/resources";

export async function GET(request: Request) {
  const { response } = requireAdmin(request);
  if (response) return response;

  return NextResponse.json({
    courses,
    resources: resourceLibrary.map((resource) => ({
      id: resource.id,
      title: resource.title,
      intro: resource.intro,
      image: resource.image,
      groupCount: resource.groups.length,
      itemCount: resource.groups.reduce((total, group) => total + group.items.length, 0)
    }))
  });
}
