import { supabase } from "@/lib/supabase";
import { unstable_noStore as noStore } from "next/cache";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LeaderboardEntry = {
  username: string;
  points: number;
};

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  noStore();
  const { data, error } = await supabase
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
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 pt-32 pb-16">
      <Card className="w-full border-neutral-800 bg-gradient-to-b from-neutral-950/80 to-neutral-900/80 backdrop-blur">
        <CardHeader className="border-b border-neutral-800 pb-4">
          <CardTitle className="text-2xl font-semibold tracking-tight text-white">
            Leaderboard
          </CardTitle>
          <CardDescription className="text-sm text-neutral-400">
            Ranked by total points, highest to lowest.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {leaderboard.length === 0 ? (
            <p className="text-center text-sm text-neutral-400">
              No leaderboard data available yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800">
                  <TableHead className="w-16 text-neutral-400">Rank</TableHead>
                  <TableHead className="text-neutral-400">Username</TableHead>
                  <TableHead className="w-24 text-right text-neutral-400">
                    Points
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow
                    key={`${entry.username}-${index}`}
                    className="border-neutral-800"
                  >
                    <TableCell className="font-mono text-sm text-neutral-300">
                      #{index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      {entry.username}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-400">
                      {entry.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


