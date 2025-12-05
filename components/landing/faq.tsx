import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is my health data private and secure?",
    answer:
      "Yes. Your data is encrypted and stored securely. We never sell your personal information to third parties. You can export or delete your data at any time.",
  },
  {
    question: "Which devices and wearables do you support?",
    answer:
      "Currently, PepMetrics supports importing your full data export from Garmin Connect. This includes sleep, HRV, stress, steps, Body Battery, and activity data. Additional integrations are on our roadmap.",
  },
  {
    question: "Can I track custom peptides not in your database?",
    answer:
      "Absolutely. While we have 90+ peptides pre-loaded with common dosing information, you can add any custom compound with your own dosage and schedule.",
  },
  {
    question: "How does the AI insights feature work?",
    answer:
      "Our AI analyzes patterns in your dosing schedule alongside your health metrics (like sleep and HRV). Each week, you'll receive a summary highlighting trends and potential correlations. You can also ask questions about your data in plain English.",
  },
  {
    question: "Is PepMetrics medical advice?",
    answer:
      "No. PepMetrics is a tracking and logging tool—not a medical device. The insights we provide are observations based on your data, not diagnoses or treatment recommendations. Always consult a healthcare provider for medical decisions.",
  },
  {
    question: "What peptides can I track?",
    answer:
      "We support tracking for GLP-1 agonists (Retatrutide, Tirzepatide, Semaglutide), growth hormone peptides (Tesamorelin, Ipamorelin, CJC-1295), recovery peptides (BPC-157, TB-500), longevity compounds (MOTS-c, Epithalon), and many more. You can also add custom entries.",
  },
  {
    question: "Do I need a Garmin watch to use PepMetrics?",
    answer:
      "No. Garmin integration is optional. You can use PepMetrics purely as a dose tracker and fasting timer without connecting any wearable.",
  },
  {
    question: "Can I use PepMetrics on my phone?",
    answer:
      "Yes. PepMetrics is a Progressive Web App (PWA), meaning you can install it on your iPhone or Android home screen and use it like a native app. No app store download required.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center text-white">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-lg ring-1 ring-white/10 open:ring-white/20 bg-zinc-900/60 open:bg-zinc-900/70 transition"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm text-white">
                <span>{faq.question}</span>
                <ChevronDown className="w-4 h-4 transition duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-4 pt-0 text-sm text-zinc-300">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
