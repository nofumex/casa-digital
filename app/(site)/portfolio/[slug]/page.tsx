import { notFound } from 'next/navigation';
import cases from '@/public/cms/cases.json';
import { CaseStudyClient } from './CaseStudyClient';

export async function generateStaticParams() {
  return cases.cases.map((caseStudy: any) => ({
    slug: (caseStudy as any).slug || (caseStudy as any).id,
  }));
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const rawCase = cases.cases.find((c: any) => (c as any).slug === params.slug || (c as any).id === params.slug);

  if (!rawCase) {
    notFound();
  }

  // Transform the case data to match CaseStudyClient expectations
  const caseStudy = {
    id: (rawCase as any).slug || (rawCase as any).id,
    title: rawCase.title,
    client: rawCase.client,
    category: rawCase.category,
    timeline: rawCase.timeline,
    year: rawCase.year,
    description: (rawCase as any).shortDescription || (rawCase as any).fullDescription || '',
    challenge: (rawCase as any).task || '',
    solution: (rawCase as any).solution || '',
    results: (rawCase.results || []).map((r: any) => typeof r === 'string' ? r : r.value),
    technologies: rawCase.technologies || [],
    features: rawCase.features || [],
    testimonial: (rawCase as any).review ? {
      text: (rawCase as any).review.text,
      author: (rawCase as any).review.author,
      position: (rawCase as any).review.position || ''
    } : undefined,
    domain: (rawCase as any).domain || undefined,
    // Transform gallery array into images array with url/alt structure
    images: ((rawCase as any).gallery || []).map((item: any, idx: number) => {
      // Support both old format (string[]) and new format ({ url, description }[])
      const url = typeof item === 'string' ? item : (item?.url || '');
      const description = typeof item === 'object' && item?.description ? item.description : undefined;
      return {
        url,
        alt: `${rawCase.title} - ${description || `изображение ${idx + 1}`}`,
        description: description || (idx === 0 ? 'Главная страница' : idx === 1 ? 'Каталог' : idx === 2 ? 'Корзина' : idx === 3 ? 'Админка' : undefined)
      };
    })
  };

  return <CaseStudyClient caseStudy={caseStudy} />;
}