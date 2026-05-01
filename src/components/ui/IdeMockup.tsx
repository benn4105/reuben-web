"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode2, AlertCircle, Info, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CODE_LINES = [
  { line: 1, text: "entity Order {", token: "keyword" },
  { line: 2, text: "  id: UUID @default(uuid())", token: "property" },
  { line: 3, text: "  amount: Decimal<12,2>", token: "property" },
  { line: 4, text: "  status: OrderStatus", token: "property" },
  { line: 5, text: "}", token: "keyword" },
  { line: 6, text: "", token: "" },
  { line: 7, text: "transaction function processPayment(", token: "keyword" },
  { line: 8, text: "  orderId: UUID,", token: "property" },
  { line: 9, text: "  paymentToken: String", token: "property" },
  { line: 10, text: ") writes Order {", token: "keyword" },
  { line: 11, text: "  let order = load Order where id == orderId", token: "statement" },
  { line: 12, text: "", token: "" },
  { line: 13, text: "  if order.status != Pending {", token: "control" },
  { line: 14, text: "    abort \"Order is not pending\"", token: "error" },
  { line: 15, text: "  }", token: "control" },
  { line: 16, text: "", token: "" },
  { line: 17, text: "  // Stripe integration via outbox", token: "comment" },
  { line: 18, text: "  enqueue ProcessStripeCharge {", token: "statement" },
  { line: 19, text: "    order: order.id,", token: "property" },
  { line: 20, text: "    token: paymentToken", token: "property" },
  { line: 21, text: "  }", token: "statement" },
  { line: 22, text: "}", token: "keyword" },
];

const DIAGNOSTICS = [
  {
    line: 14,
    type: "error",
    message: "Cannot abort with a raw string. Use a strongly-typed Error Enum.",
    source: "reux-lsp",
  },
  {
    line: 18,
    type: "info",
    message: "Event 'ProcessStripeCharge' will be durably written to the outbox table in the same transaction.",
    source: "reux-compiler",
  }
];

