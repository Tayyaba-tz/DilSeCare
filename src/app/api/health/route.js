export async function GET() {
  return Response.json({
    status: "ok",
    service: "DilSeCare",
    time: new Date().toISOString(),
  });
}