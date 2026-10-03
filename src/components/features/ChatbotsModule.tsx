import { siteConfig } from "@/config/site.config";
import { TechBadge } from "@/components/TechBadge";

/**
 * Chatbots, shown as a module of their own on the homepage.
 *
 * Chatbots are a separate module from comment to DM automation, so they get
 * their own block rather than a slot in the automation carousel above. That
 * separation is also the selling point: a simple comment to DM automation
 * never needs a flow builder, and a full conversation is there when you want
 * one.
 *
 * 🚩 Every line is from the live plan table (docs/decisions/0006). Business
 * and Agency share a column because Agency is Business per workspace.
 */
const TIERS = [
  {
    name: "Free",
    count: "2 live chatbots",
    color: "#ff7c49",
    items: ["Build and publish a chatbot", "Manage contacts", "Link buttons", "Chat analytics"],
  },
  {
    name: "Starter",
    count: "5 live chatbots",
    color: "#f5184c",
    items: [
      "Questions and conditions",
      "Media messages and personalization",
      "Follow-ups inside a chat",
      "Follow gate, chatbot branding off",
    ],
  },
  {
    name: "Growth",
    count: "15 live chatbots",
    color: "#d0136d",
    items: [
      "Ice breakers and default reply",
      "Story reply and story mention triggers",
      "Chain bots, templates and tags",
      "Start a chatbot from a comment",
    ],
  },
  {
    name: "Business and Agency",
    count: "Unlimited live chatbots",
    color: "#b20d8f",
    items: [
      "Lead capture into the leads list",
      "Webhook step and notify step",
      "A/B testing on a step",
      "Handover routing and business hours",
    ],
  },
] as const;

export default function ChatbotsModule() {
  return (
    <div
      id="chatbots"
      className="card-base mt-12 p-5 sm:p-8 lg:mt-20"
      style={{ background: "linear-gradient(155deg, #ffffff 0%, #ffffff 55%, #fafafa 100%)" }}
    >
      <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="max-w-xl">
          <TechBadge label="Chatbots" variant="section" className="mb-4" />
          <h3
            className="text-2xl font-extrabold leading-tight text-[#0a0a0a] sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Chatbots. <span className="text-foreground">A module of its own.</span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
            Comment to DM stays simple, with no flow builder to learn. When you want a full
            conversation in the DM, chatbots ask questions, branch on the answers, send media and
            buttons, and follow up inside the chat. 2 live chatbots on Free, unlimited DMs on every
            plan.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
          {[
            { label: "Separate from automations", color: "#ff7c49" },
            { label: "2 live chatbots free", color: "#f5184c" },
            { label: "Leads straight to your list", color: "#b20d8f" },
          ].map((chip) => (
            <TechBadge key={chip.label} label={chip.label} variant="chip" accent={chip.color} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="rounded-2xl border bg-white p-4"
            style={{ borderColor: `${tier.color}33`, boxShadow: `0 6px 24px ${tier.color}0d` }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: tier.color }}>
              {tier.name}
            </p>
            <p
              className="mt-1 text-base font-bold text-[#0a0a0a]"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              {tier.count}
            </p>
            <ul className="mt-3 space-y-1.5">
              {tier.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                  <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
                    <circle cx="8" cy="8" r="8" fill={`${tier.color}14`} />
                    <path
                      d="M4.5 8.5l2 2 4.5-5"
                      stroke={tier.color}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <a
          href={siteConfig.urls.appSignup}
          id="chatbots-cta"
          className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm active:scale-[0.98]"
        >
          Build a chatbot free
        </a>
        <a href="/pricing" className="text-sm font-semibold text-gray-600 underline underline-offset-4 hover:text-[#0a0a0a]">
          Compare chatbot limits by plan
        </a>
      </div>
    </div>
  );
}
