"use client";

import Link from "next/link";
import type { Member } from "@/lib/members";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/FadeIn";

interface Props {
  member: Member;
}

export default function MemberProfile({ member }: Props) {
  const { user, isMember, isAdmin } = useAuth();
  
  const canEdit = user && (isAdmin || user.email === member.email);
  const memberSlug = `${member.firstName.toLowerCase()}-${member.lastName.toLowerCase()}`;

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 pb-16">
      {/* Sidebar */}
      <aside className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-6">
        <FadeIn delay={0}>
          <div className="relative w-full aspect-square rounded-[24px] overflow-hidden bg-haze border border-black-10">
            {member.imageSrc ? (
              <img
                src={member.imageSrc}
                alt={`${member.firstName} ${member.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black-30 font-display text-6xl uppercase">
                {member.firstName[0]}
                {member.lastName[0]}
              </div>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={100} className="flex flex-col gap-2">
          <h2 className="font-sans font-bold text-3xl text-black leading-tight">
            {member.firstName} {member.lastName}
          </h2>
          <p className="text-lg text-black-80">{member.vestTitle}</p>
          
          <div className="flex flex-col gap-1 mt-2">
            {member.classYear && <p className="text-sm text-black-50">Class of {member.classYear}</p>}
            {member.major && <p className="text-sm text-black-50">Major: {member.major}</p>}
            {member.city && <p className="text-sm text-black-50">{member.city}</p>}
            {member.joinedYear && (
              <p className="text-sm text-black-50">
                Joined VEST {member.joinedQuarter ? `${member.joinedQuarter} ` : ""}
                {member.joinedYear}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noreferrer" className="chip bg-haze text-black hover:bg-black-10 transition-colors">
                LinkedIn
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter.startsWith("http") ? member.twitter : `https://x.com/${member.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="chip bg-haze text-black hover:bg-black-10 transition-colors"
              >
                X / Twitter
              </a>
            )}
            {member.github && (
              <a href={member.github} target="_blank" rel="noreferrer" className="chip bg-haze text-black hover:bg-black-10 transition-colors">
                GitHub
              </a>
            )}
            {member.website && (
              <a href={member.website} target="_blank" rel="noreferrer" className="chip bg-haze text-black hover:bg-black-10 transition-colors">
                Website
              </a>
            )}
          </div>

          {canEdit && (
            <Link href={`/members/edit/${memberSlug}`} className="btn btn-inverse mt-4 text-center">
              Edit Profile
            </Link>
          )}

          <Card className="mt-6 p-5 bg-haze">
            <h4 className="eyebrow text-black-80 mb-3">Contact</h4>
            {member.email || member.phone ? (
              isMember ? (
                <ul className="flex flex-col gap-2">
                  {member.email && (
                    <li>
                      <a href={`mailto:${member.email}`} className="text-sm font-medium text-blue hover:text-blue-80 transition-colors">
                        {member.email}
                      </a>
                    </li>
                  )}
                  {member.phone && (
                    <li>
                      <a href={`tel:${member.phone}`} className="text-sm font-medium text-blue hover:text-blue-80 transition-colors">
                        {member.phone}
                      </a>
                    </li>
                  )}
                </ul>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-black-50">Email and phone are visible to logged-in VEST members.</p>
                  <Link href="/members/login" className="text-sm font-medium text-blue hover:text-blue-80 transition-colors">
                    Sign in →
                  </Link>
                </div>
              )
            ) : (
              <p className="text-sm text-black-50">No contact info on file.</p>
            )}
          </Card>
        </FadeIn>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col gap-12">
        <FadeIn delay={200}>
          {member.bio && (
            <p className="text-lg text-black leading-relaxed whitespace-pre-wrap">
              {member.bio}
            </p>
          )}
        </FadeIn>

        {member.currentlyWorkingOn && (
          <FadeIn delay={300}>
            <section className="flex flex-col gap-4">
              <h3 className="font-display text-2xl text-black">Currently working on</h3>
              <p className="text-black-80 leading-relaxed">{member.currentlyWorkingOn}</p>
            </section>
          </FadeIn>
        )}

        {member.interests.length > 0 && (
          <FadeIn delay={400}>
            <section className="flex flex-col gap-4">
              <h3 className="font-display text-2xl text-black">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {member.interests.map((i) => (
                  <span key={i} className="chip bg-haze text-black-80">{i}</span>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {member.experiences.length > 0 && (
          <FadeIn delay={500}>
            <section className="flex flex-col gap-4">
              <h3 className="font-display text-2xl text-black">Experience</h3>
              <div className="flex flex-col gap-4">
                {member.experiences.map((e, idx) => (
                  <Card key={`${e.company}-${idx}`} className="p-5 md:p-6 bg-white border border-black-10 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-1">
                      <h4 className="font-bold text-lg text-black">{e.company}</h4>
                      <span className="text-xs font-mono text-black-50 uppercase tracking-wider">
                        {e.startDate ?? ""}
                        {e.startDate || e.endDate ? " — " : ""}
                        {e.endDate ?? (e.startDate ? "Present" : "")}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-black-80 mb-3">{e.role}</p>
                    {e.description && (
                      <p className="text-sm text-black-80 leading-relaxed">{e.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
