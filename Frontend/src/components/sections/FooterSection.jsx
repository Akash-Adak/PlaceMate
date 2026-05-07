import React from "react";
import { Link } from "react-router-dom";
import { Mail, Linkedin, Twitter, Github, MapPin, Phone, Heart, Globe, Shield, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const FooterSection = () => {
  const { isDark } = useTheme();

  /* ── theme tokens (matching hero + navbar) ────────────────────────────────── */
  const T = {
    footer: isDark
      ? "bg-[#0a0a0f] border-t border-white/10"
      : "bg-white border-t border-indigo-100",

    heading: isDark
      ? "text-white"
      : "text-slate-800",

    subheading: isDark
      ? "text-slate-400"
      : "text-slate-600",

    secondaryText: isDark
      ? "text-slate-500"
      : "text-slate-500",

    divider: isDark
      ? "border-white/10"
      : "border-indigo-100",

    link: isDark
      ? "text-slate-400 hover:text-amber-400 transition-colors"
      : "text-slate-500 hover:text-indigo-600 transition-colors",

    icon: isDark
      ? "text-slate-500 group-hover:text-amber-400"
      : "text-slate-400 group-hover:text-indigo-600",

    accentBar: isDark
      ? "bg-[#0f0f14] border-t border-white/5"
      : "bg-indigo-50/50 border-t border-indigo-100",

    accentText: isDark ? "text-slate-500" : "text-slate-500",
  };

  const footerLinks = {
    product: [
      { name: "Resume Analysis", href: "/resume-parsing" },
      { name: "Mock Interviews", href: "/mock-interview" },
      { name: "Daily Prep", href: "/dashboard" },
      { name: "Pricing Plans", href: "/pricing" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "/careers" },
      { name: "Press & Media", href: "/press" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Compliance", href: "/compliance" },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/company/placemate", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/placemate", label: "Twitter" },
    { icon: Github, href: "https://github.com/placemate", label: "GitHub" },
    { icon: Mail, href: "mailto:placemate.support@gmail.com", label: "Email" },
  ];

  return (
    <footer className={`transition-colors duration-300 ${T.footer}`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg ${isDark ? "bg-amber-500/20" : "bg-gradient-to-br from-indigo-100 to-purple-100"} flex items-center justify-center`}>
                <Sparkles size={16} className={isDark ? "text-amber-400" : "text-indigo-600"} />
              </div>
              <h3 className={`text-xl font-black tracking-tight ${T.heading}`}>
                Place<span className={isDark ? "text-amber-400" : "text-indigo-600"}>Mate</span>
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${T.subheading} max-w-sm`}>
              AI-powered placement preparation for students and early-career professionals. 
              Master interviews, land offers, succeed.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-2 rounded-xl transition-all duration-200 ${isDark ? "hover:bg-white/10" : "hover:bg-indigo-50"}`}
                  aria-label={social.label}
                >
                  <social.icon size={18} className={`transition-colors duration-200 ${T.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h4 className={`text-xs font-black uppercase tracking-widest ${T.heading}`}>Product</h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.product.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.href} className={T.link}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className={`text-xs font-black uppercase tracking-widest ${T.heading}`}>Company</h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.href} className={T.link}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className={`text-xs font-black uppercase tracking-widest ${T.heading}`}>Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.legal.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.href} className={T.link}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Row */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 py-6 mb-8 border-t ${T.divider}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? "bg-white/5" : "bg-indigo-50"}`}>
              <Mail size={16} className={isDark ? "text-amber-400" : "text-indigo-600"} />
            </div>
            <a href="mailto:placemate.support@gmail.com" className={`text-sm ${T.link}`}>
              placemate.support@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? "bg-white/5" : "bg-indigo-50"}`}>
              <Phone size={16} className={isDark ? "text-amber-400" : "text-indigo-600"} />
            </div>
            <a href="tel:+919876543210" className={`text-sm ${T.link}`}>
              +91 98765 43210
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? "bg-white/5" : "bg-indigo-50"}`}>
              <MapPin size={16} className={isDark ? "text-amber-400" : "text-indigo-600"} />
            </div>
            <span className={`text-sm ${T.subheading}`}>
              HIT, Haldia, India
            </span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`pt-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t ${T.divider}`}>
          <div className="flex items-center gap-2 text-xs">
            <Globe size={12} className={T.secondaryText} />
            <span className={T.secondaryText}>English (International)</span>
          </div>
          
          <p className={`text-xs ${T.secondaryText} flex items-center gap-1`}>
            © {new Date().getFullYear()} PlaceMate AI. Made with{" "}
            <Heart size={10} className="text-red-500 inline" /> for future engineers.
          </p>
          
          <div className="flex items-center gap-3 text-xs">
            <Shield size={12} className={T.secondaryText} />
            <span className={T.secondaryText}>v2.0.0</span>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className={`px-6 lg:px-10 py-4 border-t transition-colors duration-300 ${T.accentBar}`}>
        <p className={`text-[11px] text-center max-w-4xl mx-auto ${T.accentText}`}>
          PlaceMate is a product of PlaceMate AI Inc. We're committed to ethical AI and transparent practices in placement preparation.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;