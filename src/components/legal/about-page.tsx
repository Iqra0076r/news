"use client";

import { ArrowLeft, Globe, ShieldCheck, Newspaper, Users, Rss, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/news-store";

export function AboutPage() {
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

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 p-8 sm:p-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Newspaper className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium tracking-wider uppercase text-red-200">
              About Us
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            SaveitBro News
          </h1>
          <p className="text-lg sm:text-xl text-red-100 leading-relaxed max-w-2xl">
            Your trusted source for real-time news aggregation. We bring together
            stories from the world&apos;s most respected news outlets so you can
            stay informed — all in one place.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-bold">Our Mission</h2>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            At SaveitBro News, our mission is simple: to make it easy for everyone
            to access high-quality journalism from around the world. We believe that
            staying informed should be effortless, which is why we aggregate
            headlines and articles from trusted, reputable sources and present them
            in a clean, fast, and user-friendly interface. Our goal is to be the
            starting point for your daily news journey, connecting you with the
            stories that matter most.
          </p>
        </div>
      </section>

      <Separator />

      {/* What We Do */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Rss className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-bold">What We Do</h2>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            SaveitBro News is a real-time news aggregation platform. We continuously
            monitor and collect news articles from a curated list of trusted RSS feeds
            provided by world-renowned news organizations. Our system automatically
            fetches, organizes, and categorizes the latest headlines across 13
            different news categories, including:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Top Stories",
              "World",
              "UK",
              "Asia",
              "Middle East",
              "Africa",
              "Business",
              "Technology",
              "Science & Environment",
              "Sport",
              "Football",
              "Cricket",
              "Entertainment & Arts",
            ].map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2"
              >
                <Globe className="h-3.5 w-3.5 text-red-500/60" />
                {cat}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our platform updates automatically throughout the day, ensuring you
            always have access to the most recent headlines. You can browse by
            category, search for specific topics, and save articles to read later.
          </p>
        </div>
      </section>

      <Separator />

      {/* Our Commitment to Accuracy */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-bold">Our Commitment to Accuracy &amp; Editorial Integrity</h2>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Editorial integrity is at the core of everything we do. While we do not
            produce original news content ourselves, we take our responsibility as an
            aggregator very seriously. Here is how we uphold the highest standards:
          </p>
          <ul className="space-y-3">
            {[
              {
                title: "Trusted Sources Only",
                desc: "We only aggregate from established, reputable news organizations with a proven track record of journalistic excellence.",
              },
              {
                title: "No Alteration of Content",
                desc: "We present article headlines, descriptions, and summaries exactly as published by the original source. We never edit, spin, or alter the meaning of the content.",
              },
              {
                title: "Proper Attribution",
                desc: "Every article on our platform clearly displays the original source and provides a direct link to the full article on the publisher's website.",
              },
              {
                title: "Real-Time Updates",
                desc: "Our feeds are refreshed every 10 minutes to ensure you are reading the most current information available.",
              },
              {
                title: "Transparent About Our Role",
                desc: "We are upfront about being an aggregator. We do not claim authorship of any news content, and we encourage readers to visit original publishers.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600 dark:bg-red-400" />
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Separator />

      {/* How We Source Content */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Rss className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-bold">How We Source Content</h2>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            All content on SaveitBro News is sourced through publicly available RSS
            (Really Simple Syndication) feeds. RSS is an industry-standard technology
            used by news organizations to distribute their latest headlines and
            articles. Our system works as follows:
          </p>
          <ol className="space-y-3">
            {[
              {
                step: "1",
                title: "Feed Monitoring",
                desc: "We continuously poll RSS feeds from trusted publishers at regular intervals.",
              },
              {
                step: "2",
                title: "Parsing & Structuring",
                desc: "Incoming XML data is parsed, structured, and categorized into our 13 news categories.",
              },
              {
                step: "3",
                title: "Deduplication",
                desc: "Articles are deduplicated to prevent showing the same story multiple times.",
              },
              {
                step: "4",
                title: "Presentation",
                desc: "Cleaned and organized articles are presented to you with headlines, descriptions, images, and direct links to the original source.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All content remains the intellectual property of its respective publishers.
            We encourage all readers to visit the original source websites to read the
            full articles and support quality journalism.
          </p>
        </div>
      </section>

      <Separator />

      {/* Our Team */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-bold">Our Team</h2>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            SaveitBro News is built and maintained by a dedicated team of technologists
            and news enthusiasts who are passionate about making quality journalism
            accessible to everyone. Our team combines expertise in web development,
            data engineering, and user experience design to create a seamless news
            browsing experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {[
              {
                title: "Engineering",
                desc: "Building and maintaining the infrastructure that powers our real-time aggregation platform, ensuring speed and reliability.",
              },
              {
                title: "Product & Design",
                desc: "Crafting a clean, intuitive user experience that makes it effortless to discover and read the news that matters.",
              },
              {
                title: "Content Curation",
                desc: "Selecting and monitoring trusted news sources, ensuring our feeds maintain the highest editorial standards.",
              },
            ].map((team) => (
              <div
                key={team.title}
                className="rounded-lg bg-muted/50 p-4 space-y-2"
              >
                <h3 className="text-sm font-semibold">{team.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {team.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Note */}
      <div className="rounded-xl border border-border/50 bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Have questions about SaveitBro News? We&apos;d love to hear from you.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setView("contact")}
          className="mt-3"
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
}
