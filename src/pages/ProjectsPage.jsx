import React, { useState, useEffect } from 'react';
import { ExternalLink, Code2, Sparkles, Globe, Layers, Loader2 } from 'lucide-react';
import { Github } from '../components/Icons';
import { fetchProjects } from '../services/firebase';

const STATUS_LABELS = {
  selesai: 'Selesai',
  ongoing: 'Ongoing',
};

const STATUS_COLORS = {
  selesai: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  ongoing: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
};

function TechTag({ label }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      {label}
    </span>
  );
}

function ProjectCard({ project }) {
  const techList = project.tech
    ? project.tech.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div
      className={`group flex flex-col rounded-2xl border bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${
        project.featured
          ? 'border-blue-400 dark:border-blue-700 ring-1 ring-blue-400/30 dark:ring-blue-700/30'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Cover Image (16:9) */}
      <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Code2 size={36} className="text-slate-300 dark:text-slate-600" />
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-sm">
            <Sparkles size={10} />
            Featured
          </span>
        )}

        {/* Status Badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[project.status] || 'bg-slate-100 text-slate-700'}`}
        >
          {STATUS_LABELS[project.status] || project.status}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Tech Tags */}
        {techList.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techList.slice(0, 4).map((tech) => (
              <TechTag key={tech} label={tech} />
            ))}
            {techList.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] text-slate-400 dark:text-slate-500">
                +{techList.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Title & Description */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
              {project.title}
            </h3>
            {project.year && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                {project.year}
              </span>
            )}
          </div>
          {project.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
              {project.description}
            </p>
          )}
        </div>

        {/* Links */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Globe size={12} />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Github size={12} />
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('semua');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('ProjectsPage fetch error:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = filter === 'semua'
    ? projects
    : projects.filter((p) => p.status === filter);

  const filters = [
    { key: 'semua', label: 'Semua', count: projects.length },
    { key: 'selesai', label: 'Selesai', count: projects.filter((p) => p.status === 'selesai').length },
    { key: 'ongoing', label: 'Ongoing', count: projects.filter((p) => p.status === 'ongoing').length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Page Header */}
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
          <Layers size={13} />
          <span>Portofolio Proyek</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Proyek & Karya
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Kumpulan proyek yang pernah saya bangun — dari eksplorasi teknis hingga produk yang digunakan nyata.
          Tiap proyek adalah cerita tentang belajar dan bereksperimen.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
              filter === f.key
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                filter === f.key
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
          <Loader2 size={28} className="animate-spin text-blue-500" />
          <span className="text-sm">Memuat proyek...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Code2 size={28} className="text-slate-400" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Belum ada proyek</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filter === 'semua'
                ? 'Proyek akan muncul di sini setelah ditambahkan.'
                : `Belum ada proyek dengan status "${STATUS_LABELS[filter] || filter}".`}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
