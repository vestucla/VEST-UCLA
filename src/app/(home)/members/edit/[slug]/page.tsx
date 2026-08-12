"use client";

import { useEffect, useState } from "react";
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

interface Params {
  params: { slug: string };
}

const emptyExperience: ExperienceItem = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
};

export default function EditProfilePage({ params }: Params) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [memberEmail, setMemberEmail] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  // Profile fields
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
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    { ...emptyExperience },
  ]);
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
        const slug = params.slug;
        const docs = await MembersOrm.findAll();
        const foundMember =
          docs.find((d) => memberSlug(d.firstName ?? "", d.lastName ?? "") === slug) ??
          null;

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
  }, [user, loading, isAdmin, params.slug, router]);

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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      URL.revokeObjectURL(previewUrl);
      setImageSrc(data.url as string);
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
        vestTitle: vestTitle || undefined,
        joinedQuarter: joinedQuarter || undefined,
        phone,
        joinedYear,
        experiences: experiences.filter(
          (exp) => exp.company.trim() || exp.role.trim()
        ),
      };

      // Only write Cloudinary/CDN URLs (skip legacy base64 / blob previews)
      if (!imageSrc || imageSrc.startsWith("https://") || imageSrc.startsWith("http://")) {
        payload.imageSrc = imageSrc;
      }

      // Include admin-only fields if admin
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      toast.success("Profile saved!");
      router.push(`/members/${params.slug}`);
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
      <main>
        <PortalShell title="Loading…">
          <p className="text-neutral-400">Loading profile…</p>
        </PortalShell>
      </main>
    );
  }

  if (!canEdit) {
    return null;
  }

  return (
    <main>
      <PortalShell
        title={<>Edit <span className="italic">Profile</span></>}
        subtitle={`Editing ${firstName} ${lastName}'s profile`}
      >
        <form
          onSubmit={onSubmit}
          className="mx-auto flex max-w-2xl flex-col gap-6"
        >
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center">
                  <span className="text-3xl text-white/40">
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
              <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition">
                {uploadingImage ? "Uploading…" : imageSrc ? "Change Photo" : "Upload Photo"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" value={firstName} onChange={setFirstName} />
            <Field label="Last name" value={lastName} onChange={setLastName} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-neutral-400">
                VEST Title
              </label>
              <select
                value={vestTitle}
                onChange={(e) =>
                  setVestTitle((e.target.value as VestTitle) || "")
                }
                className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
              >
                <option value="">None</option>
                {VEST_TITLE_OPTIONS.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Joined Year"
              value={joinedYear}
              onChange={setJoinedYear}
              placeholder="e.g. 2024"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-neutral-400">
                Joined Quarter
              </label>
              <select
                value={joinedQuarter}
                onChange={(e) =>
                  setJoinedQuarter((e.target.value as JoinedQuarter) || "")
                }
                className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
              >
                <option value="">None</option>
                {JOINED_QUARTER_OPTIONS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
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

          <div className="grid grid-cols-3 gap-4">
            <Field label="Major" value={major} onChange={setMajor} />
            <Field label="Class year" value={classYear} onChange={setClassYear} />
            <Field label="City" value={city} onChange={setCity} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" value={phone} onChange={setPhone} placeholder="310-555-0000" />
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

          {/* Admin-only fields */}
          {isAdmin && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-amber-300">
                Admin Controls
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as MemberRole)}
                    className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
                  >
                    <option value={MemberRole.Member}>Member</option>
                    <option value={MemberRole.Admin}>Admin</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MemberStatus)}
                    className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
                  >
                    <option value={MemberStatus.Active}>Active</option>
                    <option value={MemberStatus.Alumni}>Alumni</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Experiences */}
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-11 rounded-full border border-white/15 px-6 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="h-11 flex-1 rounded-full bg-white/10 px-6 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
            >
              {saving ? "Saving…" : uploadingImage ? "Uploading photo…" : "Save profile"}
            </button>
          </div>
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
