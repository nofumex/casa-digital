"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const nav = [
  { href: '/', label: 'Главная' },
  {
    href: '/services',
    label: 'Услуги',
    children: [
      { href: '/services/web-development', label: 'Веб-разработка' },
      { href: '/services/smm', label: 'SMM и контент' },
      { href: '/services/ppc', label: 'Контекстная реклама' },
      { href: '/services/automation', label: 'Автоматизация' }
    ]
  },
  { href: '/portfolio', label: 'Портфолио' },
  { href: '/about', label: 'О нас' },
  { href: '/pricing', label: 'Цены' },
  { href: '/contact', label: 'Контакты' }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setOpen(false);

  return (
    <header className={`fixed inset-x-0 top-0 z-20 transition ${scrolled ? 'bg-white/70 backdrop-blur ring-1 ring-black/5' : 'supports-[backdrop-filter]:bg-white/30'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-slate-800">
          <img src="/icons/logo.png" alt="Логотип Casa Digital" className="w-10 h-10 rounded-lg -mt-1" />
          <span className="text-2xl font-bold">Casa Digital</span>
        </Link>
        <nav className="hidden gap-2 md:flex items-center">
          {nav.map((item) => (
            <div key={item.href} className="relative">
              {item.children ? (
                <Link href={item.href}>
                  <button
                    className="inline-flex items-center gap-1 rounded-full px-4 py-2 transition hover:bg-paleTeal/30"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                    aria-expanded={servicesOpen}
                    aria-haspopup
                  >
                    <span>{item.label}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                </Link>
              ) : (
                <Link className={"rounded-full px-4 py-2 hover:bg-paleTeal/30 " + (item.label !== "Services" ? "nav-lower" : "")} href={item.href}>
                  {item.label}
                </Link>
              )}
              {item.children && (
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                      className="absolute left-0 mt-3 w-72 rounded-3xl bg-white p-4 shadow-lg ring-1 ring-black/5"
                    >
                      <div className="grid gap-2">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            className="rounded-2xl px-3 py-2 hover:bg-paleTeal/20"
                            href={c.href}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="hidden sm:inline-block rounded-full bg-softBlueGray/20 px-4 py-2 text-sm font-medium hover:animate-ripple whitespace-nowrap">
            Бесплатная консультация
          </Link>
          <button className="md:hidden" aria-label="Открыть меню" onClick={() => setOpen((v) => !v)}>
            <span className="block h-0.5 w-6 bg-slate-800" />
            <span className="mt-1 block h-0.5 w-6 bg-slate-800" />
            <span className="mt-1 block h-0.5 w-6 bg-slate-800" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden"
          >
            <div className="space-y-2 bg-white/90 px-4 pb-6 pt-2 shadow-lg">
              {nav.map((item) => (
                <div key={item.href}>
                  {item.children ? (
                    <>
                      <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2" onClick={() => setServicesOpen((v) => !v)}>
                        <span>{item.label}</span>
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                      <AnimatePresence>
                        {servicesOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            {item.children.map((c) => (
                              <Link key={c.href} onClick={closeMobile} className="mt-1 block rounded-xl px-4 py-2 hover:bg-paleTeal/20" href={c.href}>
                                {c.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link onClick={closeMobile} className="block rounded-2xl px-3 py-2 hover:bg-paleTeal/20" href={item.href}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link href="/contact" onClick={closeMobile} className="mt-2 block rounded-full bg-softBlueGray/20 px-4 py-3 text-center font-medium text-sm">
                Бесплатная консультация
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}







