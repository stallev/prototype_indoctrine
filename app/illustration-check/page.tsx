import { Illustration } from '@/components/illustration';
import { getQuestionWithVerses } from '@/content';

// Temporary diagnostic route for task 9.2.4 (components/illustration.tsx) —
// lets quality-checker visually confirm the svg/placeholder ResolvedIllustration
// branches render correctly:
//   - svg: a real question (q001.svg inlines into the markup).
//   - placeholder: a non-existent question number (#BFE3F0 fallback).
// The 'raster' branch was already verified in-browser via a throwaway fixture
// (public/illustrations/_illustration-check-raster.png) and is no longer
// demonstrated here — quality-checker required removing that fixture from
// public/illustrations/ (production asset directory, must stay exactly the
// 114 qNNN.svg files) rather than deferring cleanup to Phase 9.3.
// Delete this route in Phase 9.3 once real pages exist.
export default function IllustrationCheckPage() {
  const question = getQuestionWithVerses(1);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-8">
      <h1 className="text-2xl font-bold">Illustration component check</h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">svg — existing q001.svg</h2>
        <div className="max-w-sm overflow-hidden rounded-md border border-md-outline">
          <Illustration questionNumber={1} questionContent={question?.question_content ?? ''} />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">placeholder — non-existent question</h2>
        <div className="max-w-sm overflow-hidden rounded-md border border-md-outline">
          <Illustration questionNumber={99999} questionContent="Несуществующий вопрос" />
        </div>
      </section>
    </main>
  );
}
