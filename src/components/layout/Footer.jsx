import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaDiscord,
} from "react-icons/fa";
import {
  Mail,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function Footer() {
  const socialLinks = [
    {
      icon: <FaGithub className="h-5 w-5" />,
      href: "https://github.com/cbitosc",
      label: "GitHub",
    },
    {
      icon: <FaInstagram className="h-5 w-5" />,
      href: "https://www.instagram.com/cbitosc/",
      label: "Instagram",
    },
    {
      icon: <FaLinkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/company/cbitosc/",
      label: "LinkedIn",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      href: "mailto:cosc@cbit.ac.in",
      label: "Email",
    },
  ];

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/register", label: "Register" },
    { to: "/profile", label: "Profile" },
    // {
    //   href: "https://discord.gg/kCgMv4PePp",
    //   label: "Join Discord",
    //   external: true,
    //   icon: <FaDiscord className="h-4 w-4 mr-1" />,
    // },
  ];

  const legalLinks = [
    {
      to: "/rules",
      label: "Rules & Regulations",
      external: false,
    },
    {
      href: "https://cbitosc.github.io/",
      label: "Official Website",
      external: true,
    },
  ];

  return (
    <footer className="border-t-4 border-black bg-[#FFF8E7] px-6 py-6 text-center font-extrabold shadow-[0_-6px_0_black]">
      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="COSC Hackweek Logo"
                className="w-8 h-8 object-contain"
              />

              <span className="text-base font-bold">
                COSC Hackweek
              </span>
            </div>

            <p className="text-sm text-black/80">
              Join us for an exciting week of coding challenges,
              collaboration, and innovation at CBIT.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-left">
            <h3 className="text-sm uppercase tracking-wider">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:underline"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="hover:underline"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4 text-left">
            <h3 className="text-sm uppercase tracking-wider">
              Contact
            </h3>

            <a
              href="mailto:cosc@cbit.ac.in"
              className="flex items-center gap-2 hover:underline"
            >
              <Mail className="h-4 w-4" />
              cosc@cbit.ac.in
            </a>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1" />
              <p className="text-sm text-black/80">
                Chaitanya Bharathi Institute of Technology
                <br />
                Gandipet, Hyderabad
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm">
                Contact Numbers
              </p>

              <a
                href="tel:+91 9959525751"
                className="flex items-center gap-2 hover:underline"
              >
                <Phone className="h-4 w-4" />
                Muqeet: +91 9959525751
              </a>

              <a
                href="tel:+91 63097 50200"
                className="flex items-center gap-2 hover:underline"
              >
                <Phone className="h-4 w-4" />
                Ashwith: +91 63097 50200
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-black/20">

          <h1 className="text-6xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] uppercase font-body select-none flex justify-center mb-6">
            {"HACKWEEK26".split("").map((char, index) => (
              <motion.span
                key={index}
                animate={{
                  y: [2, -6, 2],
                  rotate: [-1.5, 1.5, -1.5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4,
                }}
                className="inline-block text-black"
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <div className="flex justify-center gap-6">
            {legalLinks.map((link) => (
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm hover:underline"
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center gap-1 text-sm hover:underline"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}