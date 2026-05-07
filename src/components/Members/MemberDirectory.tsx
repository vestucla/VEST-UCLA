"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import MemberCard from "./MemberCard";
import type { Member, MemberStatus } from "@/lib/members";
import { searchMembers, getAllCompanies, getAllInterests } from "@/lib/members";

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
    <Container>
      <Controls>
        <SearchInput
          type="search"
          placeholder="Search by name, company, role, or interest…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ResultCount>{headerLabel}</ResultCount>
      </Controls>

      <FiltersRow>
        <FilterGroup>
          <FilterLabel>Companies</FilterLabel>
          <Chips>
            {allCompanies.map((c) => (
              <Chip
                key={c}
                $active={companies.includes(c)}
                type="button"
                onClick={() => toggle(companies, setCompanies, c)}
              >
                {c}
              </Chip>
            ))}
          </Chips>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Interests</FilterLabel>
          <Chips>
            {allInterests.map((i) => (
              <Chip
                key={i}
                $active={interests.includes(i)}
                type="button"
                onClick={() => toggle(interests, setInterests, i)}
              >
                {i}
              </Chip>
            ))}
          </Chips>
        </FilterGroup>

        {activeFilterCount > 0 && (
          <ClearButton
            type="button"
            onClick={() => {
              setCompanies([]);
              setInterests([]);
            }}
          >
            Clear filters
          </ClearButton>
        )}
      </FiltersRow>

      {results.length === 0 ? (
        <Empty>
          {emptyHint ?? "No members match those filters yet."}
        </Empty>
      ) : (
        <Grid>
          {results.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </Grid>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 260px;
  height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(239, 239, 239, 0.15);
  background: rgba(239, 239, 239, 0.06);
  color: #efefef;
  font-size: var(--text-base);
  outline: none;
  transition: border-color 200ms ease, background 200ms ease;

  &::placeholder {
    color: rgba(239, 239, 239, 0.45);
  }

  &:focus {
    border-color: rgba(173, 206, 255, 0.6);
    background: rgba(239, 239, 239, 0.1);
  }
`;

const ResultCount = styled.span`
  font-size: var(--text-sm);
  color: rgba(239, 239, 239, 0.6);
`;

const FiltersRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.span`
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(239, 239, 239, 0.55);
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button<{ $active: boolean }>`
  font-size: var(--text-xs);
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(173, 206, 255, 0.7)" : "rgba(239, 239, 239, 0.15)")};
  background: ${({ $active }) =>
    $active ? "rgba(173, 206, 255, 0.18)" : "rgba(239, 239, 239, 0.05)"};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(239, 239, 239, 0.8)")};
  cursor: pointer;
  transition: background 200ms ease, color 200ms ease, border-color 200ms ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgba(173, 206, 255, 0.12);
      color: #fff;
    }
  }
`;

const ClearButton = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: rgba(173, 206, 255, 0.85);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

const Empty = styled.div`
  padding: 60px 24px;
  text-align: center;
  border-radius: 24px;
  border: 1px dashed rgba(239, 239, 239, 0.15);
  color: rgba(239, 239, 239, 0.65);
`;
