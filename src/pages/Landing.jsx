import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence  } from "framer-motion";
import SplineCore from "../components/SplineCore";
import {
  Award,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Code2,
  Gift,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useAuthStore } from "../store/authstore";

export function RotatingTagline() {
  const texts = [
    "A week-long sprint for serious builders.",
    "Join collaborators. Ship real projects.",
    "Turn ideas into production-ready systems.",
  ];

  const [index, setIndex] = useState(0);

  const handleHover = () => {
    setIndex((prev) => (prev + 1) % texts.length);
  };

  const reset = () => {
    setIndex(0);
  };

  return (
    <div
      onMouseEnter={handleHover}
      onMouseLeave={reset}
      className="border-l-4 border-black pl-3 h-10 overflow-hidden cursor-pointer"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="h-10 flex items-center text-lg font-medium"
        >
          {texts[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stats = [
  { value: "1000+", label: "Participants" },
  { value: "50+", label: "Challenges" },
  { value: "₹2L+", label: "Prizes" },
];

const highlights = [
  {
    icon: Code2,
    title: "Build and collaborate",
    copy: "Ship real projects with people who actually want to build.",
    color: "#00B7FF",
  },
  {
    icon: Trophy,
    title: "Compete & rank up",
    copy: "Earn points, climb leaderboard, and stand out.",
    color: "#FFD23F",
  },
  {
    icon: ShieldCheck,
    title: "Show your proof",
    copy: "Turn GitHub activity into real-world credibility.",
  },
];

const timeline = [
  {
    date: "June 15",
    title: "Registration Opens",
    description: "Create your profile and secure your spot.",
    icon: CalendarCheck,
    color: "#00B7FF",
  },
  {
    date: "July 6",
    title: "HackWeek Launch",
    description: "Challenges go live and the sprint begins.",
    icon: Rocket,
    color: "#FFD23F",
  },
  {
    date: "July 7-11",
    title: "Build & Submit",
    description: "Complete challenges and earn points daily.",
    icon: Code2,
    color: "#7AE582",
  },
  {
    date: "July 12",
    title: "Final Deadline",
    description: "All submissions close at midnight.",
    icon: Clock,
    color: "#FF595E",
  },
];

const faqs = [
  {
    question: "Who can participate?",
    answer:
      "Anyone interested in technology, development, design, AI, cybersecurity, or open source can join.",
  },
  {
    question: "Is HackWeek free?",
    answer:
      "Yes. Registration and participation are completely free.",
  },
  {
    question: "Do I need a team?",
    answer:
      "No. HackWeek is designed primarily for individual participation.",
  },
  {
    question: "How are winners selected?",
    answer:
      "Participants earn points by completing challenges and submitting valid proof.",
  },
];

const steps = [
  {
    number: "01",
    icon: Users,
    title: "Register",
    desc: "Sign in with GitHub and create your HackWeek profile.",
  },
  {
    number: "02",
    icon: Code2,
    title: "Explore",
    desc: "Browse challenges and plan your strategy.",
  },
  {
    number: "03",
    icon: Award,
    title: "Build",
    desc: "Complete challenges and develop real projects.",
  },
  {
    number: "04",
    icon: Gift,
    title: "Submit",
    desc: "Upload repositories, demos, and proof of work.",
  },
  {
    number: "05",
    icon: Trophy,
    title: "Compete",
    desc: "Earn points and climb the leaderboard.",
  },
  {
    number: "06",
    icon: Rocket,
    title: "Win",
    desc: "Unlock achievements, rewards, and recognition.",
  },
];

export default function Landing() {
  const user = useAuthStore((state) => state.user);
  const primaryCta = user ? "/dashboard" : "/login";

  return (
    <div className="h-screen overflow-y-scroll md:snap-y md:snap-mandatory bg-[#FFF8E7] space-y-10 md:space-y-0">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden snap-start flex items-center border-4 border-black bg-white shadow-[12px_12px_0_black] px-6 md:px-12 py-6 overflow-hidden">

        {/* background shapes */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-16 -left-16 h-52 w-52 rotate-12 bg-[#FFD23F] border-4 border-black" />
          <div className="absolute -bottom-16 -right-16 h-52 w-52 -rotate-12 bg-[#00B7FF] border-4 border-black" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-10 w-full items-center">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* tight heading */}
            <div className="leading-[0.8]">
              <h1 className="text-6xl md:text-8xl font-extrabold">
                Hackweek
              </h1>
              <h1 className="text-6xl md:text-8xl font-extrabold">
                2026
              </h1>
            </div>

            {/* rotating tagline */}
            <RotatingTagline />

            {/* INFO CARDS */}
            <div className="flex items-center gap-3 flex-wrap">

              {/* DATE CARD (NO HOVER) */}
              <div className="w-fit select-none border-4 border-black bg-[#FFD23F] p-5 shadow-[6px_6px_0_black]">
                <div className="font-bold space-y-1">
                  <p>July 6th – July 12th</p>
                  <p>7 Days of Building</p>
                </div>
              </div>

              {/* INFO CARD (NO HOVER) */}
              <div className="w-fit select-none border-4 border-black bg-[#FFD23F] p-5 shadow-[6px_6px_0_black]">
                <div className="font-bold space-y-1">
                  <p>Build & collaborate</p>
                  <p>Exciting Challenges</p>
                </div>
              </div>

            </div>

            {/* LOGIN BUTTON CENTERED */}
            <div className="flex justify-start pl-2 mt-4">
              <Link
                to="/login"
                className="border-4 border-black bg-[#00B7FF] px-6 py-5 font-extrabold shadow-[6px_6px_0_black] transition-all duration-150 hover:-translate-y-1 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                Login
              </Link>
            </div>

            {/* small extra info strip */}
          
          </div>

          {/* RIGHT SIDE - 3D HERO */}
          <div className="relative h-[70vh] overflow-hidden shadow-[10px_10px_0_black] hidden md:block">
            <div className="scale-125 origin-center w-full h-full">
              <spline-viewer
                url="https://prod.spline.design/cfVf9fOnUjYYPFif/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
      <section className="min-h-screen snap-start flex items-center px-6 md:px-12">

      <div className="w-full">

        {/* Section Header */}
        <div className="mb-14 max-w-3xl">

          <h2 className="text-5xl md:text-7xl font-extrabold leading-none">
            More than just
            <br />
            another hackathon.
          </h2>

        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 lg:grid-cols-12">

          {/* Large Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-5 border-4 border-black bg-[#00B7FF] p-8 shadow-[10px_10px_0_black]"
          >
            <Code2 size={48} />

            <h3 className="mt-6 text-4xl font-extrabold">
              Build & Collaborate
            </h3>

            <p className="mt-4 text-lg font-medium leading-8">
              Work alongside talented developers,
              exchange ideas, and build projects
              that actually ship.
            </p>

            <div className="mt-8 inline-block border-4 border-black bg-white px-4 py-2 font-bold">
              50+ Challenges
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="lg:col-span-7 grid gap-6">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="border-4 border-black bg-[#FFD23F] p-8 shadow-[10px_10px_0_black]"
            >
              <Trophy size={42} />

              <div className="flex items-center justify-between mt-4">
                <h3 className="text-3xl font-extrabold">
                  Compete & Rank Up
                </h3>
              </div>

              <p className="mt-4 text-lg font-medium">
                Earn points, unlock achievements,
                and climb the leaderboard.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="border-4 border-black bg-[#7AE582] p-8 shadow-[10px_10px_0_black]"
            >
              <ShieldCheck size={42} />

              <div className="flex items-center justify-between mt-4">
                <h3 className="text-3xl font-extrabold">
                  Showcase Proof
                </h3>
              </div>

              <p className="mt-4 text-lg font-medium">
                Turn your GitHub profile into visible proof
                of what you can actually build.
              </p>
            </motion.div>

          </div>

        </div>
      </div>

    </section>

      {/* ================= TIMELINE ================= */}
      <section className="min-h-screen snap-start flex items-center px-6 md:px-12">

        <div className="w-full">

          <div className="mb-14 max-w-3xl">

            <h2 className="mt-5 text-5xl md:text-7xl font-extrabold leading-none">
              Seven days.
              <br />
              Endless building.
            </h2>
          </div>

          <div className="relative">

            <div className="absolute left-8 top-0 h-full w-2 bg-black" />

            <div className="space-y-8">

              {timeline.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className={`relative ml-20 border-4 border-black bg-white p-6 shadow-[10px_10px_0_black]
                      ${index % 2 === 0 ? "lg:mr-32" : "lg:ml-32"}
                    `}
                  >

                    <div
                      className="absolute -left-[72px] top-8 flex h-14 w-14 items-center justify-center border-4 border-black shadow-[4px_4px_0_black]"
                      style={{ background: item.color }}
                    >
                      <Icon size={24} />
                    </div>

                    <span className="inline-block border-4 border-black bg-[#FFF8E7] px-3 py-1 font-bold">
                      {item.date}
                    </span>

                    <h3 className="mt-4 text-3xl font-extrabold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-lg font-medium">
                      {item.description}
                    </p>

                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>

      </section>
      {/* ================= STEPS ================= */}
      <section className="min-h-screen snap-start flex items-center px-6 md:px-12">

        <div className="w-full">

          {/* Header */}
          <div className="mb-16 max-w-3xl">


            <h2 className="mt-5 text-5xl md:text-7xl font-extrabold leading-none">
              From signup
              <br />
              to victory.
            </h2>

            <p className="mt-5 text-lg font-medium leading-8">
              HackWeek is designed to be simple. Join, build, submit,
              and compete throughout the week.
            </p>

          </div>

          {/* Steps */}
          <div className="relative">

            {/* Connecting line */}
            <div className="absolute top-10 left-0 right-0 h-2 bg-black hidden lg:block" />

            <div className="grid gap-6 lg:grid-cols-6">

              {steps.map((step, index) => {
                const Icon = step.icon;

                const colors = [
                  "#00B7FF",
                  "#FFD23F",
                  "#7AE582",
                  "#FF5D8F",
                  "#FF595E",
                  "#00B7FF",
                ];

                return (
                  <motion.div
                    key={step.number}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="relative"
                  >
                    {/* Step Circle */}
                    <div
                      className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center border-4 border-black shadow-[6px_6px_0_black]"
                      style={{ background: colors[index] }}
                    >
                      <Icon size={32} />
                    </div>

                    {/* Card */}
                    <div
                      className={`mt-6 border-4 border-black bg-white p-5 shadow-[8px_8px_0_black]
                      ${index % 2 === 0 ? "lg:translate-y-0" : "lg:translate-y-8"}
                    `}
                    >
                      <div className="text-sm font-extrabold opacity-50">
                        STEP {step.number}
                      </div>

                      <h3 className="mt-2 text-2xl font-extrabold">
                        {step.title}
                      </h3>

                      <p className="mt-2 font-medium leading-7">
                        {step.desc}
                      </p>
                    </div>

                  </motion.div>
                );
              })}

            </div>

          </div>

        </div>

      </section>

      {/* ================= FAQ ================= */}
      <section className="min-h-screen snap-start flex items-center p-6 md:p-12">

        <div className="w-full grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div className="space-y-6">

            <div className="inline-block border-4 border-black bg-[#FFD23F] px-4 py-2 font-extrabold shadow-[6px_6px_0_black]">
              Frequently Asked Questions
            </div>

            <h2 className="text-5xl md:text-7xl font-extrabold leading-[0.9]">
              Got
              <br />
              Questions?
            </h2>

            <p className="text-lg font-medium max-w-lg">
              Everything you need to know before joining HackWeek 2026.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              {/*
              <div className="border-4 border-black bg-[#00B7FF] p-4 shadow-[6px_6px_0_black]">
                <p className="text-3xl font-extrabold">1000+</p>
                <p className="font-bold">Builders</p>
              </div>

              <div className="border-4 border-black bg-[#7AE582] p-4 shadow-[6px_6px_0_black]">
                <p className="text-3xl font-extrabold">50+</p>
                <p className="font-bold">Challenges</p>
              </div>
                */}
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border-4 border-black bg-white shadow-[8px_8px_0_black]"
              >
                <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between font-extrabold text-xl">

                  {faq.question}

                  <span className="text-3xl transition-transform group-open:rotate-45">
                    +
                  </span>

                </summary>

                <div className="border-t-4 border-black bg-[#FFF8E7] px-6 py-5 font-medium leading-7">
                  {faq.answer}
                </div>

              </details>
            ))}

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="min-h-screen snap-start flex items-center justify-center p-6 md:p-12">

        <div className="relative max-w-5xl w-full border-4 border-black bg-[#FF595E] p-12 md:p-16 shadow-[14px_14px_0_black] overflow-hidden">

          <div className="absolute -top-16 -right-16 h-40 w-40 bg-[#FFD23F] border-4 border-black rotate-12" />
          <div className="absolute -bottom-16 -left-16 h-40 w-40 bg-[#00B7FF] border-4 border-black -rotate-12" />

          <div className="relative z-10 text-center">

            <p className="font-extrabold uppercase tracking-widest text-white">
              HackWeek 2026
            </p>

            <h2 className="mt-4 text-5xl md:text-7xl font-extrabold text-white leading-[0.9]">
              Build.
              <br />
              Ship.
              <br />
              Win.
            </h2>

            <p className="mt-6 text-lg md:text-xl font-medium text-white max-w-2xl mx-auto">
              Join hundreds of builders, complete challenges, climb the leaderboard,
              and prove what you can create in just seven days.
            </p>

            <Link
              to={primaryCta}
              className="inline-block mt-10 border-4 border-black bg-white px-10 py-5 text-xl font-extrabold shadow-[8px_8px_0_black] hover:-translate-y-1 transition"
            >
              Enter Platform →
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}