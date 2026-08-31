async function getHealth() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/health`,
    { cache: "no-store" }
  );
  return res.json();
}
 
export default async function HealthPage() {
  const data = await getHealth();
  return (
    <div className="bg-white rounded-card shadow p-6">
      <h1 className="text-2xl font-bold text-primary">Health Check</h1>
      <p className="mt-2">Status: {data.status}</p>
      <p>Service: {data.service}</p>
      <p>Checked at: {data.time}</p>
    </div>
  );
}