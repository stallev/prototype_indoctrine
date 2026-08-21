import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// Temporary diagnostic route for task 9.2.2 (shadcn/ui + Material palette
// wiring) — lets quality-checker visually confirm --md-sys-color-* values
// render instead of shadcn's default oklch theme, and that Sheet/Button/
// ScrollArea build and mount correctly. Delete/replace once Phase 9.3
// builds the real pages (app/page.tsx stays `return null` until then).
export default function ThemeCheckPage() {
  const swatches = [
    { name: '--md-sys-color-primary', className: 'bg-md-primary text-md-on-primary' },
    { name: '--md-sys-color-secondary', className: 'bg-md-secondary text-md-on-primary' },
    { name: '--md-sys-color-surface', className: 'bg-md-surface text-md-on-surface border border-md-outline' },
    { name: '--md-sys-color-surface-container', className: 'bg-md-surface-container text-md-on-surface border border-md-outline' },
    { name: '--md-sys-color-surface-tint', className: 'bg-md-surface-tint text-md-on-surface' },
    { name: '--md-sys-color-outline', className: 'bg-md-outline text-md-on-primary' },
  ];

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-8">
      <h1 className="text-2xl font-bold">Material palette / shadcn theme check</h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Palette swatches</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {swatches.map((swatch) => (
            <div
              key={swatch.name}
              className={`flex h-20 flex-col justify-end rounded-md p-2 text-xs shadow-e1 ${swatch.className}`}
            >
              {swatch.name}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">shadcn/ui primitives</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet заголовок</SheetTitle>
                <SheetDescription>
                  Проверка Material-палитры внутри shadcn Sheet.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">ScrollArea</h2>
        <ScrollArea className="h-32 w-64 rounded-md border border-md-outline bg-md-surface-container p-3">
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="text-sm">
              Строка {i + 1}
            </p>
          ))}
        </ScrollArea>
      </section>
    </main>
  );
}
