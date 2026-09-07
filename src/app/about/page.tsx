import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";

export default function About() {
  return (
    <>
      <PageHeader
        title="About VEST"
        description={
          <div className="flex flex-col gap-4">
            <p>
              VEST was founded with a singular mission: to bring together the most driven builders at UCLA. We are a community of engineers, designers, and founders who are passionate about building things that matter.
            </p>
            <p>
              Our members have gone on to build companies backed by Y Combinator, Thiel Fellowship, and top VC firms. We also have members working at industry-leading companies like Stripe, Figma, Apple, and more.
            </p>
            <p>
              Whether you are looking for co-founders, early teammates, or just a group of friends who share your ambition, VEST is the place for you.
            </p>
          </div>
        }
      />
      <section className="section bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FadeIn>
              <div className="rounded-card border-2 border-black-10 overflow-hidden aspect-square md:aspect-[4/3]">
                <img src="/images/About/AptGroupPic.webp" alt="VEST Community" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="rounded-card border-2 border-black-10 overflow-hidden aspect-square md:aspect-[4/3]">
                <img src="/images/About/BowenXueTalk.webp" alt="Guest Speaker Event" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="rounded-card border-2 border-black-10 overflow-hidden aspect-square md:aspect-[4/3]">
                <img src="/images/About/DrinkRobot.webp" alt="Project Building" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="rounded-card border-2 border-black-10 overflow-hidden aspect-square md:aspect-[4/3]">
                <img src="/images/About/GM1.webp" alt="General Meeting" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
