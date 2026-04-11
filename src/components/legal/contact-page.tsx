"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/news-store";

export function ContactPage() {
  const setView = useAppStore((s) => s.setView);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Display confirmation (no actual submission)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/saveitbro", handle: "@saveitbro" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/saveitbro", handle: "SaveitBro News" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/saveitbro", handle: "@saveitbro" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/saveitbro", handle: "SaveitBro" },
  ];

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
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium tracking-wider uppercase text-red-200">
              Get in Touch
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-red-100 leading-relaxed max-w-2xl">
            We&apos;d love to hear from you. Whether you have a question, feedback,
            or a partnership inquiry, our team is here to help.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <Mail className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold">Email</h3>
          <a
            href="mailto:contact@saveitbro.com"
            className="text-sm text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            contact@saveitbro.com
          </a>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <Clock className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold">Business Hours</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Monday – Friday<br />
            9:00 AM – 6:00 PM (IST)
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <MapPin className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold">Office</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            SaveitBro Media Pvt. Ltd.<br />
            New Delhi, India
          </p>
        </div>
      </div>

      <Separator />

      {/* Contact Form */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Send Us a Message</h2>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Send className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold">Message Sent!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Thank you for reaching out. We&apos;ll review your message and get
                back to you as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-medium"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg bg-muted/60 border border-border/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg bg-muted/60 border border-border/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-subject"
                  className="text-sm font-medium"
                >
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  required
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg bg-muted/60 border border-border/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell us more..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg bg-muted/60 border border-border/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Fields marked with <span className="text-red-500">*</span> are
                  required.
                </p>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Separator />

      {/* Social Media */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Follow Us</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Stay connected with SaveitBro News on social media for the latest
          updates, trending stories, and behind-the-scenes content.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                <social.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{social.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {social.handle}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Separator />

      {/* Additional Contact Info */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Other Ways to Reach Us</h2>
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
          <div className="flex gap-3">
            <Phone className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Phone</h3>
              <p className="text-sm text-muted-foreground">
                For urgent inquiries, please email us at{" "}
                <a
                  href="mailto:contact@saveitbro.com"
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  contact@saveitbro.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Business Address</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SaveitBro Media Pvt. Ltd.<br />
                New Delhi, 110001<br />
                India
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Mail className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Specific Inquiries</h3>
              <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                <li>
                  <span className="font-medium">General:</span>{" "}
                  <a
                    href="mailto:contact@saveitbro.com"
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    contact@saveitbro.com
                  </a>
                </li>
                <li>
                  <span className="font-medium">Advertising:</span>{" "}
                  <a
                    href="mailto:ads@saveitbro.com"
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    ads@saveitbro.com
                  </a>
                </li>
                <li>
                  <span className="font-medium">Privacy:</span>{" "}
                  <a
                    href="mailto:privacy@saveitbro.com"
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    privacy@saveitbro.com
                  </a>
                </li>
                <li>
                  <span className="font-medium">Legal:</span>{" "}
                  <a
                    href="mailto:legal@saveitbro.com"
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    legal@saveitbro.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Note */}
      <div className="rounded-xl border border-border/50 bg-muted/30 p-6 text-center">
        <Clock className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          We typically respond to all inquiries within 1–2 business days.
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
}
