"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type CaseStudyProps = {
  caseStudy: {
    id: string;
    title: string;
    client: string;
    category: string;
    timeline: string;
    year: string;
    description: string;
    challenge: string;
    solution: string;
    results: string[];
    technologies: string[];
    features: string[];
    testimonial?: {
      text: string;
      author: string;
      position: string;
    };
    domain?: string;
    images: {
      url: string;
      alt: string;
      description?: string;
    }[];
  };
};

export function CaseStudyClient({ caseStudy }: CaseStudyProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-600 flex-wrap">
        <Link href="/" className="hover:text-slate-900">Главная</Link>
        <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        <Link href="/portfolio" className="hover:text-slate-900">Портфолио</Link>
        <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="text-slate-900 truncate">{caseStudy.title}</span>
      </div>

      {/* Hero */}
      <div className="mt-6 sm:mt-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:flex-nowrap">
          <div className="min-w-0 flex-1 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">{caseStudy.title}</h1>
            <p className="mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-slate-600">
              {caseStudy.description}
            </p>
            <div className="mt-4 sm:mt-3 rounded-lg bg-white/70 px-3 py-2 sm:px-4 sm:py-3 ring-1 ring-black/5 w-full sm:max-w-xs">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-y-1 text-xs sm:text-sm">
                <dt className="text-slate-600">Клиент:</dt>
                <dd className="text-slate-900 font-medium">{caseStudy.client}</dd>
                <dt className="text-slate-600">Категория:</dt>
                <dd className="text-slate-900 font-medium">{caseStudy.category}</dd>
                <dt className="text-slate-600">Сроки:</dt>
                <dd className="text-slate-900 font-medium">{caseStudy.timeline}</dd>
                <dt className="text-slate-600">Год:</dt>
                <dd className="text-slate-900 font-medium">{caseStudy.year}</dd>
              </dl>
              {caseStudy.domain && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <a
                    href={caseStudy.domain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-paleTeal hover:text-paleTeal/80 font-medium"
                  >
                    <span>Посмотреть сайт</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-auto md:min-w-[340px] md:max-w-[480px] flex-shrink-0 flex flex-col gap-4 mt-4 md:mt-0">
            <div className="overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5 p-2 sm:p-3">
              <div className="rounded-lg bg-slate-50">
                <img
                  src={caseStudy.images[0]?.url || '/icons/logo.png'}
                  alt={caseStudy.images[0]?.alt || caseStudy.title}
                  className="block w-full h-auto"
                />
              </div>
              <div className="mt-2 text-center text-xs text-slate-500">Главная страница проекта</div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Content */}
      <div className="mt-8 sm:mt-12 grid gap-8 sm:gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Challenge & Solution */}
          <div className="space-y-6 sm:space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold">Задача</h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">{caseStudy.challenge}</p>
            </section>
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold">Решение</h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">{caseStudy.solution}</p>
            </section>
          </div>

          {/* Results */}
          <section className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-semibold">Результаты</h2>
            <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {caseStudy.results.map((result, index) => (
                <div key={index} className="rounded-2xl bg-white/70 p-3 sm:p-4 ring-1 ring-black/5">
                  <p className="text-sm sm:text-base text-slate-900">{typeof result === 'string' ? result : (result && (result as any).value) || (result && (result as any).title) || String(result)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-semibold">Ключевые особенности</h2>
            <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {caseStudy.features.map((feature, index) => (
                <div key={index} className="rounded-2xl bg-white/70 p-3 sm:p-4 ring-1 ring-black/5">
                  <p className="text-sm sm:text-base text-slate-900">{feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery */}
          <section className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-semibold">Галерея проекта</h2>
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {caseStudy.images.map((image, index) => (
                <button 
                  key={index}
                  type="button"
                  className="group overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5 p-2 text-left transition hover:shadow-lg"
                  onClick={() => setOpen(index)}
                >
                  <div className="rounded-lg bg-slate-50">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="block w-full h-auto"
                    />
                  </div>
                  {image.description && (
                    <div className="mt-2 px-1 text-xs text-slate-600">
                      {image.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
            {/* Lightbox */}
            <Lightbox
              open={open !== null}
              close={() => setOpen(null)}
              index={open || 0}
              slides={caseStudy.images.map(img => ({ src: img.url, alt: img.alt }))}
              carousel={{ finite: true }}
              animation={{ fade: 400 }}
              className="bg-black/95"
            />
          </section>
        </div>

        <div className="mt-8 lg:mt-0">
          {/* Technologies */}
          <section className="rounded-[2rem] bg-white/70 p-4 sm:p-6 ring-1 ring-black/5">
            <h2 className="text-lg sm:text-xl font-semibold">Технологии</h2>
            <div className="mt-3 sm:mt-4">
              {caseStudy.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="mr-2 mb-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs sm:text-sm text-slate-900"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Testimonial */}
          {caseStudy.testimonial && (
            <section className="mt-4 sm:mt-6 rounded-[2rem] bg-white/70 p-4 sm:p-6 ring-1 ring-black/5">
              <h2 className="text-lg sm:text-xl font-semibold">Отзыв клиента</h2>
              <figure className="mt-3 sm:mt-4">
                <blockquote>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{caseStudy.testimonial.text}</p>
                </blockquote>
                <figcaption className="mt-3 sm:mt-4">
                  <div className="font-medium text-sm sm:text-base">{caseStudy.testimonial.author}</div>
                  <div className="text-xs sm:text-sm text-slate-500">{caseStudy.testimonial.position}</div>
                </figcaption>
              </figure>
            </section>
          )}

          {/* CTA */}
          <section className="mt-4 sm:mt-6 rounded-[2rem] bg-paleTeal p-4 sm:p-6 text-slate-900">
            <h2 className="text-lg sm:text-xl font-semibold">Хотите похожий проект?</h2>
            <p className="mt-2 text-sm sm:text-base text-slate-800">
              Мы поможем реализовать ваши идеи с учетом последних технологий и лучших практик
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-block w-full sm:w-auto text-center rounded-full bg-white px-6 py-3 text-sm sm:text-base text-slate-900 font-medium hover:bg-white/90 transition-colors"
              >
                Обсудить проект
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}