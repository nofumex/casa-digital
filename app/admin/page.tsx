"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import clsx from "clsx";

const ADMIN_PASSWORD = "admin123"; // changeable constant
const AUTH_KEY = "adminAuth";

type BlogPost = { slug: string; title: string; date: string; content: string; tags: string[]; image?: string };
type CaseItem = {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  timeline?: string;
  year?: string;
  client?: string;
  task?: string;
  solution?: string;
  results?: { title?: string; value?: string }[];
  features?: string[];
  gallery?: Array<{ url: string; description?: string }>;
  technologies?: string[];
  review?: { text: string; author?: string } | null;
  coverImage?: string;
  domain?: string;
};

type TabKey =
  | "home"
  | "pricing"
  | "portfolio";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [active, setActive] = useState<TabKey>("home");

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved && saved === ADMIN_PASSWORD) {
      setAuthed(true);
      return;
    }
    const ask = async () => {
      const pwd = window.prompt("Введите пароль администратора:") || "";
      if (pwd === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_KEY, pwd);
        setAuthed(true);
        toast.success("Вход выполнен");
      } else {
        toast.error("Неверный пароль");
        setAuthed(false);
      }
    };
    ask();
  }, []);

  if (!authed) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Toaster />
        <div className="text-center text-sm text-slate-500">Требуется пароль администратора… Обновите страницу для повторной попытки.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Toaster />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Casa Digital — Admin</h1>
        <button
          className="text-sm rounded-md border px-3 py-1 hover:bg-white"
          onClick={() => {
            localStorage.removeItem(AUTH_KEY);
            setAuthed(false);
            toast("Вы вышли");
            location.reload();
          }}
        >Выйти</button>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3">
          <nav className="space-y-1">
            {[
              { k: "home", t: "Главная" },
              { k: "portfolio", t: "Портфолио" },
              { k: "pricing", t: "Pricing" },
            ].map((i) => (
              <button
                key={i.k}
                className={clsx(
                  "w-full text-left rounded-md px-3 py-2 text-sm ring-1 ring-black/5",
                  active === (i.k as TabKey) ? "bg-white" : "bg-white/50 hover:bg-white"
                )}
                onClick={() => setActive(i.k as TabKey)}
              >{i.t}</button>
            ))}
          </nav>
        </aside>
        <main className="col-span-12 md:col-span-9">
          {active === "home" && <HomeSection />}
          {active === "pricing" && <PricingSection />}
          {active === "portfolio" && <PortfolioSection />}
        </main>
      </div>
    </div>
  );
}

function useAdminHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_KEY) : null;
  return useMemo(() => ({
    "Content-Type": "application/json",
    "x-admin-token": token || "",
  }), [token]);
}

function BlogSection() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const headers = useAdminHeaders();

  const form = useForm<{ items: BlogPost[] }>({ defaultValues: { items: [] } });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/cms/blog.json", { cache: "no-store" });
        const data: BlogPost[] = res.ok ? await res.json() : [];
        setPosts(data);
        form.reset({ items: data });
      } catch (e) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [form]);

  const onSave = form.handleSubmit(async (values) => {
    const res = await fetch("/api/admin/update-blog", {
      method: "POST",
      headers,
      body: JSON.stringify(values.items),
    });
    if (res.ok) {
      toast.success("Блог сохранен");
    } else {
      toast.error("Ошибка сохранения блога");
    }
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Блог</h2>
        <div className="flex gap-2">
          <button onClick={() => append({ slug: "", title: "", date: "", content: "", tags: [], image: "" })} className="rounded-md border px-3 py-1 text-sm hover:bg-white">Добавить</button>
          <button onClick={onSave} className="rounded-md bg-paleTeal px-3 py-1 text-sm text-slate-900">Сохранить</button>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl bg-white p-4 ring-1 ring-black/5">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">Slug<input className="mt-1 w-full rounded border px-3 py-2" {...form.register(`items.${index}.slug` as const)} /></label>
              <label className="text-sm">Title<input className="mt-1 w-full rounded border px-3 py-2" {...form.register(`items.${index}.title` as const)} /></label>
              <label className="text-sm">Date<input className="mt-1 w-full rounded border px-3 py-2" type="date" {...form.register(`items.${index}.date` as const)} /></label>
              <label className="text-sm">Image URL<input className="mt-1 w-full rounded border px-3 py-2" {...form.register(`items.${index}.image` as const)} /></label>
              <label className="col-span-2 text-sm">Content<textarea className="mt-1 w-full rounded border px-3 py-2" rows={6} {...form.register(`items.${index}.content` as const)} /></label>
              <label className="col-span-2 text-sm">Tags (через запятую)<input className="mt-1 w-full rounded border px-3 py-2" {...form.register(`items.${index}.tagsAsString` as any)} onChange={(e) => {
                const v = e.target.value as string;
                const arr = v.split(",").map(s => s.trim()).filter(Boolean);
                form.setValue(`items.${index}.tags` as const, arr, { shouldDirty: true });
              }} /></label>
            </div>
            <div className="mt-3 flex justify-end">
              <button className="text-sm text-red-600" onClick={() => {
                if (confirm("Удалить пост?")) remove(index);
              }}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="text-sm text-slate-500">Загрузка…</div>}
    </section>
  );
}

