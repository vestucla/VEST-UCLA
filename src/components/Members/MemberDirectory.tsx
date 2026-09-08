"use client";

import { useEffect, useMemo, useState } from "react";
import MemberCard from "./MemberCard";
import type { Member, MemberStatus } from "@/lib/members";
import { searchMembers, getAllCompanies, getAllInterests } from "@/lib/members";
import { MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr";

interface Props {
  status: MemberStatus;
  emptyHint?: string;
}

export default function MemberDirectory({ status, emptyHint }: Props) {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const [allCompanies, setAllCompanies] = useState<string[]>([]);
  const [allInterests, setAllInterests] = useState<string[]>([]);
  const [results, setResults] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAllCompanies(), getAllInterests()]).then(([c, i]) => {
      if (cancelled) return;
      setAllCompanies(c);
      setAllInterests(i);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    searchMembers({ query, companies, interests, status }).then((r) => {
      if (cancelled) return;
      setResults(r);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [query, companies, interests, status]);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const activeFilterCount = companies.length + interests.length;

  const headerLabel = useMemo(() => {
    if (loading) return "Searching…";
    return `${results.length} ${results.length === 1 ? "member" : "members"}`;
  }, [results.length, loading]);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Search Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-black-30" size={20} />
          <input
            type="search"
            placeholder="Search by name, company, role, or interest…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-11"
          />
        </div>
        <span className="text-black-80 text-sm">{headerLabel}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="eyebrow text-black-80">Companies</span>
          <div className="flex flex-wrap gap-2">
            {allCompanies.map((c) => {
              const active = companies.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggle(companies, setCompanies, c)}
                  className={`chip transition-colors ${active ? "bg-blue text-white" : "hover:bg-blue hover:text-white"}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <span className="eyebrow text-black-80">Interests</span>
          <div className="flex flex-wrap gap-2">
            {allInterests.map((i) => {
              const active = interests.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(interests, setInterests, i)}
                  className={`chip transition-colors ${active ? "bg-blue text-white" : "hover:bg-blue hover:text-white"}`}
                >
                  {i}
                </button>
              );
            })}
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setCompanies([]);
              setInterests([]);
            }}
            className="self-start flex items-center gap-1 text-sm text-blue hover:text-blue-80 mt-2 transition-colors"
          >
            <X size={16} /> Clear filters
          </button>
        )}
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="py-16 px-6 text-center rounded-card border-2 border-dashed border-black-10 text-black-80">
          {emptyHint ?? "No members match those filters yet."}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {results.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </div>
  );
}
