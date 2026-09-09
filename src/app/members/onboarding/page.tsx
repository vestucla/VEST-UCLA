"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth, ExperienceItem } from "@/lib/auth";
import { MembersOrm } from "@/lib/orm/members";
import { Input, Textarea } from "@/components/ui/Forms";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";

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
        <p className="text-black-80">Loading…</p>
      </PortalShell>
    );
  }

  if (!user) {
    return (
      <PortalShell title="Onboarding">
        <p className="text-black-80">Please sign in first.</p>
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

      toast.success("Profile saved");
      router.push("/members");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalShell
      title={<>Complete <span className="italic font-sans font-normal text-blue">Profile</span></>}
      subtitle="Fill out your public profile so VCs, companies, and members can find you."
    >
      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-2xl flex-col gap-8 pb-16"
      >
        <Card className="p-6 md:p-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Major" value={major} onChange={setMajor} />
            <Field label="Class year" value={classYear} onChange={setClassYear} />
            <Field label="City" value={city} onChange={setCity} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </Card>

        <Card className="p-6 md:p-8 flex flex-col gap-6">
          <h3 className="eyebrow text-black-80">Experience</h3>
          
          <div className="flex flex-col gap-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-xl border border-black-10 bg-haze p-4 md:p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Company"
                    value={exp.company ?? ""}
                    onChange={(v) => updateExperience(index, "company", v)}
                  />
                  <Field
                    label="Role"
                    value={exp.role ?? ""}
                    onChange={(v) => updateExperience(index, "role", v)}
                  />
                  <Field
                    label="Start date"
                    value={exp.startDate ?? ""}
                    onChange={(v) => updateExperience(index, "startDate", v)}
                    placeholder="2024-06"
                  />
                  <Field
                    label="End date"
                    value={exp.endDate ?? ""}
                    onChange={(v) => updateExperience(index, "endDate", v)}
                    placeholder="Present"
                  />
                </div>
                <Field
                  label="Description"
                  value={exp.description ?? ""}
                  onChange={(v) => updateExperience(index, "description", v)}
                  textarea
                />
                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="self-start text-sm text-black-50 hover:text-red-500 transition-colors"
                  >
                    Remove experience
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="inverse"
              onClick={addExperience}
              className="self-start"
            >
              + Add experience
            </Button>
          </div>
        </Card>

        <Button
          type="submit"
          variant="primary"
          disabled={saving}
          className="self-start w-full md:w-auto"
        >
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </form>
    </PortalShell>
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
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label className="text-xs uppercase tracking-wider text-black-80 font-medium">
        {label}
      </label>
      {textarea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