export default function IdeMockup() {
  const [activeTab, setActiveTab] = useState<"code" | "terminal">("code");
  const [hoverLine, setHoverLine] = useState<number | null>(null);

  const activeDiagnostic = DIAGNOSTICS.find(d => d.line === hoverLine);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#1E1E1E] font-mono text-sm flex flex-col h-[600px]">
      {/* Window Header */}
      <div className="h-10 bg-[#2D2D2D] border-b border-white/5 flex items-center px-4 justify-between select-none">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="text-gray-400 text-xs font-medium flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-[#00F0FF]" />
          <span>payment.reux — Reux Workspace</span>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-12 bg-[#252526] border-r border-white/5 flex flex-col items-center py-4 space-y-6 text-gray-500">
          <FileCode2 className="w-6 h-6 text-white" />
          <SearchIcon className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          <GitIcon className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          <ExtensionsIcon className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
        </div>

        {/* Explorer Pane */}
        <div className="w-48 bg-[#252526] border-r border-white/5 hidden sm:flex flex-col select-none">
          <div className="px-4 py-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Explorer</div>
          <div className="flex items-center gap-1 px-4 py-1 text-gray-300 hover:bg-white/5 cursor-pointer">
            <ChevronRight className="w-4 h-4" />
            <span className="text-sm">schema</span>
          </div>
          <div className="flex items-center gap-2 px-8 py-1 text-gray-300 hover:bg-white/5 cursor-pointer bg-[#00F0FF]/10 text-[#00F0FF] border-l-2 border-[#00F0FF]">
            <span className="text-[#00F0FF]">payment.reux</span>
          </div>
          <div className="flex items-center gap-2 px-8 py-1 text-gray-400 hover:bg-white/5 cursor-pointer">
            <span>users.reux</span>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col bg-[#1E1E1E] relative overflow-hidden">
          {/* Editor Tabs */}
          <div className="flex h-10 bg-[#252526] border-b border-white/5 select-none">
            <div 
              className={cn(
                "px-4 flex items-center gap-2 border-t-2 border-transparent bg-[#1E1E1E] text-white cursor-pointer",
                activeTab === "code" && "border-[#00F0FF] bg-[#1E1E1E]"
              )}
              onClick={() => setActiveTab("code")}
            >
              <FileCode2 className="w-4 h-4 text-[#00F0FF]" />
              payment.reux
            </div>
          </div>

          {/* Code View */}
          {activeTab === "code" && (
            <div className="flex-1 overflow-auto py-4 relative">
              {CODE_LINES.map((line) => {
                const hasError = DIAGNOSTICS.some(d => d.line === line.line && d.type === "error");
                const hasInfo = DIAGNOSTICS.some(d => d.line === line.line && d.type === "info");

                return (
                  <div 
                    key={line.line} 
                    className={cn(
                      "flex group hover:bg-white/5 cursor-text px-4",
                      hoverLine === line.line && "bg-white/5"
                    )}
                    onMouseEnter={() => setHoverLine(line.line)}
                    onMouseLeave={() => setHoverLine(null)}
                  >
                    <div className="w-8 text-right pr-4 text-gray-600 select-none">{line.line}</div>
                    <div className="flex-1 whitespace-pre">
                      <span className={cn(
                        line.token === "keyword" && "text-[#C678DD]",
                        line.token === "property" && "text-[#E06C75]",
                        line.token === "statement" && "text-[#61AFEF]",
                        line.token === "control" && "text-[#C678DD]",
                        line.token === "error" && "text-[#E06C75]",
                        line.token === "comment" && "text-[#5C6370] italic",
                        !line.token && "text-[#ABB2BF]"
                      )}>
                        {line.text}
                      </span>
                      {hasError && <span className="absolute left-14 right-0 border-b-2 border-red-500/50 border-dashed pointer-events-none mt-[18px]" />}
                      {hasInfo && <span className="absolute left-14 right-0 border-b-2 border-blue-400/50 border-dotted pointer-events-none mt-[18px]" />}
                    </div>
                  </div>
                );
              })}

              {/* Hover Tooltip */}
              <AnimatePresence>
                {activeDiagnostic && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute z-50 left-24 p-3 rounded-lg shadow-xl border border-white/10 max-w-sm bg-[#252526]"
                    style={{ top: (activeDiagnostic.line * 24) + 10 }}
                  >
                    <div className="flex items-start gap-2">
                      {activeDiagnostic.type === "error" ? (
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                      )}
                      <div>
                        <p className="text-gray-200 text-sm">{activeDiagnostic.message}</p>
                        <p className="text-gray-500 text-xs mt-1">Source: {activeDiagnostic.source}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Terminal Panel */}
          <div className="h-48 border-t border-white/5 bg-[#1E1E1E] flex flex-col">
            <div className="flex px-4 h-9 items-center space-x-6 text-xs uppercase tracking-wider text-gray-500 select-none border-b border-white/5">
              <span className="hover:text-white cursor-pointer">Problems <span className="bg-red-500/20 text-red-400 px-1.5 rounded-full ml-1">1</span></span>
              <span className="hover:text-white cursor-pointer">Output</span>
              <span className="text-white border-b-2 border-[#00F0FF] h-full flex items-center">Terminal</span>
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-sm text-gray-300">
              <div className="flex items-center gap-2 mb-2 text-green-400">
                <Check className="w-4 h-4" /> 
                <span>Compiler running in watch mode...</span>
              </div>
              <div className="mb-2">
                <span className="text-[#00F0FF]">~/reux-project</span> $ reux check
              </div>
              <div className="text-red-400 mb-1">
                error: Invalid abort payload
              </div>
              <div className="text-gray-500 pl-4 mb-2">
                {"-->"} payment.reux:14:11<br/>
                {" |"}<br/>
                {" |"} abort &quot;Order is not pending&quot;<br/>
                {" |"}       ^^^^^^^^^^^^^^^^^^^^^^ expected Enum, found String
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple icons for sidebar
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function GitIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>;
}
function ExtensionsIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><rect x="14" y="2" width="8" height="8" rx="2" ry="2"/><rect x="2" y="14" width="8" height="8" rx="2" ry="2"/><rect x="14" y="14" width="8" height="8" rx="2" ry="2"/><path d="M6 14V6a2 2 0 0 1 2-2h6"/></svg>;
}
