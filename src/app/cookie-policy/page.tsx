import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { normalizePolicyContent } from "@/lib/legal/normalize-policy";
import { buildPageMetadata } from "@/config/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy — Liffio",
  description: "Learn how Liffio uses cookies and tracking technologies to improve your experience.",
  pathname: "/cookie-policy",
  ogImagePath: "/og/homepage.png",
});

const CONTENT = `
This Cookie Policy explains how Reactova uses cookies and similar technologies to recognise you when you visit our website. It explains what these technologies are and why we use them.

1. What are Cookies?
Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.

2. Why do we use Cookies?
We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our platform to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our platform.

3. Types of Cookies we use:
- Essential Website Cookies: These cookies are strictly necessary to provide you with services available through our platform and to use some of its features, such as access to secure areas.
- Performance and Functionality Cookies: These cookies are used to enhance the performance and functionality of our platform but are non-essential to their use.
- Analytics and Customisation Cookies: These cookies collect information that is used either in aggregate form to help us understand how our platform is being used or how effective our marketing campaigns are.

4. How can I control Cookies?
You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our platform though your access to some functionality and areas may be restricted.

5. How often will you update this Cookie Policy?
We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.

6. Where can I get further information?
If you have any questions about our use of cookies or other technologies, please email us at support@reactova.com.
`

const content = normalizePolicyContent(CONTENT.trim());

export default function CookiePolicyPage() {
  return <LegalPage title="Cookie Policy" lastUpdated="June 2026" content={content} />;
}
