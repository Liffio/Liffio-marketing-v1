const AUTOMATION_TYPES = [
  {
    name: "Comment-to-DM",
    description:
      "Sends a DM when someone comments a keyword on a post or Reel. The trigger fires after a configurable 10–60 second delay. A public reply can also post under the comment at the same time.",
  },
  {
    name: "Story reply",
    description:
      "Auto-responds when someone replies to your Instagram story or reacts to it. Useful for story-based lead collection and product drops.",
  },
  {
    name: "Live reply",
    description:
      "Responds to keyword comments during an Instagram live stream. Runs in real time without interrupting the broadcast.",
  },
  {
    name: "DM reply",
    description:
      "Sends a pre-written reply when an incoming DM contains a keyword. Works for any DM sent to your account.",
  },
  {
    name: "Ask Follow",
    description:
      "Delivers content (link, code, file) only after the user follows you. The follow is verified before the DM sends.",
  },
  {
    name: "Smart Re-engage",
    description:
      "Sends a win-back message to contacts who engaged in the past but have gone quiet. Time gap and message are configurable.",
  },
  {
    name: "Collect Data",
    description:
      "Captures lead information — name, email, phone, or custom fields — through a guided DM conversation.",
  },
  {
    name: "Welcome New Followers",
    description:
      "Sends an automatic DM to each new follower within the configured delay. Runs 24/7 without manual action.",
  },
] as const;

const COMPLIANCE_FACTS = [
  {
    heading: "Instagram allows DM automation through its official API",
    body:
      "Meta publishes the Instagram Messaging API as part of its developer platform. Tools that authenticate via OAuth — rather than logging in with a password or using browser automation — are permitted under Instagram's platform policy. Liffio uses only the official API.",
  },
  {
    heading: "Account safety depends on how the tool connects",
    body:
      "Instagram restricts tools that simulate a logged-in user in a browser (often called 'bots'). It does not restrict tools that connect through the official OAuth flow. The distinction is authorization method, not action type. Liffio authorizes through Meta's developer OAuth — the same method used by any official third-party app.",
  },
  {
    heading: "Send delays reduce the risk of rate limiting",
    body:
      "Liffio sends DMs after a 10–60 second delay (configurable). Instant bulk sends are more likely to trigger Instagram's rate limits. A short, human-like delay distributes sends over time and matches how a person would respond.",
  },
] as const;

export default function SeoDiscoverabilitySection() {
  return (
    <section
      aria-labelledby="seo-section-heading"
      className="bg-white py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">

        <div>
          <h2
            id="seo-section-heading"
            className="text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            The 8 automation types Liffio supports
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Each automation runs independently. You can have multiple active at the same time on the same account.
          </p>
          <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AUTOMATION_TYPES.map(({ name, description }) => (
              <div key={name} className="rounded-2xl border border-gray-100 bg-[#faf9ff] p-5">
                <dt className="text-sm font-bold text-[#0a0a0a]">{name}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">{description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2
            className="text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Instagram DM automation and platform compliance
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {COMPLIANCE_FACTS.map(({ heading, body }) => (
              <div key={heading} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#0a0a0a] leading-snug">{heading}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2
            className="text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Who uses Instagram DM automation
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#0a0a0a]">Creators and influencers (5K–500K followers)</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Comment-to-DM for lead magnets, digital products, discount codes, and giveaway entries.
                The automation handles the inbox volume so creators can spend time on content, not replies.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#0a0a0a]">DTC brands and e-commerce</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Product launch automation: a Reel drop, a comment keyword, and a DM with the buy link.
                Story replies for flash sales. Welcome DMs for new followers with a first-order code.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#0a0a0a]">Coaches and course creators</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                DM sequences that qualify leads before a sales call. Collect email addresses via the
                Collect Data automation. Follow-up flows for prospects who engaged but haven't booked.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#0a0a0a]">Agencies managing multiple accounts</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                One Liffio workspace for unlimited client Instagram accounts. White-label workspaces on the
                Agency plan. Separate analytics per account with team access controls.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
