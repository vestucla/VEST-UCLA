"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth, ExperienceItem } from "@/lib/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { MembersOrm } from "@/lib/orm/members";
import {
  MemberRole,
  MemberStatus,
  VestTitle,
  JoinedQuarter,
  VEST_TITLE_OPTIONS,
  JOINED_QUARTER_OPTIONS,
  memberSlug,
} from "@/data/members";
import { Input, Select, Textarea } from "@/components/ui/Forms";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";

interface Params {
  params: Promise<{ slug: string }>;
}

const emptyExperience: ExperienceItem = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
};

type ApiResponse = {
  url?: unknown;
  error?: unknown;
};

async function readApiResponse(res: Response): Promise<ApiResponse> {
  const text = await res.text();
  try {
    const data: unknown = JSON.parse(text);
    if (data && typeof data === "object") {
      return data as ApiResponse;
    }
  } catch {
    const detail = text.trim().slice(0, 160);
    throw new Error(`Request failed (${res.status})${detail ? `: ${detail}` : ""}`);
  }
  return {};
}

function getApiError(data: ApiResponse, fallback: string): string {
  return typeof data.error === "string" ? data.error : fallback;
}

export default function EditProfilePage({ params }: Params) {
  const { slug } = use(params);
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [memberEmail, setMemberEmail] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);

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
  const [vestTitle, setVestTitle] = useState<VestTitle | "">("");
  const [joinedQuarter, setJoinedQuarter] = useState<JoinedQuarter | "">("");
  const [phone, setPhone] = useState("");
  const [joinedYear, setJoinedYear] = useState("");
  const [role, setRole] = useState<MemberRole>(MemberRole.Member);
  const [status, setStatus] = useState<MemberStatus>(MemberStatus.Active);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([{ ...emptyExperience }]);
  const [imageSrc, setImageSrc] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/members/login");
      return;
    }

    const loadMember = async () => {
      try {
        const docs = await MembersOrm.findAll();
        const foundMember = docs.find((d) => memberSlug(d.firstName ?? "", d.lastName ?? "") === slug) ?? null;

        if (!foundMember) {
          toast.error("Member not found");
          router.push("/members");
          return;
        }

        const isOwnProfile = user.email === foundMember.email;
        if (!isOwnProfile && !isAdmin) {
          toast.error("You can only edit your own profile");
          router.push("/members");
          return;
        }

        setCanEdit(true);
        setMemberEmail(foundMember.email);
        setFirstName(foundMember.firstName ?? "");
        setLastName(foundMember.lastName ?? "");
        setBio(foundMember.bio ?? "");
        setInterests((foundMember.interests ?? []).join(", "));
        setCurrentlyWorkingOn(foundMember.currentlyWorkingOn ?? "");
        setMajor(foundMember.major ?? "");
        setClassYear(foundMember.classYear ?? "");
        setCity(foundMember.city ?? "");
        setLinkedin(foundMember.linkedin ?? "");
        setTwitter(foundMember.twitter ?? "");
        setGithub(foundMember.github ?? "");
        setWebsite(foundMember.website ?? "");
        setVestTitle(foundMember.vestTitle ?? "");
        setJoinedQuarter(foundMember.joinedQuarter ?? "");
        const contact = await MembersOrm.findContactByUuid(foundMember.uuid);
        setPhone(contact?.phone ?? "");
        setJoinedYear(foundMember.joinedYear ?? "");
        setRole(foundMember.role ?? MemberRole.Member);
        setStatus(foundMember.status ?? MemberStatus.Active);
        setImageSrc(foundMember.imageSrc ?? "");
        if (foundMember.experiences && foundMember.experiences.length > 0) {
          setExperiences(foundMember.experiences);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadMember();
  }, [user, loading, isAdmin, slug, router]);

  const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
    setExperiences((prev) => prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)));
  };

  const addExperience = () => {
    setExperiences((prev) => [...prev, { ...emptyExperience }]);
  };

  const removeExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Max size is 5 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImageSrc(previewUrl);
    setUploadingImage(true);

    try {
      const auth = getFirebaseAuth();
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await readApiResponse(res);
      if (!res.ok) throw new Error(getApiError(data, "Upload failed"));
      if (typeof data.url !== "string" || (!data.url.startsWith("https://") && !data.url.startsWith("http://"))) {
        throw new Error("Upload service returned an invalid image URL");
      }

      URL.revokeObjectURL(previewUrl);
      setImageSrc(data.url);
      toast.success("Photo uploaded");
    } catch (err) {
      console.error("Upload error:", err);
      URL.revokeObjectURL(previewUrl);
      setImageSrc("");
      toast.error(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail) return;
    setSaving(true);
    try {
      const auth = getFirebaseAuth();
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      const payload: Record<string, unknown> = {
        targetEmail: memberEmail,
        firstName,
        lastName,
        bio,
        interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
        currentlyWorkingOn,
        major,
        classYear,
        city,
        linkedin,
        twitter,
        github,
        website,
        vestTitle: vestTitle || undefined,
        joinedQuarter: joinedQuarter || undefined,
        phone,
        joinedYear,
        experiences: experiences.filter((exp) => exp.company.trim() || exp.role.trim()),
      };

      if (!imageSrc || imageSrc.startsWith("https://") || imageSrc.startsWith("http://")) {
        payload.imageSrc = imageSrc;
      }

      if (isAdmin) {
        payload.role = role;
        payload.status = status;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch("/api/members/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await readApiResponse(res);
      if (!res.ok) throw new Error(getApiError(data, "Failed to save"));

      toast.success("Profile saved!");
      router.push(`/members/${slug}`);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        toast.error("Save timed out - please try again");
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to save profile");
      }
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingProfile) {
    return (
      <PortalShell title="Loading…">
        <p className="text-black-80">Loading profile…</p>
      </PortalShell>
    );
  }

  if (!canEdit) {
    return null;
  }

  return (
    <PortalShell
      title={<>Edit <span className="italic font-sans font-normal text-blue">Profile</span></>}
      subtitle={`Editing ${firstName} ${lastName}'s profile`}
    >
      <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl flex-col gap-8 pb-16">
        <Card className="p-6 md:p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Profile"
                  className="h-32 w-32 rounded-[12px] object-cover border-2 border-black-10"
                />
              ) : (
                <div className="h-32 w-32 rounded-[12px] bg-haze border-2 border-dashed border-black-20 flex items-center justify-center">
                  <span className="text-3xl text-black-30 font-display uppercase">
                    {firstName?.[0]}{lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              <span className="btn btn-inverse">
                {uploadingImage ? "Uploading…" : imageSrc ? "Change Photo" : "Upload Photo"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="First name" value={firstName} onChange={setFirstName} />
            <Field label="Last name" value={lastName} onChange={setLastName} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs uppercase tracking-wider text-black-80 font-medium">VEST Title</label>
              <Select
                value={vestTitle}
                onChange={(e) => setVestTitle((e.target.value as VestTitle) || "")}
              >
                <option value="">None</option>
                {VEST_TITLE_OPTIONS.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </Select>
            </div>
            <Field label="Joined Year" value={joinedYear} onChange={setJoinedYear} placeholder="e.g. 2024" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs uppercase tracking-wider text-black-80 font-medium">Joined Quarter</label>
              <Select
                value={joinedQuarter}
                onChange={(e) => setJoinedQuarter((e.target.value as JoinedQuarter) || "")}
              >
                <option value="">None</option>
                {JOINED_QUARTER_OPTIONS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </Select>
            </div>
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
            <Field label="Phone" value={phone} onChange={setPhone} placeholder="310-555-0000" />
            <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
            <Field label="X / Twitter" value={twitter} onChange={setTwitter} placeholder="handle or URL" />
            <Field label="GitHub" value={github} onChange={setGithub} placeholder="https://github.com/..." />
            <Field label="Website" value={website} onChange={setWebsite} placeholder="https://..." />
          </div>
        </Card>

        {isAdmin && (
          <Card className="p-6 bg-red-500/10 border-red-500/30">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-red-600">Admin Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs uppercase tracking-wider text-red-800 font-medium">Role</label>
                <Select value={role} onChange={(e) => setRole(e.target.value as MemberRole)}>
                  <option value={MemberRole.Member}>Member</option>
                  <option value={MemberRole.Admin}>Admin</option>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs uppercase tracking-wider text-red-800 font-medium">Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as MemberStatus)}>
                  <option value={MemberStatus.Active}>Active</option>
                  <option value={MemberStatus.Alumni}>Alumni</option>
                </Select>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6 md:p-8 flex flex-col gap-6">
          <h3 className="eyebrow text-black-80">Experience</h3>
          <div className="flex flex-col gap-6">
            {experiences.map((exp, index) => (
              <div key={index} className="flex flex-col gap-4 rounded-xl border border-black-10 bg-haze p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Company" value={exp.company ?? ""} onChange={(v) => updateExperience(index, "company", v)} />
                  <Field label="Role" value={exp.role ?? ""} onChange={(v) => updateExperience(index, "role", v)} />
                  <Field label="Start date" value={exp.startDate ?? ""} onChange={(v) => updateExperience(index, "startDate", v)} placeholder="2024-06" />
                  <Field label="End date" value={exp.endDate ?? ""} onChange={(v) => updateExperience(index, "endDate", v)} placeholder="2025-08 or leave blank" />
                </div>
                <Field label="Description" value={exp.description ?? ""} onChange={(v) => updateExperience(index, "description", v)} textarea />
                {experiences.length > 1 && (
                  <button type="button" onClick={() => removeExperience(index)} className="self-start text-sm text-black-50 hover:text-red-500 transition-colors">
                    Remove experience
                  </button>
                )}
              </div>
            ))}
            <Button type="button" variant="inverse" onClick={addExperience} className="self-start">
              + Add experience
            </Button>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button type="button" variant="inverse" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving || uploadingImage}>
            {saving ? "Saving…" : uploadingImage ? "Uploading photo…" : "Save profile"}
          </Button>
        </div>
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
