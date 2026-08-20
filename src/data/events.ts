export interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  subtitle: string;
  description: string;
  imageSrc: string;
}

export const events: Event[] = [
  {
    id: 1,
    title: "Fireside Chat with Spencer Rascoff",
    slug: "fireside-chat-with-spencer-rascoff",
    date: "02/06/2025",
    subtitle: "Learning from the founder of Zillow",
    description: "Spencer Rascoff, founder of Zillow, joined us for an engaging fireside chat on February 6, 2025, where he shared candid insights into his entrepreneurial journey, the challenges of scaling Zillow, and advice for aspiring founders.",
    imageSrc: "/images/Events/VEST-SpencerRascoff.jpeg"
  },
  {
    id: 2,
    title: "a16z Office Visit",
    slug: "a16z-office-visit",
    date: "02/26/2025",
    subtitle: "Introducing our founders to VC staff",
    description: "On February 26, 2025, our members visited the a16z office for an exclusive opportunity to connect with venture capital staff and learn about the firm’s investment approach.",
    imageSrc: "/images/Events/VEST-a16zOfficeVisit.jpg"
  },
  {
    id: 3,
    title: "Oligo Guest Speaker",
    slug: "oligo-guest-speaker",
    date: "03/11/2025",
    subtitle: "Insights from a Thiel Fellow",
    description: "Jacob Rodriguez, Thiel Fellow and founder of space infrastructure startup Oligo, joined us as a guest speaker on March 11, 2025, to share his journey in spacecraft entrepreneurship, building Oligo, and his experience as a Thiel Fellow.",
    imageSrc: "/images/Events/VEST-Oligo.png"
  },
  {
    id: 4,
    title: "Bowen Xue Guest Speaker",
    slug: "bowen-xue-guest-speaker",
    date: "04/20/2025",
    subtitle: "Learning from YC23",
    description: "On April 20, 2025, Bowen Xue, a founder from Y Combinator’s Summer 2023 batch, spoke with us about his startup experience, navigating YC, and key takeaways from building his company DisputeNinja.",
    imageSrc: "/images/Events/VEST-BowenXue.jpg"
  }
]; 