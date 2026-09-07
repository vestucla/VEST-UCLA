import { getSupabaseClient } from "@/lib/supabase";
import { unstable_noStore as noStore } from "next/cache";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LeaderboardEntry = {
  username: string;
  points: number;
};

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  noStore();
  const { data, error } = await getSupabaseClient()
    .from("leaderboard")
    .select("username, points")
    .order("points", { ascending: false });

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return (data ?? []) as LeaderboardEntry[];
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <>
      <PageHeader
        title="Leaderboard"
        description="Ranked by total points, highest to lowest."
      />
      <section className="section bg-white min-h-[60vh]">
        <div className="container-content max-w-[800px]">
          <FadeIn>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-haze border-b-2 border-black-10">
                      <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-black-80 w-16">Rank</th>
                      <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-black-80">Username</th>
                      <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-black-80 text-right w-24">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 px-6 text-center text-black-80">
                          No leaderboard data available yet.
                        </td>
                      </tr>
                    ) : (
                      leaderboard.map((entry, index) => (
                        <tr key={`${entry.username}-${index}`} className="border-b border-black-10 last:border-0 hover:bg-haze/50 transition-colors">
                          <td className="py-4 px-6 text-black-80 font-mono">#{index + 1}</td>
                          <td className="py-4 px-6 font-bold text-black">{entry.username}</td>
                          <td className="py-4 px-6 text-right font-bold text-blue">{entry.points}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
