"use client";

import Link from "next/link";
import { CardArrow } from "@/components/ui/CardArrow";
import type { Member } from "@/lib/members";

interface Props {
  member: Member;
  href?: string;
}

export default function MemberCard({ member, href }: Props) {
  const target = href ?? `/members/${member.id}`;
  const topCompanies = (member.companies ?? []).slice(0, 3);

  return (
    <Link href={target} className="block group">
      <div className="card card-interactive h-full flex flex-col p-4">
        <div className="relative w-full aspect-square overflow-hidden rounded-[12px] bg-haze border border-black-10">
          {member.imageSrc ? (
            <img
              src={member.imageSrc}
              alt={`${member.firstName} ${member.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black-30 font-display text-4xl uppercase">
              {member.firstName[0]}
              {member.lastName[0]}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-sans font-bold text-xl text-black leading-tight">
              {member.firstName} {member.lastName}
            </h3>
            <CardArrow className="mt-0.5" />
          </div>
          <p className="text-sm text-black-80">{member.vestTitle}</p>

          {topCompanies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {topCompanies.map((c) => (
                <span key={c} className="chip text-xs py-1 px-3">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
