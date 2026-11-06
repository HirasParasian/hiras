import React, { useState, useEffect } from 'react';
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
  Briefcase,
  GraduationCap,
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
import { fetchBioProfile } from '../services/firebase';
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
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('hiras_bio_profile');
      return cached ? { ...bioProfile, ...JSON.parse(cached) } : bioProfile;
    } catch {
      return bioProfile;
    }
  });
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const cloudProfile = await fetchBioProfile();
        if (cloudProfile && cloudProfile.name) {
          setProfile((prev) => ({ ...prev, ...cloudProfile }));
        }
      } catch (err) {
        console.warn('Load bio profile warning:', err);
      }
    };

    const loadExtended = async () => {
      try {
        const data = await fetchProfileExtended();
        if (data) {
          setExperience(Array.isArray(data.experience) ? data.experience : []);
          setEducation(Array.isArray(data.education) ? data.education : []);
        }
      } catch (err) {
        console.warn('Load profile extended warning:', err);
      }
    };

    loadProfile();
    loadExtended();
  }, []);

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profile.email || bioProfile.email);
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
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-900 border-2 border-white dark:border-slate-950 flex items-center justify-center">
              <img
                src={profile.avatar || "/icon-h.png"}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span
            className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 shadow-xs"
            title={profile.status || "Tersedia"}
          ></span>
        </div>

        {/* Name and Pill Badge */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {profile.name}
            </h1>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Sparkles size={12} />
            <span>{profile.tagline || 'Software Engineer • Penikmat Buku'}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto pt-1 leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Location & Email Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            <MapPin size={13} className="text-blue-500" />
            <span>{profile.location}</span>
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
            <span>{copiedEmail ? 'Email Disalin!' : (profile.email || bioProfile.email)}</span>
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

      {/* Work Experience Section */}
      {experience.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <Briefcase size={16} className="text-blue-500" />
            Pengalaman Kerja
          </h2>
          <div className="space-y-3">
            {experience.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                {/* Logo / Initial */}
                <div className="shrink-0 w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  {item.logo ? (
                    <img src={item.logo} alt={item.company} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {(item.company || 'C').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                    {item.role}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{item.company}</p>
                  {item.period && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{item.period}</p>
                  )}
                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <GraduationCap size={16} className="text-blue-500" />
            Pendidikan
          </h2>
          <div className="space-y-3">
            {education.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                {/* Logo / Initial */}
                <div className="shrink-0 w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  {item.logo ? (
                    <img src={item.logo} alt={item.institution} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {(item.institution || 'I').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                    {item.degree}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{item.institution}</p>
                  {item.period && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{item.period}</p>
                  )}
                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
