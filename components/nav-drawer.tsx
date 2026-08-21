'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { NavDrawerList, type TopicWithQuestions } from '@/components/nav-drawer-list';
import { NavToolsLink } from '@/components/nav-tools-link';
import { messages } from '@/lib/messages';

interface NavDrawerProps {
  topics: TopicWithQuestions[];
  children: React.ReactNode;
}

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';
const DRAWER_WIDTH_CLASS = 'w-[272px] data-[side=left]:w-[272px] data-[side=left]:sm:max-w-none';

/**
 * Приложенческий shell: sticky app bar (гамбургер + название) + mobile
 * modal-drawer (shadcn `Sheet`, off-canvas — Radix `Dialog` даёт focus
 * trap/`aria-modal`/Escape/overlay-click "бесплатно", но это явно
 * проверяется браузерным тестом, не считается гарантированным) + постоянная
 * desktop-панель (обычный `<nav>`, НЕ `Sheet` — тот всегда модален по
 * семантике Radix `Dialog`, что запрещено для постоянно видимой панели —
 * static-prototype-spec.md §6.1.6). Единственный клиентский компонент
 * (`'use client'` только здесь — hooks-and-state.md §2) владеет состоянием
 * открытия mobile-drawer через один `useState`; `app/layout.tsx` остаётся
 * Server Component и передаёт данные (`topics`) и `children` как props.
 *
 * `id="nav-drawer"`/`role="navigation"` (native `<nav>`) находятся на
 * внутреннем `<nav>` внутри `SheetContent`, а не на самом `SheetContent`:
 * Radix `Dialog.Content` уже несёт `role="dialog"`/`aria-modal`, слить его
 * с `role="navigation"` на одном узле нельзя без потери модальной семантики
 * — `aria-controls="nav-drawer"` кнопки-гамбургера ссылается на вложенный
 * `<nav>` по id, что остаётся валидной ARIA-связью независимо от глубины
 * вложенности.
 */
export const NavDrawer = ({ topics, children }: NavDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-1 bg-md-surface-container px-2 shadow-e1 md:pl-[288px]">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Открыть меню навигации"
          aria-expanded={isOpen}
          aria-controls="nav-drawer"
          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-md-surface-tint/25 md:hidden"
        >
          <Menu aria-hidden="true" className="size-6" />
        </button>
        <Link href="/q/1" className="truncate pl-2 text-lg font-medium text-md-on-surface md:pl-0">
          Катехизис
        </Link>
      </header>

      <nav
        aria-label={messages.nav.tableOfContents}
        className="fixed inset-y-0 left-0 z-40 hidden w-[272px] overflow-y-auto border-r border-md-outline/15 bg-md-surface-container md:block"
      >
        <div className="flex h-14 items-center px-4 text-base font-medium">{messages.nav.drawerTitle}</div>
        <NavDrawerList topics={topics} />
        <NavToolsLink />
      </nav>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          aria-describedby={undefined}
          aria-modal="true"
          className={`gap-0 p-0 ${DRAWER_WIDTH_CLASS}`}
        >
          <nav id="nav-drawer" aria-label={messages.nav.tableOfContents} className="flex h-full flex-col">
            <div className="flex h-14 items-center justify-between px-4">
              <SheetTitle className="text-base font-medium">{messages.nav.drawerTitle}</SheetTitle>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Закрыть меню навигации"
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-md-surface-tint/25"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <NavDrawerList topics={topics} onNavigate={() => setIsOpen(false)} />
            <NavToolsLink onNavigate={() => setIsOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>

      <div id="content-offset" className="md:ml-[272px]">
        {children}
      </div>
    </>
  );
};
