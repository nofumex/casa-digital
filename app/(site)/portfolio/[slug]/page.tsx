import { notFound } from 'next/navigation';
import { CaseStudyClient } from './CaseStudyClient';
import { promises as fs } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCasesData() {
  try {
    const filePath = join(process.cwd(), 'public', 'cms', 'cases.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return Array.isArray(data) ? data : (data.cases || []);
  } catch (error) {
    console.error('Error reading cases.json:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const cases = await getCasesData();
  return cases.map((caseStudy: any) => ({
    slug: (caseStudy as any).slug || (caseStudy as any).id,
  }));
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cases = await getCasesData();
  const rawCase = cases.find((c: any) => (c as any).slug === params.slug || (c as any).id === params.slug);

  if (!rawCase) {
    notFound();
  }

  // Normalize gallery: fix corrupted objects with numeric keys
  const normalizeGallery = (gallery: any[]): Array<{ url: string; description?: string }> => {
    if (!Array.isArray(gallery)) return [];
    
    return gallery.map((item: any) => {
      // If it's a string, return as is
      if (typeof item === 'string') {
        return { url: item, description: undefined };
      }
      
      // If it's an object with numeric keys (corrupted), try to reconstruct the URL
      if (item && typeof item === 'object') {
        // Check if it has numeric keys (corrupted string)
        const numericKeys = Object.keys(item).filter(k => /^\d+$/.test(k));
        if (numericKeys.length > 0 && item.url) {
          // It has both numeric keys (corrupted) and url (correct), use url
          return {
            url: item.url || '',
            description: item.description || undefined
          };
        }
        
        // Normal object with url property
        if (item.url) {
          return {
            url: item.url,
            description: item.description || undefined
          };
        }
      }
      
      return null;
    }).filter(Boolean) as Array<{ url: string; description?: string }>;
  };

  const normalizedGallery = normalizeGallery((rawCase as any).gallery || []);

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
    images: normalizedGallery.map((item: { url: string; description?: string }, idx: number) => {
      return {
        url: item.url,
        alt: `${rawCase.title} - ${item.description || `изображение ${idx + 1}`}`,
        description: item.description || (idx === 0 ? 'Главная страница' : idx === 1 ? 'Каталог' : idx === 2 ? 'Корзина' : idx === 3 ? 'Админка' : undefined)
      };
    })
  };

  return <CaseStudyClient caseStudy={caseStudy} />;
}