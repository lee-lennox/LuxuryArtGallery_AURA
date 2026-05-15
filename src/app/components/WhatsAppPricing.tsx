import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PricingTier {
  name: string;
  setupFee: number;
  monthlyFee: number;
  description: string;
  tagline: string;
  features: string[];
  exclusions: string[];
  highlighted?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    setupFee: 2499,
    monthlyFee: 1500,
    description: "WhatsApp AI Assistant (Basic Setup)",
    tagline: "Perfect if you just want to stop missing messages and respond instantly.",
    features: [
      "Answers FAQs (prices, services, location, hours)",
      "Basic booking link sharing (redirect to their system)",
      "Business hours automation (auto replies after hours)",
      "Up to 50–100 conversations/month"
    ],
    exclusions: [
      "No advanced booking logic",
      "No follow-ups",
      "No deep personalization"
    ],
    highlighted: false
  },
  {
    name: "Standard",
    setupFee: 3400,
    monthlyFee: 23000,
    description: "Everything in Starter PLUS:",
    tagline: "Maximize conversions with intelligent booking and follow-up automation.",
    features: [
      "Smart booking flow (guides client to book step-by-step)",
      "Lead qualification (asks questions before booking)",
      "Follow-ups (if client doesn't book)",
      "After-hours conversion (pushes bookings overnight)",
      "Priority responses (faster & smarter AI)",
      "Unlimited or higher conversation limit",
      "Custom tone (trained to sound like the business owner)",
      "Monthly optimization (you improve responses)"
    ],
    exclusions: [],
    highlighted: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export function WhatsAppPricing() {
  return (
    <section 
      id="pricing" 
      className="relative w-full py-20 px-8 bg-[var(--color-bg-primary)]"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)]/30 to-[var(--color-bg-primary)] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }} 
          className="text-center mb-20"
        >
          <h2
            className="text-5xl md:text-7xl mb-6 text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            WhatsApp AI Pricing
          </h2>
          <p
            className="text-xl text-[var(--color-text-muted)] max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            We offer a WhatsApp AI assistant that replies instantly and books clients 24/7.
            <br />
            <span className="text-[var(--color-accent-gold)]">
              Target: salons, barbers, lash techs, training academies
            </span>
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative rounded-2xl p-8 backdrop-blur-md transition-all duration-500 ${
                tier.highlighted
                  ? 'bg-[var(--color-accent-gold)]/10 border-2 border-[var(--color-accent-gold)] shadow-[0_0_40px_rgba(212,163,115,0.2)]'
                  : 'bg-[var(--color-bg-secondary)]/50 border border-[var(--color-bg-secondary)] hover:border-[var(--color-accent-gold)]/30'
              }`}
            >
              {/* Popular badge */}
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[var(--color-accent-gold)] text-[var(--color-bg-primary)] px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier Header */}
              <div className="text-center mb-8">
                <h3
                  className="text-4xl mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {tier.name}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-6">
                  {tier.description}
                </p>
                
                <div className="mb-4">
                  <span className="text-5xl font-light text-white">
                    R{tier.setupFee.toLocaleString()}
                  </span>
                  <span className="text-[var(--color-text-muted)] ml-2">setup</span>
                </div>
                
                <div className="text-3xl text-[var(--color-accent-gold)] font-light">
                  R{tier.monthlyFee.toLocaleString()}
                  <span className="text-lg text-[var(--color-text-muted)] ml-2">/month</span>
                </div>
              </div>

              {/* Tagline */}
              <div className="bg-[var(--color-bg-primary)]/50 rounded-lg p-4 mb-8 text-center">
                <p className="text-sm text-[var(--color-text-muted)] italic">
                  "{tier.tagline}"
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[var(--color-accent-gold)] shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Exclusions */}
              {tier.exclusions.length > 0 && (
                <div className="border-t border-[var(--color-bg-secondary)] pt-6">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                    What it does NOT include:
                  </p>
                  <div className="space-y-3">
                    {tier.exclusions.map((exclusion, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {exclusion}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full mt-8 py-4 rounded-lg font-semibold transition-all ${
                  tier.highlighted
                    ? 'bg-[var(--color-accent-gold)] text-[var(--color-bg-primary)] hover:bg-[var(--color-cream-glow)]'
                    : 'bg-[var(--color-bg-secondary)] text-white border border-[var(--color-accent-gold)]/30 hover:bg-[var(--color-accent-gold)]/10'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-20"
        >
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            All plans include 24/7 AI availability, instant response times, and seamless WhatsApp integration.
            <br />
            Need a custom solution? <a href="#contact" className="text-[var(--color-accent-gold)] hover:underline">Contact us</a> for enterprise pricing.
          </p>
        </motion.div>
      </div>
    </section>
  );
}