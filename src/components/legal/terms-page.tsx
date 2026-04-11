"use client";

import { ArrowLeft, FileText, Users, ShieldAlert, Copyright, AlertTriangle, ExternalLink, RefreshCw, Scale, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/news-store";

export function TermsPage() {
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
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: January 15, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* 1. Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            1. Acceptance of Terms
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Welcome to SaveitBro News. By accessing or using the website
              saveitbro.com (the &quot;Service&quot;), you agree to be bound by these
              Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you
              may not access or use the Service.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These Terms constitute a legally binding agreement between you
              (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and SaveitBro Media Pvt. Ltd.
              (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), the operator of the Service.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We reserve the right to modify, update, or replace any part of these
              Terms at our sole discretion. It is your responsibility to check these
              Terms periodically for changes. Your continued use of the Service
              after any modifications constitutes acceptance of the updated Terms.
            </p>
          </div>
        </section>

        <Separator />

        {/* 2. Description of Service */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
            2. Description of Service
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              SaveitBro News is a real-time news aggregation platform. The Service
              provides the following features:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "Aggregation of news headlines and articles from publicly available RSS feeds provided by trusted third-party news publishers",
                "Categorization of news across 13 categories: Top Stories, World, UK, Asia, Middle East, Africa, Business, Technology, Science & Environment, Sport, Football, Cricket, and Entertainment & Arts",
                "Search functionality to find articles across all categories",
                "Article bookmarking (stored locally in your browser)",
                "Responsive web design for desktop and mobile devices",
                "Light and dark theme options",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Service does not produce original news content. All articles,
              headlines, and descriptions are sourced from third-party publishers and
              remain the intellectual property of their respective owners. We provide
              links to the original source for every article.
            </p>
          </div>
        </section>

        <Separator />

        {/* 3. User Conduct */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-red-600 dark:text-red-400" />
            3. User Conduct
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              By using the Service, you agree that you will:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "Use the Service only for lawful purposes and in accordance with these Terms",
                "Not use the Service in any way that violates any applicable local, national, or international law or regulation",
                "Not attempt to gain unauthorized access to any portion of the Service, other accounts, computer systems, or networks connected to the Service",
                "Not use any automated means (bots, scrapers, spiders, etc.) to access, collect, or extract data from the Service beyond what is permitted",
                "Not interfere with or disrupt the Service or servers or networks connected to the Service",
                "Not upload, transmit, or distribute any viruses, malware, or other harmful code",
                "Not impersonate any person or entity or falsely represent your affiliation with any person or entity",
                "Not use the Service to send spam, unsolicited messages, or promotional material",
                "Not attempt to circumvent, disable, or interfere with any security features of the Service",
                "Not use the Service in any manner that could damage, disable, overburden, or impair the Service",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We reserve the right to restrict or terminate your access to the
              Service at any time, without notice, for conduct that we believe
              violates these Terms or is harmful to other users, us, or third
              parties.
            </p>
          </div>
        </section>

        <Separator />

        {/* 4. Intellectual Property */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Copyright className="h-5 w-5 text-red-600 dark:text-red-400" />
            4. Intellectual Property
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">4.1 Our Content</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The SaveitBro News name, logo, website design, user interface,
                and proprietary technology (excluding aggregated news content) are
                the intellectual property of SaveitBro Media Pvt. Ltd. and are
                protected by applicable copyright, trademark, and other intellectual
                property laws. You may not reproduce, distribute, modify, or create
                derivative works from our proprietary content without our prior
                written permission.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">4.2 Third-Party News Content</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All news articles, headlines, descriptions, images, and other
                content aggregated on the Service are the intellectual property of
                their respective publishers and content creators. We do not claim
                ownership, authorship, or editorial control over any third-party
                news content displayed on the Service.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Such content is displayed on the Service under the terms of the
                original publishers&apos; RSS feed licenses and applicable copyright
                laws. We always provide clear attribution and direct links to the
                original source. Any use of third-party content beyond what is
                provided through the Service must comply with the original
                publisher&apos;s terms of use.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">4.3 Trademarks</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All trademarks, service marks, and trade names used on the Service
                (including publisher names, logos, and brand identifiers) are the
                property of their respective owners. The use of any trademark on the
                Service is for identification and attribution purposes only and does
                not imply endorsement, sponsorship, or affiliation.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* 5. Disclaimer of Warranties */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            5. Disclaimer of Warranties
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS,
              WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE
              FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES,
              INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "Implied warranties of merchantability, fitness for a particular purpose, and non-infringement",
                "Warranties that the Service will be uninterrupted, timely, secure, or error-free",
                "Warranties that the results obtained from the use of the Service will be accurate or reliable",
                "Warranties regarding the quality, accuracy, reliability, or completeness of any news content aggregated from third-party sources",
                "Warranties that any defects or errors in the Service will be corrected",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You understand and agree that your use of the Service is at your sole
              risk. No advice or information, whether oral or written, obtained by
              you from the Service shall create any warranty not expressly stated in
              these Terms.
            </p>
          </div>
        </section>

        <Separator />

        {/* 6. Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
            6. Limitation of Liability
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
              SAVEITBRO MEDIA PVT. LTD., ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS,
              SUPPLIERS, OR AFFILIATES BE LIABLE FOR:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "Any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses",
                "Damages arising from your use of or inability to use the Service",
                "Damages arising from any unauthorized access to or alteration of your transmissions or data",
                "Damages arising from any statements or conduct of any third party on the Service",
                "Damages arising from any errors, inaccuracies, omissions, or delays in the news content aggregated from third-party sources",
                "Damages resulting from any interruption or cessation of the Service, whether temporary or permanent",
                "Damages related to any advertising or third-party content displayed on the Service",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In jurisdictions that do not allow the exclusion or limitation of
              liability for consequential or incidental damages, our liability
              shall be limited to the greatest extent permitted by law.
            </p>
          </div>
        </section>

        <Separator />

        {/* 7. Advertising */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-red-600 dark:text-red-400" />
            7. Advertising
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Service is supported by advertising. We display advertisements
              through third-party advertising partners, including but not limited
              to:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "HilltopAds (powered by the Yahoo! Bing Network) — contextual and behavioral advertising",
                "Google AdSense — display and interest-based advertising",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You acknowledge and agree that:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "Advertisements displayed on the Service are delivered by third-party ad networks and are not endorsed by SaveitBro News",
                "We do not control the content of third-party advertisements and are not responsible for any claims, products, or services offered in such advertisements",
                "Third-party advertisers may use cookies and tracking technologies to serve personalized ads (see our Privacy Policy for more details)",
                "Clicking on advertisements may direct you to third-party websites, which are governed by their own terms of service and privacy policies",
                "Any transactions or interactions you have with advertisers found on or through the Service, including payment and delivery of goods or services, are solely between you and the advertiser",
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

        {/* 8. Links to Third-Party Content */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-red-600 dark:text-red-400" />
            8. Links to Third-Party Content
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Service contains links to third-party websites, including the
              original news publishers and advertiser websites. These links are
              provided for your convenience and reference only. We do not have
              control over the content, privacy policies, or practices of any
              third-party websites.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You acknowledge and agree that:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "We are not responsible for the content, accuracy, legality, or policies of any linked third-party websites",
                "The inclusion of any link does not imply endorsement, sponsorship, or affiliation with the linked website",
                "Your interactions with third-party websites are governed solely by their respective terms and privacy policies",
                "We are not liable for any damages or losses arising from your use of third-party websites",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We recommend that you review the terms of service and privacy policy
              of any third-party website before providing any personal information.
            </p>
          </div>
        </section>

        <Separator />

        {/* 9. Privacy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
            9. Privacy
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your use of the Service is also governed by our{" "}
              <button
                onClick={() => setView("privacy")}
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                Privacy Policy
              </button>
              , which describes how we collect, use, and protect your personal
              information. By using the Service, you also consent to the collection
              and use of your information as described in our Privacy Policy.
            </p>
          </div>
        </section>

        <Separator />

        {/* 10. Indemnification */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Scale className="h-5 w-5 text-red-600 dark:text-red-400" />
            10. Indemnification
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              You agree to defend, indemnify, and hold harmless SaveitBro Media
              Pvt. Ltd., its directors, employees, partners, agents, suppliers, and
              affiliates from and against any and all claims, damages, obligations,
              losses, liabilities, costs, or debt arising from:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "Your use of and access to the Service",
                "Your violation of any term of these Terms",
                "Your violation of any applicable law or the rights of a third party",
                "Any content you submit, post, or transmit through the Service",
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

        {/* 11. Changes to Terms */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-red-600 dark:text-red-400" />
            11. Changes to These Terms
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We reserve the right to modify or replace these Terms at any time at
              our sole discretion. When we make changes, we will:
            </p>
            <ul className="space-y-2 ml-1">
              {[
                "Update the &quot;Last updated&quot; date at the top of this page",
                "Post the revised Terms on this page",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/60 dark:bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Changes will be effective immediately upon posting. Your continued use
              of the Service after any changes to these Terms constitutes acceptance
              of the new Terms. If you do not agree with the modified Terms, you
              should discontinue your use of the Service.
            </p>
          </div>
        </section>

        <Separator />

        {/* 12. Governing Law */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Scale className="h-5 w-5 text-red-600 dark:text-red-400" />
            12. Governing Law &amp; Jurisdiction
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the
              laws of India, without regard to its conflict of law provisions.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Any disputes arising from or in connection with these Terms or the
              use of the Service shall be subject to the exclusive jurisdiction of
              the courts located in New Delhi, India. You hereby consent to the
              personal jurisdiction and venue of such courts and waive any objection
              to the inconvenience of such forum.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For users accessing the Service from outside India, you acknowledge
              that the Service is operated from India and that the laws of India may
              differ from the laws of your jurisdiction. You agree that these Terms
              and any disputes shall be governed by Indian law.
            </p>
          </div>
        </section>

        <Separator />

        {/* 13. Severability */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">13. Severability</h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              If any provision of these Terms is held to be invalid, illegal, or
              unenforceable by a court of competent jurisdiction, such provision
              shall be modified to the minimum extent necessary to make it valid,
              legal, and enforceable, and the remaining provisions shall continue in
              full force and effect. The invalidity of any provision shall not
              affect the validity or enforceability of any other provision of these
              Terms.
            </p>
          </div>
        </section>

        <Separator />

        {/* 14. Entire Agreement */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">14. Entire Agreement</h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              These Terms, together with our{" "}
              <button
                onClick={() => setView("privacy")}
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                Privacy Policy
              </button>
              , constitute the entire agreement between you and SaveitBro Media Pvt.
              Ltd. regarding the use of the Service, and supersede any prior
              agreements we might have had regarding the Service.
            </p>
          </div>
        </section>

        <Separator />

        {/* 15. Contact Information */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
            15. Contact Information
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">SaveitBro Media Pvt. Ltd.</span>
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Email:</span>{" "}
                <a
                  href="mailto:legal@saveitbro.com"
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  legal@saveitbro.com
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
          </div>
        </section>
      </div>
    </div>
  );
}

// Inline CheckCircle icon since it's not imported
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
