"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function getInitialContactContext() {
  const params = new URLSearchParams(window.location.search);
  const requestedTopic = params.get("topic");
  const source = params.get("source");
  const simulation = params.get("simulation");

  if (requestedTopic === "business-simulator") {
    return {
      topic: "business-simulator",
      message: `I want to explore a Business Simulator pilot${simulation ? ` based on "${simulation}"` : ""}. I can provide one spreadsheet decision and a few scenarios to model.`,
    };
  }

  if (source === "simulator-result") {
    return { topic: "enterprise", message: "" };
  }

  return { topic: "reux", message: "" };
}

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [topic, setTopic] = useState("reux");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => {
      const context = getInitialContactContext();
      setTopic(context.topic);
      setMessage(context.message);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    // Mocking an API call
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen relative">
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-[#00F0FF] rounded-full blur-[200px] mix-blend-screen opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-400">
            Have questions about Reux, the Business Simulator, PLOS, or enterprise simulation capabilities? We would love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="glass-card p-8 rounded-2xl border border-white/10"
        >
          {status === "success" ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Message Sent</h2>
              <p className="text-gray-400 mb-8">
                Thanks for reaching out. We will get back to you shortly.
              </p>
              <Button onClick={() => setStatus("idle")} variant="outline">
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
                  <Input id="name" required placeholder="John Doe" className="bg-black/50 border-white/10 text-white placeholder:text-gray-600" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                  <Input id="email" type="email" required placeholder="john@example.com" className="bg-black/50 border-white/10 text-white placeholder:text-gray-600" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="topic" className="text-sm font-medium text-gray-300">Topic</label>
                <select 
                  id="topic" 
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="business-simulator">Business Simulator Pilot</option>
                  <option value="reux">Reux / Developer Preview</option>
                  <option value="enterprise">Enterprise Simulation</option>
                  <option value="plos">PLOS Early Access</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                <textarea 
                  id="message" 
                  required 
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="How can we help?"
                  className="w-full px-3 py-2 rounded-md bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-200 h-12 text-md font-semibold"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
