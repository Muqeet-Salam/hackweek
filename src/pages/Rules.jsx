import { Link } from "react-router-dom";

export default function Rules() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4 text-left">
      {/* HEADER */}
      <div className="border-4 border-black bg-[#FFD23F] p-6 md:p-8 shadow-[8px_8px_0_black]">
        <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
          Rules & Regulations
        </h1>
        <p className="mt-3 font-bold text-lg text-black/90">
          Official guidelines, submission criteria, and evaluation rules for HackWeek 2026.
        </p>
      </div>

      {/* RULE CATEGORIES */}
      <div className="space-y-6">

        {/* 1. REGISTRATION POLICY */}
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black] space-y-3">
          <h2 className="text-2xl font-black flex items-center gap-2 text-[#00B7FF]">
            <span className="border-2 border-black bg-[#FFF8E7] px-2.5 py-0.5 text-black text-sm font-mono shadow-[2px_2px_0_black]">01</span>
            Registration & Builder Profiles
          </h2>
          <ul className="list-none space-y-2.5 font-medium text-gray-800 ml-1">
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Account Uniqueness:</strong> Every participant must register with a unique email address. Using the same email or phone number for multiple accounts is strictly prohibited.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Identity Validation:</strong> Phone numbers must be exactly 10 digits. Profiles require authentic builder information matching either <em>Student</em> (college, roll number, year) or <em>Professional</em> (company, role) parameters.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>GitHub OAuth Integration:</strong> Authentication is handled strictly via GitHub. Your registration forms must be fully completed before completing the GitHub linkage.</span>
            </li>
          </ul>
        </div>

        {/* 2. CHALLENGE ENROLLMENT */}
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black] space-y-3">
          <h2 className="text-2xl font-black flex items-center gap-2 text-[#FF5D8F]">
            <span className="border-2 border-black bg-[#FFF8E7] px-2.5 py-0.5 text-black text-sm font-mono shadow-[2px_2px_0_black]">02</span>
            Active Tracks & Challenges
          </h2>
          <ul className="list-none space-y-2.5 font-medium text-gray-800 ml-1">
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Categories:</strong> Challenges are divided into six main domains: Frontend, Backend, Fullstack, Design, AI, and Security/Web3.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Availability & Status:</strong> Challenges visibility and details are controlled by settings published by the administrators. Challenges are only visible when the event status is marked live.</span>
            </li>
          </ul>
        </div>

        {/* 3. SOLUTION SUBMISSION GUIDELINES */}
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black] space-y-3">
          <h2 className="text-2xl font-black flex items-center gap-2 text-[#7AE582]">
            <span className="border-2 border-black bg-[#FFF8E7] px-2.5 py-0.5 text-black text-sm font-mono shadow-[2px_2px_0_black]">03</span>
            Solution Submissions
          </h2>
          <ul className="list-none space-y-2.5 font-medium text-gray-800 ml-1">
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Open Source Requirement:</strong> All solution implementations must be hosted publicly on GitHub. Repository URLs must be valid and contain <code>github.com/</code>.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Submission Cap:</strong> Once a project solution is submitted for a challenge, it is recorded in the database. <strong>Submissions can be re-submitted or updated</strong> as many times as you like. Submitting again will update your existing submission with the new details.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Demos & Documentation:</strong> Providing a working deployment URL (Live Demo) and detailed implementation notes increases evaluation quality.</span>
            </li>
          </ul>
        </div>

        {/* 4. EVALUATION & TIE-BREAKER POLICY */}
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black] space-y-3">
          <h2 className="text-2xl font-black flex items-center gap-2 text-[#8338EC]">
            <span className="border-2 border-black bg-[#FFF8E7] px-2.5 py-0.5 text-black text-sm font-mono shadow-[2px_2px_0_black]">04</span>
            Grading & Leaderboard Standings
          </h2>
          <ul className="list-none space-y-2.5 font-medium text-gray-800 ml-1">
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Evaluation Status:</strong> Submissions start as <code>pending</code>. Administrators verify code quality, check prerequisites, and award a score (0 to maximum points) alongside reviewer feedback.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Tie-Breaker Rule:</strong> If multiple builders have matching total scores, the leaderboards resolve the tie by placing the builder with the <strong>higher count of verified challenge submissions</strong> in the leading position. If still tied, standings sort alphabetically by name.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Score Visibility:</strong> Scores, user standings, and reviews are hidden on the dashboard and rankings lists until the admin sets the score settings to live.</span>
            </li>
          </ul>
        </div>

        {/* 5. CODE OF CONDUCT */}
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black] space-y-3">
          <h2 className="text-2xl font-black flex items-center gap-2 text-[#FF595E]">
            <span className="border-2 border-black bg-[#FFF8E7] px-2.5 py-0.5 text-black text-sm font-mono shadow-[2px_2px_0_black]">05</span>
            Code of Conduct
          </h2>
          <ul className="list-none space-y-2.5 font-medium text-gray-800 ml-1">
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Plagiarism Policy:</strong> Submitting templates or plagiarizing projects created by others will result in immediate disqualification and a score of 0.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="text-red-500 font-extrabold text-xl">•</span>
              <span><strong>Collaboration:</strong> Builders must write their own code. While discussions and peer reviews are encouraged, code copying is strictly forbidden.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-4 flex gap-4">
        <Link
          to="/dashboard"
          className="border-4 border-black bg-[#FFD23F] px-6 py-3 font-extrabold shadow-[6px_6px_0_black] hover:bg-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition inline-block text-black"
        >
          Return to Dashboard
        </Link>
        <Link
          to="/challenges"
          className="border-4 border-black bg-[#00B7FF] px-6 py-3 font-extrabold shadow-[6px_6px_0_black] hover:bg-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition inline-block text-white"
        >
          Browse Challenges
        </Link>
      </div>
    </div>
  );
}
