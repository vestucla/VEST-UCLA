"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { collection, query, where, getDocs } from "firebase/firestore";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth, MemberDoc, ExperienceItem } from "@/lib/auth";
import { getFirebaseDb, getFirebaseAuth } from "@/lib/firebase";

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
  const [vestTitle, setVestTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [joinedYear, setJoinedYear] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [status, setStatus] = useState<"active" | "alumni">("active");
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
        const db = getFirebaseDb();
        const slug = params.slug;
        
        // Find member by slug (firstName-lastName format)
        const membersSnap = await getDocs(collection(db, "members"));
        let foundMember: MemberDoc | null = null;
        
        for (const doc of membersSnap.docs) {
          const data = doc.data() as MemberDoc;
          const memberSlug = `${data.firstName?.toLowerCase() ?? ""}-${data.lastName?.toLowerCase() ?? ""}`;
          if (memberSlug === slug) {
            foundMember = { ...data, uid: doc.id };
            break;
          }
        }

        if (!foundMember) {
          toast.error("Member not found");
          router.push("/members");
          return;
        }

        // Check permissions
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
        setPhone(foundMember.phone ?? "");
        setJoinedYear(foundMember.joinedYear ?? "");
        setRole(foundMember.role ?? "member");
        setStatus(foundMember.status ?? "active");
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

  const compressImage = (file: File, maxSize = 200, quality = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          
          // Scale to fit within maxSize x maxSize
          const scale = Math.min(maxSize / width, maxSize / height, 1);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL("image/jpeg", quality);
          resolve(base64);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploadingImage(true);
    try {
      const base64 = await compressImage(file, 200, 0.6);
      setImageSrc(base64);
      toast.success("Photo ready");
    } catch (err) {
      console.error("Compression error:", err);
      toast.error("Failed to process photo");
    } finally {
      setUploadingImage(false);
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
        vestTitle,
        phone,
        joinedYear,
        imageSrc,
        experiences: experiences.filter(
          (exp) => exp.company.trim() || exp.role.trim()
        ),
      };

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
            <Field label="VEST Title" value={vestTitle} onChange={setVestTitle} placeholder="e.g. Director of Recruitment" />
            <Field label="Joined Year" value={joinedYear} onChange={setJoinedYear} placeholder="e.g. 2024" />
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
                    onChange={(e) => setRole(e.target.value as "admin" | "member")}
                    className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "active" | "alumni")}
                    className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
                  >
                    <option value="active">Active</option>
                    <option value="alumni">Alumni</option>
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
              disabled={saving}
              className="h-11 flex-1 rounded-full bg-white/10 px-6 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save profile"}
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