function CaseItemForm({ field, index, form, remove, move, fieldsLength }: { field: any; index: number; form: any; remove: (index: number) => void; move: (from: number, to: number) => void; fieldsLength: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-3">
      {/* Header with expand/collapse */}
      <div className="flex items-center justify-between border-b pb-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 text-left font-medium text-sm hover:text-paleTeal"
        >
          {form.watch(`items.${index}.title`) || `Кейс #${index + 1}`}
        </button>
        <div className="flex gap-2">
          <button className="text-xs px-2 py-1 rounded border hover:bg-slate-50" onClick={()=> index>0 && move(index, index-1)}>↑</button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-slate-50" onClick={()=> index<fieldsLength-1 && move(index, index+1)}>↓</button>
          <button className="text-xs text-red-600 px-2 py-1 rounded border hover:bg-red-50" onClick={() => { if (confirm("Удалить кейс?")) remove(index); }}>Удалить</button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="rounded-lg bg-slate-50 p-3">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">Основная информация</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">Slug<input className="mt-1 w-full rounded border px-3 py-2 text-sm" {...form.register(`items.${index}.slug` as const)} placeholder="my-case-slug" /></label>
              <label className="text-sm">Title<input className="mt-1 w-full rounded border px-3 py-2 text-sm" {...form.register(`items.${index}.title` as const)} placeholder="Название проекта" /></label>
              <label className="text-sm">Category<input className="mt-1 w-full rounded border px-3 py-2 text-sm" {...form.register(`items.${index}.category` as const)} placeholder="Веб-разработка" /></label>
              <label className="text-sm">Client<input className="mt-1 w-full rounded border px-3 py-2 text-sm" {...form.register(`items.${index}.client` as const)} placeholder="Название клиента" /></label>
              <label className="text-sm">Year<input className="mt-1 w-full rounded border px-3 py-2 text-sm" {...form.register(`items.${index}.year` as const)} placeholder="2024" /></label>
              <label className="text-sm">Timeline<input className="mt-1 w-full rounded border px-3 py-2 text-sm" {...form.register(`items.${index}.timeline` as const)} placeholder="2 месяца" /></label>
              <label className="col-span-2 text-sm">Domain (опционально)<input className="mt-1 w-full rounded border px-3 py-2 text-sm" {...form.register(`items.${index}.domain` as const)} placeholder="https://example.com" /></label>
            </div>
          </div>

          {/* Descriptions */}
          <div className="rounded-lg bg-slate-50 p-3">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">Описания</h4>
            <div className="grid gap-3">
              <label className="text-sm">Short description (для карточки)<textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" rows={2} {...form.register(`items.${index}.shortDescription` as const)} placeholder="Краткое описание проекта" /></label>
              <label className="text-sm">Full description (для страницы кейса)<textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" rows={4} {...form.register(`items.${index}.fullDescription` as const)} placeholder="Полное описание проекта" /></label>
            </div>
          </div>

          {/* Task & Solution */}
          <div className="rounded-lg bg-slate-50 p-3">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">Задача и решение</h4>
            <div className="grid gap-3">
              <label className="text-sm">Task<textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" rows={3} {...form.register(`items.${index}.task` as const)} placeholder="Описание задачи клиента" /></label>
              <label className="text-sm">Solution<textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" rows={3} {...form.register(`items.${index}.solution` as const)} placeholder="Как мы решили задачу" /></label>
            </div>
          </div>

          {/* Media */}
          <div className="rounded-lg bg-slate-50 p-3">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">Медиа</h4>
            <div className="grid gap-3">
              <label className="text-sm">Cover image URL<input className="mt-1 w-full rounded border px-3 py-2 text-sm" {...form.register(`items.${index}.coverImage` as const)} placeholder="/images/case-cover.jpg" /></label>
              
              {/* Gallery with descriptions */}
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Галерея проекта</div>
                <div className="space-y-2">
                  {(form.watch(`items.${index}.gallery` as const) || []).map((item: { url: string; description?: string }, imgIndex: number) => (
                    <div key={imgIndex} className="flex gap-2 items-start p-3 bg-white rounded border border-slate-200">
                      <div className="flex-1 grid gap-2">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">URL изображения</label>
                          <input
                            type="text"
                            placeholder="/ХироМР.png"
                            value={item.url || ''}
                            onChange={(e) => {
                              const gallery = form.getValues(`items.${index}.gallery` as const) || [];
                              gallery[imgIndex] = { ...gallery[imgIndex], url: e.target.value };
                              form.setValue(`items.${index}.gallery` as const, [...gallery], { shouldDirty: true });
                            }}
                            className="w-full rounded border px-2 py-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Подпись</label>
                          <input
                            type="text"
                            placeholder="Главная, Услуги, Услуги 2..."
                            value={item.description || ''}
                            onChange={(e) => {
                              const gallery = form.getValues(`items.${index}.gallery` as const) || [];
                              gallery[imgIndex] = { ...gallery[imgIndex], description: e.target.value };
                              form.setValue(`items.${index}.gallery` as const, [...gallery], { shouldDirty: true });
                            }}
                            className="w-full rounded border px-2 py-1.5 text-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const gallery = form.getValues(`items.${index}.gallery` as const) || [];
                          gallery.splice(imgIndex, 1);
                          form.setValue(`items.${index}.gallery` as const, [...gallery], { shouldDirty: true });
                        }}
                        className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded border border-red-200 whitespace-nowrap"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const gallery = form.getValues(`items.${index}.gallery` as const) || [];
                      form.setValue(`items.${index}.gallery` as const, [...gallery, { url: '', description: '' }], { shouldDirty: true });
                    }}
                    className="w-full px-3 py-2 text-sm border border-dashed border-slate-300 rounded hover:bg-white transition-colors text-slate-600"
                  >
                    + Добавить картинку
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lists */}
          <div className="rounded-lg bg-slate-50 p-3">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">Списки</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">Technologies (через запятую)<input className="mt-1 w-full rounded border px-3 py-2 text-sm" defaultValue={(form.getValues(`items.${index}.technologies` as const) || []).join(', ')} onChange={(e) => {
                const arr = e.target.value.split(',').map(s=>s.trim()).filter(Boolean);
                form.setValue(`items.${index}.technologies` as const, arr, { shouldDirty: true });
              }} placeholder="React, Next.js, TypeScript" /></label>
              <label className="text-sm">Features (через запятую)<input className="mt-1 w-full rounded border px-3 py-2 text-sm" defaultValue={(form.getValues(`items.${index}.features` as const) || []).join(', ')} onChange={(e) => {
                const arr = e.target.value.split(',').map(s=>s.trim()).filter(Boolean);
                form.setValue(`items.${index}.features` as const, arr, { shouldDirty: true });
              }} placeholder="Адаптивный дизайн, SEO" /></label>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-lg bg-slate-50 p-3">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">Результаты (JSON массив объектов title/value)</h4>
            <textarea className="w-full rounded border px-3 py-2 text-sm font-mono" rows={4} defaultValue={JSON.stringify(form.getValues(`items.${index}.results` as const) || [], null, 2)} onChange={(e)=>{
              try {
                const val = JSON.parse(e.target.value || "[]");
                form.setValue(`items.${index}.results` as const, val, { shouldDirty: true });
              } catch {}
            }} placeholder='[{"title": "Конверсия", "value": "+150%"}]' />
          </div>

          {/* Review */}
          <div className="rounded-lg bg-slate-50 p-3">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">Отзыв клиента</h4>
            <div className="grid gap-3">
              <label className="text-sm">Review text<textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" rows={3} defaultValue={form.getValues(`items.${index}.review` as const)?.text || ""} onChange={(e)=>{
                const text = e.target.value;
                const curr = form.getValues(`items.${index}.review` as const) || { text: "" } as any;
                form.setValue(`items.${index}.review` as const, { ...curr, text }, { shouldDirty: true });
              }} placeholder="Текст отзыва" /></label>
              <label className="text-sm">Review author<input className="mt-1 w-full rounded border px-3 py-2 text-sm" defaultValue={form.getValues(`items.${index}.review` as const)?.author || ""} onChange={(e)=>{
                const author = e.target.value;
                const curr = form.getValues(`items.${index}.review` as const) || { text: "" } as any;
                form.setValue(`items.${index}.review` as const, { ...curr, author }, { shouldDirty: true });
              }} placeholder="Имя автора отзыва" /></label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PortfolioSection() {
  const headers = useAdminHeaders();
  const form = useForm<{ items: CaseItem[] }>({ defaultValues: { items: [] } });
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: "items" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/cms/cases.json", { cache: "no-store" });
        const raw = res.ok ? await res.json() : null;
        const list: any[] = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.cases) ? raw.cases : []);
        const data: CaseItem[] = (list || []).map((c: any) => {
          // Normalize existing site structure to admin fields
          const results: any[] = Array.isArray(c.results)
            ? c.results
            : [];
          // Normalize gallery: convert old format (string[]) to new format ({ url, description }[])
          const galleryRaw = Array.isArray(c.images)
            ? c.images
            : (Array.isArray(c.gallery) ? c.gallery : []);
          const gallery: Array<{ url: string; description?: string }> = galleryRaw.map((item: any) => {
            if (typeof item === 'string') {
              return { url: item, description: '' };
            }
            if (item && typeof item === 'object' && item.url) {
              return { url: item.url, description: item.description || '' };
            }
            return null;
          }).filter(Boolean) as Array<{ url: string; description?: string }>;
          const review = c.testimonial ? { text: c.testimonial.text, author: c.testimonial.author } : (c.review || null);
          return {
            slug: c.slug || c.id || "",
            title: c.title || "",
            shortDescription: c.shortDescription || c.description || "",
            fullDescription: c.fullDescription || c.solution || "",
            category: c.category || "",
            timeline: c.timeline || "",
            year: c.year || "",
            client: c.client || "",
            task: c.task || c.challenge || "",
            solution: c.solution || "",
            results,
            features: c.features || [],
            gallery,
            technologies: c.technologies || [],
            review,
            coverImage: c.coverImage || (gallery?.[0] || ""),
            domain: c.domain || "",
          } as CaseItem;
        });
        form.reset({ items: data });
      } catch {}
      setLoading(false);
    };
    load();
  }, [form]);

  const onSave = form.handleSubmit(async (values) => {
    const res = await fetch("/api/admin/update-cases", {
      method: "POST",
      headers,
      body: JSON.stringify(values.items),
    });
    if (res.ok) toast.success("Кейсы сохранены");
    else toast.error("Ошибка сохранения кейсов");
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Портфолио</h2>
        <div className="flex gap-2">
          <button onClick={() => append({ slug: "", title: "", shortDescription: "", fullDescription: "", category: "", features: [], gallery: [], technologies: [], results: [], review: null, domain: "" })} className="rounded-md border px-3 py-1 text-sm hover:bg-white">Добавить кейс</button>
          <button onClick={onSave} className="rounded-md bg-paleTeal px-3 py-1 text-sm text-slate-900">Сохранить</button>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <CaseItemForm
            key={field.id}
            field={field}
            index={index}
            form={form}
            remove={remove}
            move={move}
            fieldsLength={fields.length}
          />
        ))}
      </div>
      {loading && <div className="text-sm text-slate-500">Загрузка…</div>}
    </section>
  );
}

