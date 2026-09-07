"use client";

import Link from "next/link";
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
      <div className="card h-full flex flex-col p-4 transition-all duration-200 ease-out-quart group-hover:-translate-y-1 group-hover:border-black-30 group-hover:shadow-md">
        <div className="relative w-full aspect-square overflow-hidden rounded-[12px] bg-haze border border-black-10">
          {member.imageSrc ? (
            <img
              src={member.imageSrc}
              alt={`${member.firstName} ${member.lastName}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black-30 font-display text-4xl uppercase">
              {member.firstName[0]}
              {member.lastName[0]}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <h3 className="font-sans font-bold text-xl text-black leading-tight">
            {member.firstName} {member.lastName}
          </h3>
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
