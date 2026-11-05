import React, { useState } from 'react';
import {
  Globe,
  BookOpen,
  PenTool,
  Scissors,
  Mail,
  MapPin,
  Check,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  Github,
  Instagram,
  Youtube,
  Threads,
  Tiktok,
  Spotify,
  Roblox,
} from '../components/Icons';
import { bioProfile, bioLinkGroups } from '../data/linksData';
import ThemeToggle from '../components/ThemeToggle';

// Mapping icon identifier to React component
const iconMap = {
  Globe,
  BookOpen,
  PenTool,
  Github,
  Instagram,
  AtSign: Threads,
  Video: Tiktok,
  Scissors,
  Youtube,
  Music: Spotify,
  Gamepad2: Roblox,
};

export default function BioLinksPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bioProfile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      {/* Bio Header Card */}
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar with gradient border */}
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-white dark:border-slate-950 flex items-center justify-center text-white font-extrabold text-2xl">
              HP
            </div>
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 shadow-xs" title="Tersedia"></span>
        </div>

        {/* Name and Pill Badge */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {bioProfile.name}
            </h1>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Sparkles size={12} />
            <span>Software Engineer • Penikmat Buku</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto pt-1 leading-relaxed">
            {bioProfile.bio}
          </p>
        </div>

        {/* Location & Email Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            <MapPin size={13} className="text-blue-500" />
            <span>{bioProfile.location}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-500 transition-colors cursor-pointer"
            title="Klik untuk salin email"
          >
            {copiedEmail ? (
              <Check size={13} className="text-emerald-500" />
            ) : (
              <Mail size={13} className="text-blue-500" />
            )}
            <span>{copiedEmail ? 'Email Disalin!' : bioProfile.email}</span>
          </button>

          <ThemeToggle className="scale-90" />
        </div>
      </div>

      {/* Grouped Link Cards */}
      <div className="space-y-6 pt-2">
        {bioLinkGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              {group.category}
            </h2>

            <div className="space-y-2.5">
              {group.links.map((link) => {
                const IconComponent = iconMap[link.icon] || Globe;
                const isInternal = link.url.startsWith('/');

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target={isInternal ? '_self' : '_blank'}
                    rel={isInternal ? '' : 'noreferrer'}
                    className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                      link.featured
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          link.featured
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
                        }`}
                      >
                        <IconComponent size={20} />
                      </div>

                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-semibold text-sm ${
                              link.featured
                                ? 'text-white'
                                : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
                            }`}
                          >
                            {link.title}
                          </h3>
                          {link.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-blue-700 shadow-xs">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        {link.subtitle && (
                          <p
                            className={`text-xs ${
                              link.featured
                                ? 'text-blue-100'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {link.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`p-1.5 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity ${
                        link.featured ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'
                      }`}
                    >
                      <ArrowUpRight size={18} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
