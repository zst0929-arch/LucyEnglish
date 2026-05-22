import { notFound } from "next/navigation";
import { getResourceById, resourceLibrary } from "@/lib/resources";
import ResourceDetailClient from "./resource-detail-client";

export function generateStaticParams() {
  return resourceLibrary.map((resource) => ({ id: resource.id }));
}

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = getResourceById(id);

  if (!resource) notFound();

  return <ResourceDetailClient resource={resource} />;
}
