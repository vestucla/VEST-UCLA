"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth, ExperienceItem } from "@/lib/auth";
import { MembersOrm } from "@/lib/orm/members";
import { invalidateMembersCache } from "@/lib/members";

const emptyExperience: ExperienceItem = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
};

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [currentlyWorkingOn, setCurrentlyWorkingOn] = useState("");
  const [major, setMajor] = useState("");
  const [classYear, setClassYear] = useState("");
  const [city, setCity] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    { ...emptyExperience },
  ]);

  useEffect(() => {
    if (!user?.uuid) return;
    MembersOrm.findByUuid(user.uuid)
      .then((data) => {
        if (!data) return;
        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setBio(data.bio ?? "");
        setInterests((data.interests ?? []).join(", "));
        setCurrentlyWorkingOn(data.currentlyWorkingOn ?? "");
        setMajor(data.major ?? "");
        setClassYear(data.classYear ?? "");
        setCity(data.city ?? "");
        setLinkedin(data.linkedin ?? "");
        setTwitter(data.twitter ?? "");
        setGithub(data.github ?? "");
        setWebsite(data.website ?? "");
        if (data.experiences && data.experiences.length > 0) {
          setExperiences(data.experiences);
        }
      })
      .catch(() => toast.error("Failed to load profile"));
  }, [user]);

  if (loading) {
    return (
      <PortalShell title="Onboarding">
        <p className="text-neutral-400">Loading…</p>
      </PortalShell>
    );
  }

  if (!user) {
    return (
      <PortalShell title="Onboarding">
        <p className="text-neutral-400">Please sign in first.</p>
      </PortalShell>
    );
  }

  const updateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: string
  ) => {
    setExperiences((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  };

  const addExperience = () => {
    setExperiences((prev) => [...prev, { ...emptyExperience }]);
  };

  const removeExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.uuid) return;
    setSaving(true);
    try {
      await MembersOrm.update(user.uuid, {
        firstName,
        lastName,
        bio,
        interests: interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        currentlyWorkingOn,
        major,
        classYear,
        city,
        linkedin,
        twitter,
        github,
        website,
        experiences: experiences.filter(
          (exp) => exp.company.trim() || exp.role.trim()
        ),
        profileCompleted: true,
      });

      invalidateMembersCache();
      toast.success("Profile saved");
      router.push("/members");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <PortalShell
        title={<>Complete <span className="italic">Profile</span></>}
        subtitle="Fill out your public profile so VCs, companies, and members can find you."
      >
        <form
          onSubmit={onSubmit}
          className="mx-auto flex max-w-2xl flex-col gap-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" value={firstName} onChange={setFirstName} />
            <Field label="Last name" value={lastName} onChange={setLastName} />
          </div>

          <Field label="Bio" value={bio} onChange={setBio} textarea />
          <Field
            label="Interests (comma separated)"
            value={interests}
            onChange={setInterests}
            placeholder="Venture Capital, AI, Design"
          />
          <Field
            label="Currently working on"
            value={currentlyWorkingOn}
            onChange={setCurrentlyWorkingOn}
          />

          <div className="grid grid-cols-3 gap-4">
            <Field label="Major" value={major} onChange={setMajor} />
            <Field label="Class year" value={classYear} onChange={setClassYear} />
            <Field label="City" value={city} onChange={setCity} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="LinkedIn"
              value={linkedin}
              onChange={setLinkedin}
              placeholder="https://linkedin.com/in/..."
            />
            <Field
              label="X / Twitter"
              value={twitter}
              onChange={setTwitter}
              placeholder="handle or URL"
            />
            <Field
              label="GitHub"
              value={github}
              onChange={setGithub}
              placeholder="https://github.com/..."
            />
            <Field
              label="Website"
              value={website}
              onChange={setWebsite}
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-wider text-neutral-400">
              Experience
            </h3>
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <SmallField
                    label="Company"
                    value={exp.company ?? ""}
                    onChange={(v) => updateExperience(index, "company", v)}
                  />
                  <SmallField
                    label="Role"
                    value={exp.role ?? ""}
                    onChange={(v) => updateExperience(index, "role", v)}
                  />
                  <SmallField
                    label="Start date"
                    value={exp.startDate ?? ""}
                    onChange={(v) => updateExperience(index, "startDate", v)}
                    placeholder="2024-06"
                  />
                  <SmallField
                    label="End date"
                    value={exp.endDate ?? ""}
                    onChange={(v) => updateExperience(index, "endDate", v)}
                    placeholder="2025-08 or leave blank"
                  />
                </div>
                <SmallField
                  label="Description"
                  value={exp.description ?? ""}
                  onChange={(v) => updateExperience(index, "description", v)}
                  textarea
                />
                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="mt-2 text-xs text-red-300 hover:text-red-200"
                  >
                    Remove experience
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addExperience}
              className="self-start rounded-full border border-white/15 px-4 py-2 text-xs text-white hover:bg-white/5"
            >
              + Add experience
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-11 rounded-full bg-white/10 px-6 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </PortalShell>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  const classes =
    "w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs uppercase tracking-wider text-neutral-400">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${classes} py-3`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${classes} h-11`}
        />
      )}
    </div>
  );
}

function SmallField({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  const classes =
    "w-full rounded-lg border border-white/10 bg-white/5 px-2 text-sm text-white outline-none focus:border-white/25";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] uppercase tracking-wider text-neutral-500">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={`${classes} py-2`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${classes} h-9`}
        />
      )}
    </div>
  );
}
