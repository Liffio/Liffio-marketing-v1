type ComparisonRow = {
  name: string;
  liffio: boolean | string;
  competitor: boolean | string;
};

// One workspace connects exactly one Instagram account (`workspacesIncluded` is 1
// on every plan except Agency, which has 20), and unlimited DMs are true of every
// plan, Free included. No agency white-label row: only agency branding and hide
// Liffio branding ship.
//
// Chatbot rows state Liffio's live plan table (docs/decisions/0006). Chatbots
// are a separate module from comment to DM, which is the advantage: a simple
// automation needs no flow builder. A competitor's chatbot tiers are not
// verified here, so those cells read "Check their plans".
const DEFAULT_ROWS: ComparisonRow[] = [
  { name: "Comment-to-DM", liffio: true, competitor: true },
  { name: "Story auto reply", liffio: true, competitor: true },
  { name: "Unlimited DMs (every plan)", liffio: true, competitor: false },
  { name: "Free plan", liffio: true, competitor: "limited" },
  { name: "Instagram accounts per subscription", liffio: "1 per workspace (Agency: 20)", competitor: false },
  { name: "Bio link pages", liffio: true, competitor: false },
  { name: "Post scheduler", liffio: true, competitor: false },
  { name: "Lead capture", liffio: true, competitor: true },
  { name: "Razorpay / INR billing", liffio: true, competitor: false },
  { name: "Chatbots for full DM conversations", liffio: true, competitor: true },
  { name: "Chatbots separate from comment to DM", liffio: true, competitor: false },
  { name: "Live chatbots on the free plan", liffio: "2", competitor: "Check their plans" },
  { name: "Chatbot questions, conditions and media", liffio: "Starter and up", competitor: "Check their plans" },
  { name: "Ice breakers and story triggers", liffio: "Growth and up", competitor: "Check their plans" },
  { name: "Chatbot lead capture and webhook step", liffio: "Business and Agency", competitor: "Check their plans" },
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
          <tr className="bg-[#fff7f7] border-b border-gray-100">
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
