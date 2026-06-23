import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import { useAuthStore } from "../store/authstore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const formatDate = (value) => {
  if (!value) return "Unknown";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);

        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.log("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="p-6 font-bold text-xl">
        Loading profile...
      </div>
    );
  }

  const username =
    profile?.githubUsername ??
    user?.displayName ??
    user?.email?.split("@")[0] ??
    "Builder";

  const displayName =
    profile?.fullName ?? profile?.displayName ?? "GitHub user";

  const avatarUrl =
    profile?.githubAvatar ?? user?.photoURL ?? "";

  const createdAt = profile?.createdAt;

  const email = profile?.email ?? user?.email;

  const participantType = profile?.participantType ?? "unknown";

  const college = profile?.collegeName;
  const company = profile?.companyName;

  return (
    <div className="space-y-8">

      {/* HERO */}
      <section className="grid grid-cols-1 gap-4 border-4 border-black shadow-[10px_10px_0_black] p-6 bg-white md:grid-cols-[auto_1fr] md:items-center">

        {avatarUrl ? (
          <img
            src={avatarUrl}
            className="h-24 w-24 border-4 border-black object-cover"
          />
        ) : (
          <div className="h-24 w-24 border-4 border-black bg-[#00B7FF] flex items-center justify-center font-extrabold text-2xl">
            {username.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-sm">
            HackWeek Participant
          </p>

          <h1 className="mt-2 text-4xl font-extrabold">
            {displayName}
          </h1>

          <p className="mt-2 font-medium text-lg">
            @{username}
          </p>

          <p className="mt-2 font-medium">
            {participantType === "student"
              ? `Student ${college ? `at ${college}` : ""}`
              : `Working at ${company ?? "Unknown company"}`}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <h2 className="text-2xl font-extrabold">
            {participantType}
          </h2>
          <p className="font-bold mt-1">Participant Type</p>
        </Card>

        <Card>
          <h2 className="text-2xl font-extrabold">
            {formatDate(createdAt)}
          </h2>
          <p className="font-bold mt-1">Registered On</p>
        </Card>

        <Card>
          <h2 className="text-2xl font-extrabold">
            {email || "N/A"}
          </h2>
          <p className="font-bold mt-1">Email</p>
        </Card>

      </section>

      {/* DETAILS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card>
          <h2 className="text-2xl font-extrabold mb-4">
            Profile Data
          </h2>

          <div className="space-y-2 font-medium">
            <p>Full Name: {profile?.fullName}</p>
            <p>Phone: {profile?.phone}</p>
            <p>GitHub: {profile?.githubUsername}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-extrabold mb-4">
            Work / Study Info
          </h2>

          <div className="space-y-2 font-medium">
            {participantType === "student" ? (
              <>
                <p>College: {profile?.collegeName}</p>
                <p>Degree: {profile?.degree}</p>
                <p>Year: {profile?.year}</p>
              </>
            ) : (
              <>
                <p>Company: {profile?.companyName}</p>
                <p>Role: {profile?.role}</p>
                <p>Experience: {profile?.experience}</p>
              </>
            )}
          </div>
        </Card>

      </section>
    </div>
  );
}