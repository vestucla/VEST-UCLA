"use client";

import { useEffect, useMemo, useState } from "react";
import MemberCard from "./MemberCard";
import type { Member, MemberStatus } from "@/lib/members";
import { searchMembers, getAllCompanies, getAllInterests } from "@/lib/members";
import { CaretDown, MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr";

interface Props {
  status: MemberStatus;
  emptyHint?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function MultiSelectDropdown({
  label,
  options,
  selected,
  onToggle,
}: MultiSelectDropdownProps) {
  const buttonLabel =
    selected.length === 0
      ? `All ${label.toLowerCase()}`
      : selected.length <= 2
        ? selected.join(", ")
        : `${selected.length} selected`;

  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow text-black-80">{label}</span>
      <details className="group relative [&_summary::-webkit-details-marker]:hidden">
        <summary className="input flex cursor-pointer list-none items-center justify-between gap-3 bg-white select-none">
          <span className="truncate text-black">{buttonLabel}</span>
          <CaretDown
            size={18}
            className="shrink-0 text-black-50 transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-card border-2 border-black-10 bg-white p-2 shadow-[0_12px_40px_rgba(16,16,61,0.12)]">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-black-50">
              No options yet.
            </div>
          ) : (
            <div className="flex flex-col">
              {options.map((option) => {
                const active = selected.includes(option);
                return (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-3 rounded-btn px-3 py-2 text-sm transition-colors ${
                      active ? "bg-haze text-black" : "text-black-80 hover:bg-haze"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => onToggle(option)}
                      className="h-4 w-4 rounded border-black-20 text-blue focus:ring-blue"
                    />
                    <span className="min-w-0 flex-1 truncate">{option}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </details>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className="chip bg-blue text-white transition-colors hover:bg-blue-80"
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
        <div className="grid gap-4 md:grid-cols-2">
          <MultiSelectDropdown
            label="Companies"
            options={allCompanies}
            selected={companies}
            onToggle={(value) => toggle(companies, setCompanies, value)}
          />
          <MultiSelectDropdown
            label="Interests"
            options={allInterests}
            selected={interests}
            onToggle={(value) => toggle(interests, setInterests, value)}
          />
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
