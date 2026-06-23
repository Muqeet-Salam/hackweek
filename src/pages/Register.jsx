import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut, GithubAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Button from "../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();
  const provider = new GithubAuthProvider();

  const [participantType, setParticipantType] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",

    collegeName: "",
    rollNumber: "",
    degree: "",
    year: "",

    companyName: "",
    role: "",
    experience: "",

    linkedin: "",
    portfolio: "",
  });

  // ---------------- VALIDATION ----------------
  const isStudentValid =
    form.fullName &&
    form.email &&
    form.phone &&
    form.collegeName &&
    form.rollNumber &&
    form.degree &&
    form.year;

  const isProfessionalValid =
    form.fullName &&
    form.email &&
    form.phone &&
    form.companyName &&
    form.role;

  const canSubmit =
    participantType === "student"
      ? isStudentValid
      : isProfessionalValid;

  // ---------------- HANDLER ----------------
  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  // ---------------- REGISTER FLOW ----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    try {
      setLoading(true);
      setError("");

      // 1. GitHub OAuth
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);
      const github = additionalInfo?.profile;
      const githubUsername = github?.login || user.displayName || "";
      const email = form.email.trim().toLowerCase();

      // 2. Prevent duplicate email
      const emailRef = doc(db, "emails", email);
      const existingEmail = await getDoc(emailRef);
      if (existingEmail.exists()) {
        await signOut(auth);
        setError("This email is already registered. Use login instead.");
        return;
      }

      // 3. Prevent duplicate registration by uid
      const userRef = doc(db, "users", user.uid);
      const existingUser = await getDoc(userRef);
      if (existingUser.exists()) {
        navigate("/dashboard");
        return;
      }

      // 4. Save user data and fast lookup mappings
      await setDoc(userRef, {
        ...form,
        participantType,
        githubUsername,
        githubAvatar: github?.avatar_url || user.photoURL || "",
        githubProfile: github?.html_url || "",
        uid: user.uid,
        email,
        createdAt: new Date().toISOString(),
      });

      await setDoc(doc(db, "usernames", githubUsername), {
        uid: user.uid,
      });

      await setDoc(emailRef, {
        uid: user.uid,
      });

      // 5. Redirect
      navigate("/dashboard");
    } catch (err) {
      console.log("Register error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl border-4 border-black bg-white p-8 shadow-[10px_10px_0_black] space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-5xl font-extrabold">
            Register for HackWeek 2026
          </h1>

          <p className="mt-3 font-medium text-lg">
            Fill required fields (*) before GitHub authentication
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-10">

          {/* BASIC */}
          <section>
            <h2 className="text-2xl font-extrabold mb-4">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name *" value={form.fullName} onChange={handleChange("fullName")} />
              <Input label="Email *" value={form.email} onChange={handleChange("email")} />
              <Input label="Phone *" value={form.phone} onChange={handleChange("phone")} />
            </div>
          </section>

          {/* TYPE */}
          <section>
            <h2 className="text-2xl font-extrabold mb-4">Participant Type</h2>

            <div className="flex gap-3">
              <TypeButton
                active={participantType === "student"}
                onClick={() => setParticipantType("student")}
                label="Student"
                color="#00B7FF"
              />

              <TypeButton
                active={participantType === "professional"}
                onClick={() => setParticipantType("professional")}
                label="Professional"
                color="#7AE582"
              />
            </div>
          </section>

          {/* STUDENT */}
          {participantType === "student" && (
            <section>
              <h2 className="text-2xl font-extrabold mb-4">Academic Info</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="College *" value={form.collegeName} onChange={handleChange("collegeName")} />
                <Input label="Roll No *" value={form.rollNumber} onChange={handleChange("rollNumber")} />
                <Input label="Degree *" value={form.degree} onChange={handleChange("degree")} />
                <Input label="Year *" value={form.year} onChange={handleChange("year")} />
              </div>
            </section>
          )}

          {/* PROFESSIONAL */}
          {participantType === "professional" && (
            <section>
              <h2 className="text-2xl font-extrabold mb-4">Work Info</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Company *" value={form.companyName} onChange={handleChange("companyName")} />
                <Input label="Role *" value={form.role} onChange={handleChange("role")} />
                <Input label="Experience" value={form.experience} onChange={handleChange("experience")} />
              </div>
            </section>
          )}

          {/* LINKS */}
          <section>
            <h2 className="text-2xl font-extrabold mb-4">Links</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Input label="LinkedIn" value={form.linkedin} onChange={handleChange("linkedin")} />
              <Input label="Portfolio" value={form.portfolio} onChange={handleChange("portfolio")} />
            </div>
          </section>

          {/* SUBMIT */}
          <div className="pt-4">
            {error && (
              <p className="text-sm text-red-500 font-bold mb-3">
                {error}
              </p>
            )}

            {!canSubmit && (
              <p className="text-sm text-red-500 font-medium mb-2">
                Fill all required fields (*) to continue
              </p>
            )}

            <Button
              type="submit"
              disabled={!canSubmit || loading}
              className={!canSubmit ? "opacity-50 cursor-not-allowed" : ""}
            >
              {loading ? "Registering..." : "Register with GitHub →"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ---------------- INPUT ---------------- */
function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block font-bold mb-2">{label}</label>

      <input
        value={value}
        onChange={onChange}
        className="w-full border-4 border-black bg-[#FFF8E7] px-4 py-3 font-medium outline-none focus:bg-white"
      />
    </div>
  );
}

/* ---------------- TYPE BUTTON ---------------- */
function TypeButton({ active, onClick, label, color }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-4 border-black px-6 py-3 font-bold shadow-[6px_6px_0_black]"
      style={{ backgroundColor: active ? color : "white" }}
    >
      {label}
    </button>
  );
}