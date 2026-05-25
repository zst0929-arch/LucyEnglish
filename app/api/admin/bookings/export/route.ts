import { verifyAdminToken } from "@/lib/auth";
import { readDb } from "@/lib/db";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const header = request.headers.get("authorization");
  const headerToken = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  const session = verifyAdminToken(headerToken || url.searchParams.get("token"));
  if (!session) return new Response("Unauthorized admin request.", { status: 401 });

  const db = await readDb();
  const rows = [
    ["ID", "Name", "Email", "Contact", "Project", "Service Date", "People", "Amount", "Booking Status", "Payment Status", "Remarks", "Created At"],
    ...db.bookings.map((booking) => [
      booking.id,
      booking.name,
      booking.email,
      booking.contact || "",
      booking.project || booking.stage,
      booking.serviceDate || booking.date,
      booking.people || 1,
      booking.amount || 49,
      booking.status,
      booking.paymentStatus || "unpaid",
      booking.remarks || booking.message,
      booking.createdAt
    ])
  ];

  return new Response(rows.map((row) => row.map(csvCell).join(",")).join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookings-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
