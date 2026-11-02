"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { locales, localeMeta, type Locale } from "@/i18n/config";

type NavItem = { href: string; label: string };
type Props = {
  locale: Locale;
  items: NavItem[];
  labels: { menuOpen: string; menuClose: string; language: string; primaryNav: string; menu: string; home: string };
};

function swapLocale(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  parts[1] = to;
  return parts.join("/") || `/${to}`;
}

export function Header({ locale, items, labels }: Props) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Compress on scroll; hide when scrolling down, reveal when scrolling up.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 320 && y > lastY.current + 4);
        if (y < lastY.current - 4 || y < 320) setHidden(false);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const focusables = [btnRef.current, ...menuRef.current.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
        const i = focusables.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); focusables[focusables.length - 1].focus(); }
        else if (!e.shiftKey && i === focusables.length - 1) { e.preventDefault(); focusables[0].focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isCurrent = (href: string) => (href === `/${locale}` ? pathname === href : pathname === href || pathname.startsWith(href + "/"));

  const langSwitch = (
    <div className="lang-switch" role="group" aria-label={labels.language}>
      {locales.map((l, i) => (
        <span key={l} style={{ display: "contents" }}>
          {i > 0 ? <span className="sep" aria-hidden="true">/</span> : null}
          <Link href={swapLocale(pathname, l)} hrefLang={localeMeta[l].htmlLang} lang={localeMeta[l].htmlLang} aria-current={l === locale ? "true" : undefined} aria-label={localeMeta[l].label}>
            {localeMeta[l].short}
          </Link>
        </span>
      ))}
    </div>
  );

  return (
    <>
      <header className="site-header" data-scrolled={scrolled} data-hidden={hidden && !open} data-menu={open}>
        <div className="wrap site-header__inner">
          <Link href={`/${locale}`} className="wordmark" aria-label={`Ground & Mother — ${labels.home}`}>
            Ground<span className="amp">&amp;</span>Mother
          </Link>
          <nav className="nav-desktop" aria-label={labels.primaryNav}>
            <ul>
              {items.slice(1).map((it) => (
                <li key={it.href}>
                  <Link href={it.href} aria-current={isCurrent(it.href) ? "page" : undefined}>{it.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-tools">
            {langSwitch}
            <button
              ref={btnRef}
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? labels.menuClose : labels.menuOpen}
              onClick={() => setOpen((o) => !o)}
            >
              <span aria-hidden="true">{labels.menu}</span>
              <span className="menu-btn__icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div id="mobile-menu" ref={menuRef} className="mobile-menu on-dark" data-open={open} aria-hidden={!open} inert={!open}>
        <nav aria-label={labels.primaryNav}>
          <ol>
            {items.map((it, i) => (
              <li key={it.href}>
                <Link href={it.href} style={{ "--i": i } as React.CSSProperties} aria-current={isCurrent(it.href) ? "page" : undefined}>
                  <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  {it.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-menu__foot">
          <span className="label">Ground &amp; Mother</span>
          {langSwitch}
        </div>
      </div>
    </>
  );
}