function HomeSection() {
  type HomeData = {
    hero: { title: string; subtitle: string; ctaPrimary: string; ctaSecondary?: string; stats: { label: string; value: string }[] };
    services: { title: string; description: string; href: string }[];
    testimonials: { name: string; position?: string; text: string; project?: string }[];
    process: { title: string; description: string }[];
    metrics: { title?: string; value?: string; imageUrl?: string }[];
  };
  const headers = useAdminHeaders();
  const form = useForm<HomeData>({
    defaultValues: {
      hero: { title: "", subtitle: "", ctaPrimary: "", ctaSecondary: "", stats: [] },
      services: [],
      testimonials: [],
      process: [],
      metrics: [],
    },
  });
  const { fields: heroStats, append: addStat, remove: removeStat } = useFieldArray({ control: form.control, name: "hero.stats" });
  const { fields: services, append: addService, remove: removeService } = useFieldArray({ control: form.control, name: "services" });
  const { fields: testimonials, append: addTestimonial, remove: removeTestimonial } = useFieldArray({ control: form.control, name: "testimonials" });
  const { fields: process, append: addProcess, remove: removeProcess } = useFieldArray({ control: form.control, name: "process" });
  const { fields: metrics, append: addMetric, remove: removeMetric } = useFieldArray({ control: form.control, name: "metrics" });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/cms/home.json", { cache: "no-store" });
        const data = res.ok ? await res.json() : null;
        if (data && (data.hero || data.services || data.testimonials || data.process || data.metrics)) {
          form.reset(data);
        } else {
          form.reset({
            hero: {
              title: "Создаем сайты, которые продают",
              subtitle: "Casa Digital — веб-разработка, SMM и автоматизация бизнеса",
              ctaPrimary: "Получить бесплатную консультацию",
              ctaSecondary: "Посмотреть работы",
              stats: [
                { label: "Проектов", value: "50+" },
                { label: "лет опыта", value: "3+" },
                { label: "Довольных клиентов", value: "95%" },
                { label: "Поддержка", value: "24/7" }
              ]
            },
            services: [
              { title: "Веб-разработка", description: "Современные сайты на React/Next.js с SEO и молниеносной скоростью", href: "/services/web-development" },
              { title: "SMM и контент", description: "Ведение соцсетей, создание контента и таргетированная реклама", href: "/services/smm" },
              { title: "Контекстная реклама", description: "Настройка и оптимизация в Яндекс Директ, Google Ads и VK Ads", href: "/services/ppc" },
              { title: "Автоматизация", description: "CRM, интеграции, чат-боты и автоматизация процессов", href: "/services/automation" }
            ],
            testimonials: [
              { name: 'Александр Петров', position: 'CEO, TechStart', project: 'Корпоративный сайт + SEO', text: 'Casa Digital помогли нам создать сайт, который действительно продает. Конверсия выросла на 150%, а трафик утроился. Настоящие профессионалы!' },
              { name: 'Мария Сидорова', position: 'Директор по маркетингу, EcoStore', project: 'Интернет-магазин', text: 'Отличная работа! Сайт загружается мгновенно и выглядит современно — а главное, продажи выросли на 200%. Очень рекомендую!' },
              { name: 'Дмитрий Козлов', position: 'Основатель, FinancePro', project: 'Автоматизация + CRM', text: 'Профессиональный подход к каждому проекту. Автоматизация сэкономила нам 20 часов в неделю. Очень довольны сотрудничеством!' },
              { name: 'Анна Волкова', position: 'Директор, HealthCare', project: 'Медицинский портал', text: 'Благодаря Casa Digital мы получили современный сайт с удобной системой записи. Количество пациентов выросло на 80%. Отличная работа!' }
            ],
            process: [
              { title: "Анализ", description: "Изучаем ваш бизнес, конкурентов и целевую аудиторию" },
              { title: "Дизайн", description: "Создаем уникальный дизайн, который конвертирует" },
              { title: "Разработка", description: "Создаем надежный сайт на современных технологиях" },
              { title: "Запуск и рост", description: "Запускаем и улучшаем на основе метрик" }
            ],
            metrics: [
              { title: "Довольных клиентов", value: "50+" },
              { title: "Лет опыта", value: "3+" },
              { title: "Повторных обращений", value: "95%" },
              { title: "Поддержка", value: "24/7" }
            ]
          });
        }
      } catch {}
    };
    load();
  }, [form]);

  const onSave = form.handleSubmit(async (values) => {
    const res = await fetch("/api/admin/update-home", { method: "POST", headers, body: JSON.stringify(values) });
    if (res.ok) toast.success("Главная сохранена"); else toast.error("Ошибка сохранения главной");
  });

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Главная</h2>
        <button onClick={onSave} className="rounded-md bg-paleTeal px-3 py-1 text-sm text-slate-900">Сохранить</button>
      </div>
      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-4">
        <h3 className="font-medium">Hero</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">Заголовок<input className="mt-1 w-full rounded border px-3 py-2" {...form.register("hero.title")} /></label>
          <label className="text-sm">Подзаголовок<input className="mt-1 w-full rounded border px-3 py-2" {...form.register("hero.subtitle")} /></label>
          <label className="text-sm">CTA Primary<input className="mt-1 w-full rounded border px-3 py-2" {...form.register("hero.ctaPrimary")} /></label>
          <label className="text-sm">CTA Secondary<input className="mt-1 w-full rounded border px-3 py-2" {...form.register("hero.ctaSecondary")} /></label>
        </div>
        <div>
          <div className="mb-2 text-sm font-medium">Статистика</div>
          <div className="space-y-2">
            {heroStats.map((f, i) => (
              <div key={f.id} className="grid gap-2 md:grid-cols-2">
                <input placeholder="Label" className="rounded border px-3 py-2" {...form.register(`hero.stats.${i}.label` as const)} />
                <div className="flex gap-2">
                  <input placeholder="Value" className="flex-1 rounded border px-3 py-2" {...form.register(`hero.stats.${i}.value` as const)} />
                  <button className="text-sm text-red-600" onClick={() => removeStat(i)}>Удалить</button>
                </div>
              </div>
            ))}
            <button className="text-sm" onClick={() => addStat({ label: "", value: "" })}>+ Добавить</button>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-3">
        <h3 className="font-medium">Услуги</h3>
        <div className="space-y-2">
          {services.map((f, i) => (
            <div key={f.id} className="grid gap-2 md:grid-cols-3">
              <input placeholder="Название" className="rounded border px-3 py-2" {...form.register(`services.${i}.title` as const)} />
              <input placeholder="Описание" className="rounded border px-3 py-2" {...form.register(`services.${i}.description` as const)} />
              <div className="flex gap-2">
                <input placeholder="Ссылка" className="flex-1 rounded border px-3 py-2" {...form.register(`services.${i}.href` as const)} />
                <button className="text-sm text-red-600" onClick={() => removeService(i)}>Удалить</button>
              </div>
            </div>
          ))}
          <button className="text-sm" onClick={() => addService({ title: "", description: "", href: "" })}>+ Добавить</button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-3">
        <h3 className="font-medium">Отзывы</h3>
        <div className="space-y-2">
          {testimonials.map((f, i) => (
            <div key={f.id} className="grid gap-2 md:grid-cols-4">
              <input placeholder="Имя" className="rounded border px-3 py-2" {...form.register(`testimonials.${i}.name` as const)} />
              <input placeholder="Должность" className="rounded border px-3 py-2" {...form.register(`testimonials.${i}.position` as const)} />
              <input placeholder="Проект" className="rounded border px-3 py-2" {...form.register(`testimonials.${i}.project` as const)} />
              <div className="flex gap-2 md:col-span-4">
                <textarea placeholder="Текст" className="mt-1 w-full rounded border px-3 py-2" rows={3} {...form.register(`testimonials.${i}.text` as const)} />
                <button className="text-sm text-red-600" onClick={() => removeTestimonial(i)}>Удалить</button>
              </div>
            </div>
          ))}
          <button className="text-sm" onClick={() => addTestimonial({ name: "", text: "" })}>+ Добавить</button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-3">
        <h3 className="font-medium">Как мы работаем</h3>
        <div className="space-y-2">
          {process.map((f, i) => (
            <div key={f.id} className="grid gap-2 md:grid-cols-2">
              <input placeholder="Заголовок" className="rounded border px-3 py-2" {...form.register(`process.${i}.title` as const)} />
              <div className="flex gap-2">
                <input placeholder="Описание" className="flex-1 rounded border px-3 py-2" {...form.register(`process.${i}.description` as const)} />
                <button className="text-sm text-red-600" onClick={() => removeProcess(i)}>Удалить</button>
              </div>
            </div>
          ))}
          <button className="text-sm" onClick={() => addProcess({ title: "", description: "" })}>+ Добавить</button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-3">
        <h3 className="font-medium">Статистика и логотипы</h3>
        <div className="space-y-2">
          {metrics.map((f, i) => (
            <div key={f.id} className="grid gap-2 md:grid-cols-3">
              <input placeholder="Title" className="rounded border px-3 py-2" {...form.register(`metrics.${i}.title` as const)} />
              <input placeholder="Value" className="rounded border px-3 py-2" {...form.register(`metrics.${i}.value` as const)} />
              <div className="flex gap-2">
                <input placeholder="Image URL" className="flex-1 rounded border px-3 py-2" {...form.register(`metrics.${i}.imageUrl` as const)} />
                <button className="text-sm text-red-600" onClick={() => removeMetric(i)}>Удалить</button>
              </div>
            </div>
          ))}
          <button className="text-sm" onClick={() => addMetric({ title: "", value: "", imageUrl: "" })}>+ Добавить</button>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  type Plan = { title: string; price: string; includes: string[]; process: string[]; cta: string };
  type Addon = { name: string; price: string; description: string };
  const headers = useAdminHeaders();
  const form = useForm<{ packages: Plan[]; addons: Addon[] }>({ defaultValues: { packages: [], addons: [] } });
  const { fields: pkgFields, append: addPkg, remove: rmPkg } = useFieldArray({ control: form.control, name: "packages" });
  const { fields: addonFields, append: addAddon, remove: rmAddon } = useFieldArray({ control: form.control, name: "addons" });
  
  useEffect(() => {
    (async () => {
      try { 
        const r = await fetch("/cms/pricing.json", { cache: "no-store" }); 
        const d = r.ok ? await r.json() : { packages: [], addons: [] };
        // Handle old format (array) or new format (object with packages/addons)
        if (Array.isArray(d)) {
          form.reset({ packages: d, addons: [] });
        } else {
          form.reset({ packages: d.packages || [], addons: d.addons || [] });
        }
      } catch {}
    })();
  }, [form]);
  
  const onSave = form.handleSubmit(async (values) => {
    const res = await fetch("/api/admin/update-pricing", { method: "POST", headers, body: JSON.stringify(values) });
    res.ok ? toast.success("Цены сохранены") : toast.error("Ошибка сохранения цен");
  });
  
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pricing</h2>
        <button onClick={onSave} className="rounded-md bg-paleTeal px-3 py-1 text-sm text-slate-900">Сохранить</button>
      </div>
      
      {/* Packages */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Пакеты</h3>
          <button onClick={() => addPkg({ title: "", price: "", includes: [], process: [], cta: "" })} className="rounded-md border px-3 py-1 text-sm">Добавить пакет</button>
        </div>
        {pkgFields.map((f, i) => (
          <div key={f.id} className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              <input placeholder="Название" className="rounded border px-3 py-2" {...form.register(`packages.${i}.title` as const)} />
              <input placeholder="Цена" className="rounded border px-3 py-2" {...form.register(`packages.${i}.price` as const)} />
              <input placeholder="CTA" className="rounded border px-3 py-2 md:col-span-2" {...form.register(`packages.${i}.cta` as const)} />
              <label className="md:col-span-2 text-sm">Что входит (по строке)
                <textarea rows={4} className="mt-1 w-full rounded border px-3 py-2" defaultValue={(form.getValues(`packages.${i}.includes` as const) || []).join('\n')} onChange={(e)=>{
                  const arr = e.target.value.split("\n").map(s=>s.trim()).filter(Boolean);
                  form.setValue(`packages.${i}.includes` as const, arr, { shouldDirty: true });
                }} />
              </label>
              <label className="md:col-span-2 text-sm">Процесс (по строке)
                <textarea rows={4} className="mt-1 w-full rounded border px-3 py-2" defaultValue={(form.getValues(`packages.${i}.process` as const) || []).join('\n')} onChange={(e)=>{
                  const arr = e.target.value.split("\n").map(s=>s.trim()).filter(Boolean);
                  form.setValue(`packages.${i}.process` as const, arr, { shouldDirty: true });
                }} />
              </label>
            </div>
            <div className="flex justify-end"><button className="text-sm text-red-600" onClick={()=>rmPkg(i)}>Удалить</button></div>
          </div>
        ))}
      </div>

      {/* Addons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Дополнительные услуги</h3>
          <button onClick={() => addAddon({ name: "", price: "", description: "" })} className="rounded-md border px-3 py-1 text-sm">Добавить услугу</button>
        </div>
        {addonFields.map((f, i) => (
          <div key={f.id} className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              <input placeholder="Название" className="rounded border px-3 py-2" {...form.register(`addons.${i}.name` as const)} />
              <input placeholder="Цена (например: 42 000 ₽ или 12 500 ₽/месяц)" className="rounded border px-3 py-2" {...form.register(`addons.${i}.price` as const)} />
              <label className="md:col-span-2 text-sm">Описание
                <textarea rows={2} className="mt-1 w-full rounded border px-3 py-2" {...form.register(`addons.${i}.description` as const)} />
              </label>
            </div>
            <div className="flex justify-end"><button className="text-sm text-red-600" onClick={()=>rmAddon(i)}>Удалить</button></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactsSection() {
  const headers = useAdminHeaders();
  const form = useForm<{ phones: string[]; emails: string[]; telegram?: string; hours?: string; address?: string }>({ defaultValues: { phones: [], emails: [], telegram: "", hours: "", address: "" } });
  useEffect(() => { (async ()=>{ try { const r = await fetch("/cms/contacts.json", { cache: "no-store" }); if (r.ok) form.reset(await r.json()); } catch {} })(); }, [form]);
  useEffect(() => {
    const v = form.getValues();
    if (!(v.phones?.length || v.emails?.length || v.telegram || v.hours || v.address)) {
      form.reset({ phones: ['+7 (999) 000‑00‑00'], emails: ['hello@casadigital.example'], telegram: 't.me/CasaAgency', hours: 'Пн-Пт 10:00–19:00', address: 'Москва' });
    }
  }, [form]);
  const onSave = form.handleSubmit(async (values) => {
    const res = await fetch("/api/admin/update-contacts", { method: "POST", headers, body: JSON.stringify(values) });
    res.ok ? toast.success("Контакты сохранены") : toast.error("Ошибка сохранения контактов");
  });
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Контакты</h2><button onClick={onSave} className="rounded-md bg-paleTeal px-3 py-1 text-sm text-slate-900">Сохранить</button></div>
      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 grid gap-3 md:grid-cols-2">
        <label className="text-sm">Телефоны (через запятую)<input className="mt-1 w-full rounded border px-3 py-2" onChange={(e)=>{
          const arr = e.target.value.split(',').map(s=>s.trim()).filter(Boolean);
          form.setValue('phones', arr, { shouldDirty: true });
        }} /></label>
        <label className="text-sm">Emails (через запятую)<input className="mt-1 w-full rounded border px-3 py-2" onChange={(e)=>{
          const arr = e.target.value.split(',').map(s=>s.trim()).filter(Boolean);
          form.setValue('emails', arr, { shouldDirty: true });
        }} /></label>
        <label className="text-sm">Telegram<input className="mt-1 w-full rounded border px-3 py-2" {...form.register('telegram')} /></label>
        <label className="text-sm">Режим работы<input className="mt-1 w-full rounded border px-3 py-2" {...form.register('hours')} /></label>
        <label className="text-sm md:col-span-2">Адрес<input className="mt-1 w-full rounded border px-3 py-2" {...form.register('address')} /></label>
      </div>
    </section>
  );
}

function AboutSection() {
  const headers = useAdminHeaders();
  const form = useForm<{ title: string; mission: string; history: string; values: { title: string; description: string }[]; process: { title: string; description: string }[] }>({ defaultValues: { title: "", mission: "", history: "", values: [], process: [] } });
  const { fields: valuesFields, append: addValue, remove: rmValue } = useFieldArray({ control: form.control, name: 'values' });
  const { fields: processFields, append: addStep, remove: rmStep } = useFieldArray({ control: form.control, name: 'process' });
  useEffect(()=>{(async()=>{try{const r=await fetch('/cms/about.json',{cache:'no-store'}); if(r.ok) form.reset(await r.json());}catch{}})();},[form]);
  const onSave = form.handleSubmit(async (v)=>{ const res = await fetch('/api/admin/update-about',{method:'POST',headers,body:JSON.stringify(v)}); res.ok?toast.success('About сохранен'):toast.error('Ошибка сохранения About'); });
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">About</h2><button onClick={onSave} className="rounded-md bg-paleTeal px-3 py-1 text-sm text-slate-900">Сохранить</button></div>
      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-3">
        <input placeholder="Заголовок" className="w-full rounded border px-3 py-2" {...form.register('title')} />
        <textarea placeholder="Миссия" rows={3} className="w-full rounded border px-3 py-2" {...form.register('mission')} />
        <textarea placeholder="История" rows={6} className="w-full rounded border px-3 py-2" {...form.register('history')} />
      </div>
      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-2">
        <h3 className="font-medium">Ценности</h3>
        {valuesFields.map((f,i)=> (
          <div key={f.id} className="grid gap-2 md:grid-cols-2">
            <input placeholder="Название" className="rounded border px-3 py-2" {...form.register(`values.${i}.title` as const)} />
            <div className="flex gap-2">
              <input placeholder="Описание" className="flex-1 rounded border px-3 py-2" {...form.register(`values.${i}.description` as const)} />
              <button className="text-sm text-red-600" onClick={()=>rmValue(i)}>Удалить</button>
            </div>
          </div>
        ))}
        <button className="text-sm" onClick={()=>addValue({ title:'', description:'' })}>+ Добавить</button>
      </div>
      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-2">
        <h3 className="font-medium">Процесс</h3>
        {processFields.map((f,i)=> (
          <div key={f.id} className="grid gap-2 md:grid-cols-2">
            <input placeholder="Заголовок" className="rounded border px-3 py-2" {...form.register(`process.${i}.title` as const)} />
            <div className="flex gap-2">
              <input placeholder="Описание" className="flex-1 rounded border px-3 py-2" {...form.register(`process.${i}.description` as const)} />
              <button className="text-sm text-red-600" onClick={()=>rmStep(i)}>Удалить</button>
            </div>
          </div>
        ))}
        <button className="text-sm" onClick={()=>addStep({ title:'', description:'' })}>+ Добавить</button>
      </div>
    </section>
  );
}

function ServicesSection() {
  type ServiceItem = { slug: string; description: string; benefits: string[]; features: string[]; cta: string };
  const headers = useAdminHeaders();
  const form = useForm<{ items: ServiceItem[] }>({ defaultValues: { items: [] } });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });
  useEffect(()=>{ (async()=>{ try { const r = await fetch('/cms/services.json',{ cache:'no-store'}); if(r.ok){ const obj = await r.json(); const arr = Object.entries(obj || {}).map(([slug, v]: any)=> ({ slug, ...(v||{}) })); form.reset({ items: arr }); } } catch{} })(); },[form]);
  useEffect(()=>{
    const v = form.getValues('items') || [];
    if (v.length === 0) {
      form.reset({ items: [
        { slug: 'web-development', description: 'Современные сайты на React/Next.js с SEO и быстрой загрузкой', benefits: ['Современный стек','SEO и скорость','Адаптивный дизайн','Интеграция CMS и платежей','Поддержка и обновления'], features: ['Анализ','Дизайн','Разработка','Запуск'], cta: 'Заказать' },
        { slug: 'smm', description: 'SMM: контент и реклама', benefits: ['Стратегия','Контент','Таргет','Аналитика'], features: ['Аудит','Контент-план','Публикация','Оптимизация'], cta: 'Заказать' },
        { slug: 'ppc', description: 'Контекстная реклама', benefits: ['Google/Яндекс','VK/Telegram','A/B тесты','Оптимизация'], features: ['Исследование','Кампании','Конверсии','Масштабирование'], cta: 'Заказать' },
        { slug: 'automation', description: 'CRM, интеграции, чат-боты', benefits: ['CRM','Интеграции','Боты','Email'], features: ['Анализ процессов','Выбор инструментов','Внедрение','Обучение'], cta: 'Заказать' }
      ]});
    }
  }, [form]);
  const onSave = form.handleSubmit(async (values)=>{
    const obj = Object.fromEntries(values.items.map(i=>[i.slug, { description: i.description, benefits: i.benefits, features: i.features, cta: i.cta }]));
    const res = await fetch('/api/admin/update-services',{ method:'POST', headers, body: JSON.stringify(obj) });
    res.ok?toast.success('Услуги сохранены'):toast.error('Ошибка сохранения услуг');
  });
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Услуги</h2><button onClick={onSave} className="rounded-md bg-paleTeal px-3 py-1 text-sm text-slate-900">Сохранить</button></div>
      <div className="flex justify-end"><button onClick={()=>append({ slug:'', description:'', benefits:[], features:[], cta:'' })} className="rounded-md border px-3 py-1 text-sm">Добавить</button></div>
      <div className="space-y-3">
        {fields.map((f,i)=> (
          <div key={f.id} className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              <input placeholder="Slug (web-development/smm/ppc/automation)" className="rounded border px-3 py-2" {...form.register(`items.${i}.slug` as const)} />
              <input placeholder="CTA" className="rounded border px-3 py-2" {...form.register(`items.${i}.cta` as const)} />
              <label className="md:col-span-2 text-sm">Описание<textarea rows={3} className="mt-1 w-full rounded border px-3 py-2" {...form.register(`items.${i}.description` as const)} /></label>
              <label className="md:col-span-2 text-sm">Преимущества (по строке)
                <textarea rows={4} className="mt-1 w-full rounded border px-3 py-2" onChange={(e)=>{
                  const arr = e.target.value.split('\n').map(s=>s.trim()).filter(Boolean);
                  form.setValue(`items.${i}.benefits` as const, arr, { shouldDirty: true });
                }} />
              </label>
              <label className="md:col-span-2 text-sm">Фичи (по строке)
                <textarea rows={4} className="mt-1 w-full rounded border px-3 py-2" onChange={(e)=>{
                  const arr = e.target.value.split('\n').map(s=>s.trim()).filter(Boolean);
                  form.setValue(`items.${i}.features` as const, arr, { shouldDirty: true });
                }} />
              </label>
            </div>
            <div className="flex justify-end"><button className="text-sm text-red-600" onClick={()=>remove(i)}>Удалить</button></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const headers = useAdminHeaders();
  const form = useForm<{ items: { question: string; answer: string }[]; cta: string }>({ defaultValues: { items: [], cta: '' } });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });
  useEffect(()=>{ (async()=>{ try { const r = await fetch('/cms/faq.json',{ cache:'no-store'}); if(r.ok) form.reset(await r.json()); } catch{} })(); },[form]);
  useEffect(()=>{
    const v = form.getValues('items') || [];
    if (v.length === 0) {
      form.reset({ items: [
        { question: 'Каковы типичные сроки разработки?', answer: '2–8 недель в зависимости от сложности' },
        { question: 'Где находится ваша команда?', answer: 'Москва, работаем удаленно' },
        { question: 'Предоставляете ли вы поддержку после запуска?', answer: 'Да, есть пакеты поддержки' }
      ], cta: 'Связаться с нами' });
    }
  }, [form]);
  const onSave = form.handleSubmit(async (v)=>{ const res = await fetch('/api/admin/update-faq',{ method:'POST', headers, body: JSON.stringify(v) }); res.ok?toast.success('FAQ сохранен'):toast.error('Ошибка сохранения FAQ'); });
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">FAQ</h2><button onClick={onSave} className="rounded-md bg-paleTeal px-3 py-1 text-sm text-slate-900">Сохранить</button></div>
      <div className="space-y-3">
        <div className="flex justify-end"><button onClick={()=>append({ question:'', answer:'' })} className="rounded-md border px-3 py-1 text-sm">Добавить</button></div>
        {fields.map((f,i)=>(
          <div key={f.id} className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-2">
            <input placeholder="Вопрос" className="w-full rounded border px-3 py-2" {...form.register(`items.${i}.question` as const)} />
            <textarea placeholder="Ответ" rows={3} className="w-full rounded border px-3 py-2" {...form.register(`items.${i}.answer` as const)} />
            <div className="flex justify-end"><button className="text-sm text-red-600" onClick={()=>remove(i)}>Удалить</button></div>
          </div>
        ))}
        <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
          <label className="text-sm">CTA в конце<input className="mt-1 w-full rounded border px-3 py-2" {...form.register('cta')} /></label>
        </div>
      </div>
    </section>
  );
}

function PoliciesSection() {
  const headers = useAdminHeaders();
  const [privacy, setPrivacy] = useState("");
  const [terms, setTerms] = useState("");
  const [cookies, setCookies] = useState("");
  useEffect(()=>{ (async()=>{ try {
    const [p,t,c] = await Promise.all([
      fetch('/cms/privacy.md',{ cache:'no-store'}).then(r=>r.ok?r.text():''),
      fetch('/cms/terms.md',{ cache:'no-store'}).then(r=>r.ok?r.text():''),
      fetch('/cms/cookies.md',{ cache:'no-store'}).then(r=>r.ok?r.text():''),
    ]); setPrivacy(p); setTerms(t); setCookies(c);
  } catch{} })(); },[]);
  const onSave = async () => {
    const res = await fetch('/api/admin/update-policies',{ method:'POST', headers, body: JSON.stringify({ privacy, terms, cookies }) });
    res.ok?toast.success('Политики сохранены'):toast.error('Ошибка сохранения политик');
  };
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Политики</h2><button onClick={onSave} className="rounded-md bg-paleTeal px-3 py-1 text-sm text-slate-900">Сохранить</button></div>
      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 space-y-3">
        <div>
          <div className="text-sm font-medium mb-1">Privacy (Markdown)</div>
          <textarea rows={10} className="w-full rounded border px-3 py-2" value={privacy} onChange={(e)=>setPrivacy(e.target.value)} />
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Terms (Markdown)</div>
          <textarea rows={10} className="w-full rounded border px-3 py-2" value={terms} onChange={(e)=>setTerms(e.target.value)} />
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Cookies (Markdown)</div>
          <textarea rows={10} className="w-full rounded border px-3 py-2" value={cookies} onChange={(e)=>setCookies(e.target.value)} />
        </div>
      </div>
    </section>
  );
}


