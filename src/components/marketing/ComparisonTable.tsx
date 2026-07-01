type ComparisonRow = {
  name: string;
  liffio: boolean | string;
  competitor: boolean | string;
};

const DEFAULT_ROWS: ComparisonRow[] = [
  { name: "Comment-to-DM", liffio: true, competitor: true },
  { name: "Story auto reply", liffio: true, competitor: true },
  { name: "Live stream DMs", liffio: true, competitor: "paid only" },
  { name: "Unlimited DMs", liffio: true, competitor: false },
  { name: "Free plan", liffio: true, competitor: "limited" },
  { name: "Unlimited accounts", liffio: true, competitor: false },
  { name: "Agency white-label", liffio: true, competitor: "enterprise only" },
  { name: "Bio link pages", liffio: true, competitor: false },
  { name: "Post scheduler", liffio: true, competitor: false },
  { name: "Lead capture", liffio: true, competitor: true },
  { name: "External API", liffio: true, competitor: "paid only" },
  { name: "Razorpay / INR billing", liffio: true, competitor: false },
];

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return <span className="text-emerald-600 font-semibold">✓</span>;
  }
  if (value === false) {
    return <span className="text-gray-300">-</span>;
  }
  return <span className="text-sm text-gray-600">{value}</span>;
}

export default function ComparisonTable({
  competitorName,
  rows = DEFAULT_ROWS,
}: {
  competitorName: string;
  rows?: ComparisonRow[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="bg-[#faf8ff] border-b border-gray-100">
            <th className="px-5 py-4 font-semibold text-gray-900">Feature</th>
            <th className="px-5 py-4 font-semibold text-[#b20d8f]">Liffio</th>
            <th className="px-5 py-4 font-semibold text-gray-700">{competitorName}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-gray-50 last:border-0">
              <td className="px-5 py-3 text-gray-700">{row.name}</td>
              <td className="px-5 py-3">
                <CellValue value={row.liffio} />
              </td>
              <td className="px-5 py-3">
                <CellValue value={row.competitor} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
