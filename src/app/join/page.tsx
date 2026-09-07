"use client";

import { siteConfig } from "@/data/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

const faqData = [
  {
    question: "What is VEST?",
    answer: "We're a different kind of organization at UCLA focused on engineering, design, and marketing work for startups, plus sourcing and due diligence for VC firms.",
  },
  {
    question: "What makes VEST unique?",
    answer: "Unlike traditional consulting clubs, we do hands-on technical work with rapid development cycles. Our members write code, design products, and work directly with founders and VCs.",
  },
  {
    question: "What opportunities are available?",
    answer: "We offer direct access to internship and full-time opportunities at our partner startups and VCs. Members work on real projects that can be used in their resumes, gaining valuable technical and business experience.",
  },
  {
    question: "What are you looking for?",
    answer: "We value ambition, high agency, and passion over perfect technical skills. We're building a community of driven individuals who want to make a lasting impact in the startup ecosystem.",
  },
];

const timelineSteps = [
  { step: 1, title: "Application", desc: "Submit your online application by the deadline." },
  { step: 2, title: "First Round", desc: "Behavioral and technical screening." },
  { step: 3, title: "Coffee Chats", desc: "Get to know the team in an informal setting." },
  { step: 4, title: "Decision", desc: "Final decisions are sent out." },
];

export default function Join() {
  return (
    <>
      <PageHeader
        title="Join Us"
        description="We recruit builders, engineers, and designers every Fall and Spring. See our process below."
      />
      
      {/* Applications Banner */}
      <section className="py-12 bg-white border-b border-black-10">
        <div className="container-content flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-display-sm text-black">
              {siteConfig.applicationsOpen ? "Applications are open." : "Applications are closed."}
            </h2>
            <p className="text-black-80 text-lg">
              {siteConfig.applicationsOpen 
                ? "We are currently accepting applications for this cohort." 
                : "Check back next quarter or join our newsletter to stay updated."}
            </p>
          </div>
          {siteConfig.applicationsOpen && (
            <a href={siteConfig.applicationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary whitespace-nowrap">
              Apply Now
            </a>
          )}
        </div>
      </section>

      {/* Horizontal Photo Strip */}
      <section className="py-12 overflow-hidden bg-white">
        <div className="flex gap-4 px-6 md:px-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {["MatchaGroupPic.webp", "Pickleball.webp", "PokerNight.webp", "TacoNight.webp", "a16zOutside.webp"].map((img, i) => (
            <div key={i} className="relative flex-none w-[300px] md:w-[400px] aspect-[4/3] rounded-card overflow-hidden snap-center border-2 border-black-10">
              <img src={`/images/JoinUs/${img}`} alt="VEST Event" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}} />
      </section>

      {/* Timeline */}
      <section id="timeline" className="section bg-haze">
        <div className="container-content flex flex-col gap-12">
          <FadeIn>
            <h2 className="font-display text-display-sm text-blue">Application Timeline</h2>
          </FadeIn>
          
          <div className="flex flex-col md:flex-row gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[28px] left-8 right-8 h-[2px] bg-black-10 -z-10" />
            
            {timelineSteps.map((item, i) => (
              <FadeIn key={i} delay={i * 100} className="flex-1">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue text-white flex items-center justify-center font-display text-2xl border-4 border-haze">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-black">{item.title}</h3>
                    <p className="text-black-80 text-sm mt-2">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-white">
        <div className="container-content flex flex-col gap-12 max-w-[800px] mx-auto">
          <FadeIn>
            <h2 className="font-display text-display-sm text-blue text-center">Frequently asked questions</h2>
          </FadeIn>
          
          <div className="flex flex-col gap-4">
            {faqData.map((faq, i) => (
              <FadeIn key={i} delay={i * 50}>
                <details className="group border-2 border-black-10 rounded-card bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-black select-none hover:bg-haze transition-colors">
                    {faq.question}
                    <span className="transition-transform duration-200 group-open:rotate-180">
                      <CaretDown size={24} className="text-blue" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-black-80 text-lg border-t border-black-10">
                    {faq.answer}
                  </div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
