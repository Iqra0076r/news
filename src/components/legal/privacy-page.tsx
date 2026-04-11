"use client";

import { ArrowLeft, ShieldCheck, Cookie, Eye, Globe, Lock, Bell, Database, Baby, RefreshCw, Scale, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/news-store";

export function PrivacyPage() {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView("home")}
        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: January 15, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* 1. Introduction */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Scale className="h-5 w-5 text-red-600 dark:text-red-400" />
            1. Introduction
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              SaveitBro News (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the website
              saveitbro.com (the &quot;Service&quot;). This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you visit
              our website. Please read this Privacy Policy carefully. By accessing or
              using the Service, you acknowledge that you have read, understood, and
              agree to be bound by the terms of this Privacy Policy.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are committed to protecting your personal privacy and ensuring
              transparency about our data practices. If you do not agree with the
              terms of this Privacy Policy, please do not access the Service.
            </p>
          </div>
        </section>

        <Separator />

        {/* 2. Information We Collect */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Database className="h-5 w-5 text-red-600 dark:text-red-400" />
            2. Information We Collect
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              SaveitBro News is primarily a news aggregation service. We do not
              require you to create an account or provide personal information to
              use our core service. However, we may automatically collect certain
              information when you visit our website:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  2.1 Automatically Collected Information
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  When you access our Service, we automatically collect certain
                  information about your device and usage, including:
                </p>
                <ul className="space-y-2 ml-1">
                  {[
                    "IP address (Internet Protocol address)",
                    "Browser type and version (e.g., Chrome, Firefox, Safari)",
                    "Operating system (e.g., Windows, macOS, iOS, Android)",
                    "Device type (desktop, mobile, tablet)",
                    "Pages visited, time spent on pages, and navigation patterns",
                    "Referring website or source that led you to our Service",
                    "Date and time of your visit",
                    "Screen resolution and language preferences",
                    "Interaction with website elements (clicks, scroll depth)",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">
                  2.2 Voluntarily Provided Information
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you choose to contact us through our contact form, we collect
                  the information you provide, such as your name, email address, and
                  the content of your message. This information is used solely to
                  respond to your inquiry.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">
                  2.3 Bookmarks and Preferences
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you save articles using our bookmark feature, your bookmarked
                  article IDs are stored locally in your browser&apos;s localStorage.
                  This data never leaves your device and is not transmitted to our
                  servers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* 3. How We Use Information */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Eye className="h-5 w-5 text-red-600 dark:text-red-400" />
            3. How We Use Your Information
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use the information we collect for the following purposes:
            </p>
            <ul className="space-y-3">
              {[
                {
                  title: "Service Operation",
                  desc: "To provide, maintain, and improve our news aggregation service, including content delivery, caching, and performance optimization.",
                },
                {
                  title: "Personalization",
                  desc: "To personalize your experience, such as remembering your theme preference (light/dark mode) and displaying content relevant to your interests.",
                },
                {
                  title: "Advertising",
                  desc: "To display advertisements on our website through our advertising partners, including Media.net, and to serve relevant ads based on your browsing activity and interests.",
                },
                {
                  title: "Analytics",
                  desc: "To analyze usage patterns and trends, measure the effectiveness of our content, and understand how visitors interact with our Service using analytics tools like Google Analytics.",
                },
                {
                  title: "Communication",
                  desc: "To respond to your inquiries, provide customer support, and send you important updates about our Service (if you have opted in to receive such communications).",
                },
                {
                  title: "Security",
                  desc: "To detect, prevent, and address technical issues, security threats, fraud, and abusive activities.",
                },
                {
                  title: "Legal Compliance",
                  desc: "To comply with applicable laws, regulations, legal processes, or governmental requests.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  <div>
                    <span className="text-sm font-semibold">{item.title}:</span>{" "}
                    <span className="text-sm text-muted-foreground">
                      {item.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Separator />

        {/* 4. Cookies and Tracking Technologies */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Cookie className="h-5 w-5 text-red-600 dark:text-red-400" />
            4. Cookies and Tracking Technologies
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track activity on
              our Service and hold certain information. Cookies are files with a
              small amount of data that are sent to your browser from a website and
              stored on your device. You can instruct your browser to refuse all
              cookies or to indicate when a cookie is being sent. However, if you do
              not accept cookies, you may not be able to use some portions of our
              Service.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">4.1 Types of Cookies We Use</h3>
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted/50 p-4 space-y-1">
                    <h4 className="text-sm font-semibold">Essential / Strictly Necessary Cookies</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      These cookies are required for the Service to function
                      properly. They enable core features such as page navigation,
                      cookie consent preferences, and theme settings. The Service
                      cannot function properly without these cookies.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 space-y-1">
                    <h4 className="text-sm font-semibold">Analytics / Performance Cookies</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      These cookies allow us to count visits and traffic sources so
                      we can measure and improve the performance of our Service.
                      They help us understand which pages are the most and least
                      popular and see how visitors move around the Service. We use
                      Google Analytics for this purpose.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 space-y-1">
                    <h4 className="text-sm font-semibold">Advertising / Targeting Cookies</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      These cookies are used by our advertising partners, including
                      Media.net, to deliver personalized advertisements based on your
                      browsing behavior and interests. They may also be used by
                      advertising networks to build a profile of your interests and
                      show you relevant ads on other websites. These cookies track
                      your browsing activity across different websites.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 space-y-1">
                    <h4 className="text-sm font-semibold">Functionality / Preference Cookies</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      These cookies enable the Service to provide enhanced
                      functionality and personalization. They may be set by us or by
                      third-party providers whose services we have added to our
                      pages. Examples include your bookmarked articles stored in
                      localStorage and your preferred display theme.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">
                  4.2 Third-Party Cookies
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  In addition to our own cookies, we may use cookies from the
                  following third parties:
                </p>
                <ul className="space-y-2 mt-2 ml-1">
                  {[
                    {
                      name: "Media.net (Yahoo! / Bing Network)",
                      purpose: "Serving and measuring the performance of advertisements, interest-based targeting, frequency capping, and ad fraud prevention.",
                    },
                    {
                      name: "Google Analytics",
                      purpose: "Website analytics, visitor behavior analysis, audience demographics, and reporting.",
                    },
                    {
                      name: "Google AdSense",
                      purpose: "Serving and personalizing advertisements based on user interests and browsing history.",
                    },
                  ].map((cookie) => (
                    <li key={cookie.name} className="flex gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                      <div>
                        <span className="font-medium text-foreground">{cookie.name}:</span>{" "}
                        {cookie.purpose}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* 5. Third-Party Services */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe className="h-5 w-5 text-red-600 dark:text-red-400" />
            5. Third-Party Services
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use third-party services that collect, monitor, and analyze
              information to improve our Service and serve relevant advertising.
              These third parties have their own privacy policies that we encourage
              you to review:
            </p>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <h3 className="text-sm font-semibold">5.1 Media.net — Advertising Partner</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use Media.net as our primary advertising partner to display
                  advertisements on our website. Media.net is a leading contextual
                  advertising technology company powered by the Yahoo! Bing Network.
                  When you visit our website, Media.net may use cookies, web beacons,
                  and similar technologies to:
                </p>
                <ul className="space-y-1 ml-1">
                  {[
                    "Serve personalized advertisements based on your browsing behavior and interests",
                    "Measure the effectiveness of ad campaigns",
                    "Perform frequency capping to limit the number of times you see the same ad",
                    "Detect and prevent ad fraud",
                    "Collect information about your device, browser, and geographic location",
                    "Build interest segments for targeting purposes",
                  ].map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  For more information about Media.net&apos;s privacy practices, please visit{" "}
                  <a
                    href="https://www.media.net/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    media.net/privacy-policy
                  </a>.
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <h3 className="text-sm font-semibold">5.2 Google Analytics — Web Analytics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use Google Analytics to track and analyze website traffic. Google
                  Analytics uses cookies to collect information about how visitors use
                  our website, including pages visited, time spent, and navigation
                  paths. This information is aggregated and anonymous. Google Analytics
                  may also collect demographic and interest data.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You can opt out of Google Analytics tracking by installing the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For more information, see{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Google&apos;s Privacy Policy
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* 6. Interest-Based Advertising */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
            6. Interest-Based Advertising &amp; Targeted Ads
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Interest-based advertising (also known as targeted advertising or
              personalized advertising) uses information about your browsing
              activity across different websites to show you ads that are more
              relevant to your interests. SaveitBro News participates in
              interest-based advertising through our partners.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">6.1 How It Works</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When you visit our website, our advertising partners (including
                  Media.net and Google) may place cookies on your device to:
                </p>
                <ul className="space-y-2 mt-2 ml-1">
                  {[
                    "Understand your interests based on the content you view and your browsing history",
                    "Classify you into interest categories (e.g., technology enthusiast, sports fan)",
                    "Display advertisements that match your inferred interests",
                    "Measure whether you have seen an ad before and avoid showing it repeatedly",
                    "Report on ad performance to advertisers",
                  ].map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">6.2 Media.net Advertising</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Media.net serves contextual and behavioral advertisements on our
                  platform. Media.net&apos;s advertising technology considers:
                </p>
                <ul className="space-y-2 mt-2 ml-1">
                  {[
                    "The content of the page you are currently viewing (contextual targeting)",
                    "Your recent browsing activity across sites in the Media.net network",
                    "Your geographic location",
                    "Your device type and browser",
                    "General interest categories inferred from your online activity",
                  ].map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  Media.net does not collect personally identifiable information
                  (such as your name, email address, or phone number) for
                  advertising purposes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* 7. User Choices */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
            7. Your Choices &amp; Opt-Out Options
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We believe in giving you control over your data. Here are the ways
              you can manage your privacy preferences:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">7.1 Cookie Settings</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When you first visit our website, you will be presented with a
                  cookie consent banner. You can choose to:
                </p>
                <ul className="space-y-2 mt-2 ml-1">
                  {[
                    "Accept all cookies (including analytics and advertising cookies)",
                    "Accept only necessary cookies (reject analytics and advertising cookies)",
                    "Manage your preferences at any time through your browser settings",
                  ].map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">7.2 Browser Controls</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Most web browsers allow you to control cookies through their
                  settings. You can typically:
                </p>
                <ul className="space-y-2 mt-2 ml-1">
                  {[
                    "View and delete existing cookies",
                    "Block cookies from specific or all websites",
                    "Set your browser to notify you when a cookie is being set",
                    "Block third-party cookies",
                  ].map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  Please note that disabling cookies may affect the functionality
                  of our Service.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">7.3 Opting Out of Interest-Based Advertising</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You can opt out of interest-based advertising from our partners:
                </p>
                <ul className="space-y-2 mt-2 ml-1">
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                    <span>
                      <span className="font-medium text-foreground">Media.net:</span> Visit{" "}
                      <a
                        href="https://www.media.net/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        media.net/privacy-policy
                      </a>{" "}
                      for opt-out instructions
                    </span>
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                    <span>
                      <span className="font-medium text-foreground">Google:</span> Visit{" "}
                      <a
                        href="https://adssettings.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Google Ads Settings
                      </a>{" "}
                      to manage your ad preferences
                    </span>
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                    <span>
                      <span className="font-medium text-foreground">Network Advertising Initiative (NAI):</span> Visit{" "}
                      <a
                        href="https://optout.networkadvertising.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        optout.networkadvertising.org
                      </a>{" "}
                      to opt out of NAI member ads
                    </span>
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                    <span>
                      <span className="font-medium text-foreground">Digital Advertising Alliance (DAA):</span> Visit{" "}
                      <a
                        href="https://optout.aboutads.info"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        optout.aboutads.info
                      </a>{" "}
                      to opt out of DAA member ads
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">7.4 Do Not Track</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Some browsers support a &quot;Do Not Track&quot; (DNT) feature that signals
                  to websites your preference not to be tracked. Our Service
                  respects DNT signals where technically feasible. When we detect a
                  DNT signal, we will not use tracking cookies for analytics or
                  advertising purposes beyond what is strictly necessary for the
                  Service to function.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* 8. Data Retention */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Database className="h-5 w-5 text-red-600 dark:text-red-400" />
            8. Data Retention
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We retain your information only for as long as necessary to fulfill
              the purposes described in this Privacy Policy, unless a longer
              retention period is required or permitted by law.
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "Server logs are retained for up to 90 days and then automatically deleted.",
                "Analytics data collected via Google Analytics is retained for 26 months (Google's default retention period).",
                "Cookie consent preferences are stored in your browser and persist until cleared.",
                "Contact form submissions are retained for up to 12 months for support purposes.",
                "Data shared with our advertising partners (Media.net, Google) is subject to their own retention policies.",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Separator />

        {/* 9. Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Baby className="h-5 w-5 text-red-600 dark:text-red-400" />
            9. Children&apos;s Privacy
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              SaveitBro News is a general-audience news platform and is not directed
              at children under the age of 13 (or under 16 in certain jurisdictions).
              We do not knowingly collect personal information from children. If you
              are a parent or guardian and believe that your child has provided us
              with personal information, please contact us immediately at{" "}
              <a
                href="mailto:privacy@saveitbro.com"
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                privacy@saveitbro.com
              </a>{" "}
              and we will take steps to delete such information from our records.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In compliance with the Children&apos;s Online Privacy Protection Act
              (COPPA), we will promptly remove any personal information collected
              from children under 13 upon notification.
            </p>
          </div>
        </section>

        <Separator />

        {/* 10. Data Security */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
            10. Data Security
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security
              measures to protect your information against unauthorized access,
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "HTTPS/TLS encryption for all data in transit",
                "Regular security assessments and vulnerability scanning",
                "Access controls limiting data access to authorized personnel only",
                "Monitoring and logging of system access for anomaly detection",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              However, no method of transmission over the Internet or electronic
              storage is 100% secure. While we strive to protect your personal
              information, we cannot guarantee its absolute security.
            </p>
          </div>
        </section>

        <Separator />

        {/* 11. International Data Transfers */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe className="h-5 w-5 text-red-600 dark:text-red-400" />
            11. International Data Transfers
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our Service is operated from India and may involve the transfer of
              your information to other countries where our service providers
              (including Media.net and Google) operate. These countries may have
              data protection laws that differ from your jurisdiction. By using our
              Service, you consent to such transfers. We take appropriate measures
              to ensure that your data is handled in accordance with this Privacy
              Policy and applicable data protection laws.
            </p>
          </div>
        </section>

        <Separator />

        {/* 12. GDPR / CCPA Compliance */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Scale className="h-5 w-5 text-red-600 dark:text-red-400" />
            12. GDPR &amp; CCPA Compliance
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">
                12.1 General Data Protection Regulation (GDPR) — EU Users
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you are a resident of the European Economic Area (EEA), you have
                certain data protection rights under the GDPR. We process your data
                under the following lawful bases:
              </p>
              <ul className="space-y-2 mt-2 ml-1">
                {[
                  "Legitimate interest: To operate and improve our Service",
                  "Consent: Where you have given consent (e.g., for non-essential cookies)",
                  "Contract: Where necessary to provide the Service",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Under the GDPR, you have the right to:
              </p>
              <ul className="space-y-2 mt-2 ml-1">
                {[
                  "Access: Request a copy of the personal data we hold about you",
                  "Rectification: Request correction of inaccurate or incomplete data",
                  "Erasure: Request deletion of your personal data (&quot;right to be forgotten&quot;)",
                  "Restriction: Request that we restrict the processing of your data",
                  "Portability: Request a copy of your data in a structured, machine-readable format",
                  "Objection: Object to the processing of your personal data for marketing purposes",
                  "Withdraw consent: Withdraw your consent at any time where processing is based on consent",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@saveitbro.com"
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  privacy@saveitbro.com
                </a>. We will respond to your request within 30 days.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">
                12.2 California Consumer Privacy Act (CCPA) — California Users
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you are a California resident, the CCPA provides you with the
                following rights:
              </p>
              <ul className="space-y-2 mt-2 ml-1">
                {[
                  "Right to know: Request disclosure of the personal data we have collected about you in the past 12 months",
                  "Right to delete: Request deletion of your personal data",
                  "Right to correct: Request correction of inaccurate personal data",
                  "Right to opt-out: Opt out of the sale or sharing of your personal information for advertising purposes",
                  "Right to non-discrimination: We will not discriminate against you for exercising your CCPA rights",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                We do not sell your personal information. However, we may share
                certain data with advertising partners as described in this policy.
                To exercise your CCPA rights, please contact us at{" "}
                <a
                  href="mailto:privacy@saveitbro.com"
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  privacy@saveitbro.com
                </a>.
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                <strong>Data Controller:</strong> SaveitBro Media Pvt. Ltd. is the
                data controller responsible for your personal data. For any
                privacy-related inquiries, contact our Data Protection Officer at{" "}
                <a
                  href="mailto:privacy@saveitbro.com"
                  className="underline hover:no-underline"
                >
                  privacy@saveitbro.com
                </a>.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* 13. Changes to This Policy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-red-600 dark:text-red-400" />
            13. Changes to This Privacy Policy
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes
              in our practices, technologies, legal requirements, or other factors.
              When we make material changes, we will:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "Update the &quot;Last updated&quot; date at the top of this page",
                "Display a notice on our website for a reasonable period",
                "Update our cookie consent banner if necessary",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We encourage you to review this Privacy Policy periodically to stay
              informed about how we protect your information. Your continued use
              of the Service after any changes constitutes your acceptance of the
              updated Privacy Policy.
            </p>
          </div>
        </section>

        <Separator />

        {/* 14. Contact Information */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
            14. Contact Us
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">SaveitBro Media Pvt. Ltd.</span>
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Email:</span>{" "}
                <a
                  href="mailto:privacy@saveitbro.com"
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  privacy@saveitbro.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">General Inquiries:</span>{" "}
                <a
                  href="mailto:contact@saveitbro.com"
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  contact@saveitbro.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Address:</span> New Delhi, India
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Website:</span>{" "}
                <a
                  href="https://saveitbro.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  saveitbro.com
                </a>
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We will endeavor to respond to all legitimate privacy-related
              requests within 30 days of receipt.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
