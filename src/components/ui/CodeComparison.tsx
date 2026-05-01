"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonExample {
  id: string;
  title: string;
  description: string;
  traditionalCode: string;
  reuxCode: string;
}

const EXAMPLES: ComparisonExample[] = [
  {
    id: "transactions",
    title: "Transactional Workflows",
    description: "Instead of scattering transactions across controllers, repositories, and ORMs, Reux models atomic operations natively with built-in outbox patterns.",
    traditionalCode: `// Traditional: Express + Prisma
async function capturePayment(req, res) {
  const { orderId, amount } = req.body;
  
  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({
        where: { id: orderId }
      });
      
      const payment = await tx.payment.create({
        data: {
          orderId, amount, 
          currency: order.currency,
          status: 'CAPTURED'
        }
      });
      
      // Manual outbox event insertion
      await tx.outboxEvent.create({
        data: {
          type: 'PaymentCaptured',
          payload: { paymentId: payment.id, orderId }
        }
      });
      
      return payment;
    });
  } catch (error) {
    // Manual rollback handling
    res.status(500).json({ error });
  }
}`,
    reuxCode: `// Reux: Declarative transaction
transaction function capturePayment(
  orderRef: Order, 
  amount: Decimal<12,2>
) writes Payment retry 3 {
  let order = load orderRef for update
  
  let payment = insert Payment {
    order: orderRef,
    amount: amount,
    currency: order.currency,
    status: Captured
  }

  // Natively durable outbox event
  enqueue PaymentCaptured {
    payment: payment.id,
    order: orderRef,
    amount: amount
  }

  after commit sendReceipt(orderRef)
}`
  },
  {
    id: "state",
    title: "State Transitions",
    description: "Instead of implicit string statuses scattered in application code, Reux enforces strict, auditable state machine rules.",
    traditionalCode: `// Traditional: Ad-hoc state checks
async function shipOrder(orderId) {
  const order = await db.orders.findById(orderId);
  
  if (order.status !== 'PROCESSING') {
    throw new Error("Invalid state");
  }
  
  if (!order.paymentId) {
    throw new Error("Unpaid");
  }
  
  await db.orders.update(orderId, { 
    status: 'SHIPPED',
    shippedAt: new Date()
  });
}`,
    reuxCode: `// Reux: Strict transitions
entity Order {
  // ...fields
  state status {
    Created
    Processing
    Shipped
    Delivered
  }
  
  transition ship from Processing to Shipped {
    require payment != null
    set shipped_at = now()
  }
}`
  }
];

export default function CodeComparison() {
  const [activeId, setActiveId] = useState<string>(EXAMPLES[0].id);
  const activeExample = EXAMPLES.find(e => e.id === activeId) || EXAMPLES[0];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map(ex => (
            <button
              key={ex.id}
              onClick={() => setActiveId(ex.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeId === ex.id 
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30" 
                  : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10 hover:text-white"
              )}
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-2">{activeExample.title}</h3>
        <p className="text-gray-400 max-w-3xl">{activeExample.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Decorative VS indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-[#0A0A0A] border border-white/10 text-gray-500 shadow-xl">
          <ArrowRightLeft size={18} />
        </div>

        {/* Traditional Code */}
        <div className="rounded-xl overflow-hidden glass border border-white/5 relative">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/40">
            <span className="text-xs text-gray-500 font-medium">The Messy Status Quo</span>
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">TypeScript + SQL</span>
          </div>
          <div className="p-6 bg-[#050505] overflow-x-auto h-[400px]">
            <pre className="font-mono text-xs md:text-sm leading-relaxed text-gray-400">
              <code>{activeExample.traditionalCode}</code>
            </pre>
          </div>
        </div>

        {/* Reux Code */}
        <div className="rounded-xl overflow-hidden glass border border-[#00F0FF]/20 relative shadow-[0_0_30px_rgba(0,240,255,0.05)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#00F0FF]/5">
            <span className="text-xs text-[#00F0FF] font-bold">The Reux Way</span>
            <span className="text-[10px] text-[#00F0FF]/60 uppercase tracking-wider">.reux</span>
          </div>
          <div className="p-6 bg-[#0A0A0A] overflow-x-auto h-[400px]">
            <pre className="font-mono text-xs md:text-sm leading-relaxed text-gray-200">
              <code>{activeExample.reuxCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
