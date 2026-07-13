/**
 * Seed script to populate Firestore with test member profiles.
 * Members sign in with Google (UCLA accounts only).
 * Run with: npx tsx scripts/seed-db.ts
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not set in .env.local"
    );
  }
  return JSON.parse(raw);
}

// Initialize Firebase Admin
const app =
  getApps().length === 0
    ? initializeApp({ credential: cert(getServiceAccount()) })
    : getApps()[0];

const db = getFirestore(app);

// Test data - use UCLA emails for Google sign-in
const TEST_MEMBERS = [
  {
    email: "admin@g.ucla.edu",
    firstName: "Admin",
    lastName: "User",
    role: "admin" as const,
    status: "active" as const,
    vestTitle: "President",
    classYear: "2025",
    joinedYear: "2023",
    bio: "Leading VEST to empower the next generation of venture builders at UCLA.",
    interests: ["Venture Capital", "Startups", "Product Management"],
    major: "Business Economics",
    city: "Los Angeles, CA",
    experiences: [
      { company: "Sequoia Capital", role: "Summer Intern", startDate: "2024-06", endDate: "2024-08" },
      { company: "Google", role: "Product Management Intern", startDate: "2023-06", endDate: "2023-09" },
    ],
    linkedin: "https://linkedin.com/in/adminuser",
    phone: "310-555-0001",
  },
  {
    email: "jane.doe@g.ucla.edu",
    firstName: "Jane",
    lastName: "Doe",
    role: "member" as const,
    status: "active" as const,
    vestTitle: "Director of Recruitment",
    classYear: "2026",
    joinedYear: "2024",
    bio: "Passionate about connecting talented individuals with opportunities in venture.",
    interests: ["FinTech", "Healthcare", "AI/ML"],
    major: "Computer Science",
    city: "Los Angeles, CA",
    experiences: [
      { company: "a16z", role: "Summer Analyst", startDate: "2024-06", endDate: "2024-08" },
      { company: "Stripe", role: "Software Engineering Intern", startDate: "2023-06", endDate: "2023-09" },
    ],
    linkedin: "https://linkedin.com/in/janedoe",
    github: "janedoe",
    phone: "310-555-0002",
  },
  {
    email: "john.smith@ucla.edu",
    firstName: "John",
    lastName: "Smith",
    role: "member" as const,
    status: "active" as const,
    vestTitle: "Builder",
    classYear: "2026",
    joinedYear: "2024",
    bio: "Building the future of education technology. Always looking for co-founders.",
    interests: ["EdTech", "Consumer", "Web3"],
    major: "Economics",
    city: "San Francisco, CA",
    experiences: [
      { company: "Y Combinator", role: "Startup School Fellow", startDate: "2024-01" },
      { company: "Notion", role: "Growth Intern", startDate: "2023-06", endDate: "2023-08" },
    ],
    linkedin: "https://linkedin.com/in/johnsmith",
    twitter: "johnsmith",
    website: "https://johnsmith.dev",
    phone: "310-555-0003",
  },
  {
    email: "sarah.chen@g.ucla.edu",
    firstName: "Sarah",
    lastName: "Chen",
    role: "member" as const,
    status: "active" as const,
    vestTitle: "VP of Operations",
    classYear: "2025",
    joinedYear: "2023",
    bio: "Operations enthusiast focused on scaling startups efficiently.",
    interests: ["SaaS", "B2B", "Operations"],
    major: "Business Economics",
    city: "Los Angeles, CA",
    experiences: [
      { company: "Lightspeed Venture Partners", role: "Summer Associate", startDate: "2024-06", endDate: "2024-08" },
      { company: "Uber", role: "Operations Intern", startDate: "2023-06", endDate: "2023-08" },
    ],
    linkedin: "https://linkedin.com/in/sarahchen",
    phone: "310-555-0004",
  },
  {
    email: "mike.johnson@ucla.edu",
    firstName: "Mike",
    lastName: "Johnson",
    role: "member" as const,
    status: "alumni" as const,
    vestTitle: "Former President",
    classYear: "2024",
    joinedYear: "2021",
    bio: "VEST alum now working in VC. Happy to chat with current members!",
    interests: ["Venture Capital", "Deep Tech", "Climate"],
    major: "Computer Science & Engineering",
    city: "New York, NY",
    experiences: [
      { company: "Andreessen Horowitz", role: "Deal Team", startDate: "2024-07" },
      { company: "SpaceX", role: "Software Engineer", startDate: "2022-06", endDate: "2024-06" },
    ],
    linkedin: "https://linkedin.com/in/mikejohnson",
    twitter: "mikej",
    phone: "310-555-0005",
  },
  {
    email: "emily.wang@g.ucla.edu",
    firstName: "Emily",
    lastName: "Wang",
    role: "member" as const,
    status: "alumni" as const,
    vestTitle: "Former VP Finance",
    classYear: "2024",
    joinedYear: "2022",
    bio: "Now in growth equity. Reach out if you want to learn about the buy-side!",
    interests: ["Growth Equity", "FinTech", "Enterprise"],
    major: "Economics & Mathematics",
    city: "San Francisco, CA",
    experiences: [
      { company: "General Catalyst", role: "Associate", startDate: "2024-08" },
      { company: "Goldman Sachs", role: "Summer Analyst", startDate: "2023-06", endDate: "2023-08" },
    ],
    linkedin: "https://linkedin.com/in/emilywang",
    phone: "310-555-0006",
  },
];

async function seedDatabase() {
  console.log("🌱 Starting database seed...\n");

  for (const member of TEST_MEMBERS) {
    const { email, ...memberData } = member;

    try {
      // Check if member with this email already exists
      const existing = await db.collection("members").where("email", "==", email).get();
      
      if (!existing.empty) {
        // Update existing doc
        const docId = existing.docs[0].id;
        await db.collection("members").doc(docId).update({
          ...memberData,
          email,
          mustChangePassword: false,
          profileCompleted: true,
        });
        console.log(`⚡ Updated existing member: ${email}`);
      } else {
        // Create new member doc
        await db.collection("members").add({
          email,
          ...memberData,
          mustChangePassword: false,
          profileCompleted: true,
          createdAt: new Date().toISOString(),
        });
        console.log(`✅ Created member profile: ${memberData.firstName} ${memberData.lastName} (${email})`);
      }
    } catch (err) {
      console.error(`❌ Failed to create ${email}:`, err);
    }
  }

  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Test accounts (sign in with UCLA Google):");
  console.log("   Admin:  admin@g.ucla.edu");
  console.log("   Member: jane.doe@g.ucla.edu");
  console.log("   Member: john.smith@ucla.edu");
  console.log("   Member: sarah.chen@g.ucla.edu");
  console.log("   Alumni: mike.johnson@ucla.edu");
  console.log("   Alumni: emily.wang@g.ucla.edu");
  console.log("\n⚠️  To test, create a member profile with YOUR UCLA email via admin or directly in Firestore.");
}

seedDatabase().catch(console.error);
