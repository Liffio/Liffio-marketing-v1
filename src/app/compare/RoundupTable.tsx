import { ROUNDUP_TOOLS, TABLE_COLUMNS } from "./tools";

/**
 * The summary table for the /compare roundup: every tool checked, one row each.
 *
 * 🚩 Row order is the order of ROUNDUP_TOOLS and is NOT a ranking. Liffio is
 * tinted because it is this site's own product and a reader deserves to see
 * which row has a vested interest, not because it came first in a scoring run.
 * Do not add a "winner" column, a score, or a "Best overall" badge: this page
 * exists because the queries it targets want a survey, and a survey that crowns
 * its own vendor is a sales page wearing a table.
 *
 * Every price cell carries "(November 2026)" and every tool name links to the
 * pricing page the figure was read from. Both are requirements, not decoration:
 * see the rules at the top of tools.ts.
 */
export default function RoundupTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <caption className="sr-only">
          Instagram DM automation tools compared. Pricing read from each vendor pricing page in
          November 2026.
        </caption>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th scope="col" className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">
              Tool
            </th>
            {TABLE_COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="text-left py-3 px-4 font-semibold text-gray-700 align-bottom"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROUNDUP_TOOLS.map((tool) => (
            <tr
              key={tool.name}
              className={`border-b border-gray-100 align-top ${tool.isLiffio ? "bg-[#fff7f7]" : ""}`}
            >
              <th scope="row" className="py-3 px-4 text-left font-semibold text-gray-900 align-top">
                <a
                  href={tool.pricingUrl}
                  className={`hover:underline ${tool.isLiffio ? "text-[#f5184c]" : "text-[#b20d8f]"}`}
                  {...(tool.pricingUrl.startsWith("http")
                    ? { target: "_blank", rel: "noopener nofollow" }
                    : {})}
                >
                  {tool.name}
                </a>
                {tool.isLiffio ? (
                  <span className="block text-xs font-normal text-gray-500">this site</span>
                ) : null}
              </th>
              {TABLE_COLUMNS.map((column) => (
                <td key={column.key} className="py-3 px-4 text-gray-600">
                  {tool[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
