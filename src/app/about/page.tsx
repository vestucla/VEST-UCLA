import { FadeIn } from "@/components/ui/FadeIn";

export default function About() {
  return (
    <>
      <section className="section bg-haze pt-24 pb-10 md:pt-32 md:pb-16">
        <div className="container-content">
          <FadeIn className="space-y-6 md:space-y-8">
            <h1 className="font-display text-display-lg text-blue">About VEST</h1>
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-10">
              <div className="rounded-card border-2 border-black-10 overflow-hidden aspect-[4/3]">
                <img src="/images/About/group_walk.JPG" alt="VEST members walking together" className="w-full h-full object-cover" />
              </div>
              <div className="text-black-80 text-base md:text-lg prose max-w-none space-y-4">
                <p>
                  VEST was founded with a singular mission: to bring together the most driven builders at UCLA. We&apos;re a community of engineers, designers, and founders who are passionate about building things that matter.
                </p>
                <p>
                  Our members have gone on to build companies backed by Y Combinator and top VC firms. We also have members working at industry-leading companies like Stripe, Figma, Apple, and more.
                </p>
                <p>
                  Whether you are looking for co-founders, early teammates, or just a group of friends who share your ambition, VEST is the place for you.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FadeIn className="reveal-media">
              <div className="rounded-card border-2 border-black-10 overflow-hidden aspect-[4/3]">
                <img src="/images/About/group_fun.jpg" alt="VEST Community" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
            <FadeIn delay={100} className="reveal-media">
              <div className="rounded-card border-2 border-black-10 overflow-hidden aspect-[4/3]">
                <img src="/images/About/jouyang_smile.jpg" alt="Members" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
            <FadeIn delay={200} className="reveal-media">
              <div className="rounded-card border-2 border-black-10 overflow-hidden aspect-[4/3]">
                <img src="/images/About/senior_star.jpg" alt="Project Building" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
            <FadeIn delay={300} className="reveal-media">
              <div className="rounded-card border-2 border-black-10 overflow-hidden aspect-[4/3]">
                <img src="/images/About/group_back.jpg" alt="General Meeting" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
