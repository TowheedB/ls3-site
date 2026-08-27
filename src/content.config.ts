import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob, file } from 'astro/loaders';

/** The single taxonomy. Publications, people and projects all tag into it. */
export const THEMES = [
  'responsible-information-access',
  'robustness-and-adversarial-ir',
  'ai-and-scientific-integrity',
  'neural-ranking',
  'information-people-society',
] as const;

const themeEnum = z.enum(THEMES);

const themes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/themes' }),
  schema: z.object({
    title: z.string(),
    short: z.string().max(120),
    order: z.number().default(100),
    leadQuestion: z.string(),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    role: z.enum([
      'director', 'faculty', 'research-staff', 'postdoc',
      'phd', 'msc', 'undergrad', 'visitor',
    ]),
    status: z.enum(['current', 'alumni']).default('current'),
    title: z.string().optional(),          // e.g. "Professor, Faculty of Information"
    affiliation: z.string().optional(),
    photo: z.string().optional(),          // /people/slug.jpg in public/
    startYear: z.number().optional(),
    gradYear: z.number().optional(),
    /** Where an alum is now. The most persuasive recruiting content we have. */
    nowAt: z.string().optional(),
    interests: z.array(z.string()).max(5).default([]),
    themes: z.array(themeEnum).default([]),
    email: z.string().optional(),
    links: z.object({
      website: z.string().url().optional(),
      scholar: z.string().url().optional(),
      github: z.string().url().optional(),
      orcid: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    }).default({}),
    order: z.number().default(100),
    /** Set true on hand-written entries so the importer never overwrites them. */
    manual: z.boolean().default(false),
  }),
});

const publications = defineCollection({
  // The file is an object with a `publications` array rather than a bare array,
  // because that is the shape the CMS's list widget can edit.
  loader: file('./src/data/publications.json', {
    parser: (text) => JSON.parse(text).publications,
  }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(z.string()),          // "Family, Given" — printed order
    venue: z.string(),
    venueShort: z.string().optional(),
    year: z.number(),
    type: z.enum(['journal', 'conference', 'workshop', 'preprint', 'thesis', 'book-section', 'patent']),
    themes: z.array(themeEnum).default([]),
    award: z.string().optional(),
    abstract: z.string().optional(),
    links: z.object({
      pdf: z.string().url().optional(),
      arxiv: z.string().url().optional(),
      doi: z.string().url().optional(),
      code: z.string().url().optional(),
      data: z.string().url().optional(),
      video: z.string().url().optional(),
    }).default({}),
    bibtex: z.string().optional(),
    featured: z.boolean().default(false),
    /* Set by scripts/openalex.mjs on machine-imported entries. Remove the flag
       once a human has checked the venue name, authors and theme tags. */
    needsReview: z.boolean().default(false),
    openalexId: z.string().optional(),
    citedBy: z.number().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().max(240),
    external: z.string().url().optional(),
    kind: z.enum(['paper', 'award', 'media', 'talk', 'lab']).default('lab'),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string().max(200),
    themes: z.array(themeEnum).default([]),
    status: z.enum(['active', 'completed']).default('active'),
    funder: z.string().optional(),
    years: z.string().optional(),
    repo: z.string().url().optional(),
    site: z.string().url().optional(),
    order: z.number().default(100),
  }),
});

/**
 * Page copy. These files exist so the CMS can edit the words on the site without
 * touching code. Fields are deliberately loose — an editor should never see a
 * validation error for prose.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    intro: z.string().optional(),

    // home
    heading: z.string().optional(),
    highlight: z.string().optional(),
    lede: z.string().optional(),
    directorLine: z.string().optional(),
    ctaPrimary: z.string().optional(),
    ctaSecondary: z.string().optional(),
    themesHeading: z.string().optional(),
    publicationsHeading: z.string().optional(),
    newsHeading: z.string().optional(),

    // join
    statusLabel: z.string().optional(),
    statusText: z.string().optional(),
    emailSubject: z.string().optional(),
    officialLinks: z.array(z.object({ label: z.string(), url: z.string() })).default([]),

    // contact
    movedNoteLabel: z.string().optional(),
    movedNote: z.string().optional(),
    directions: z.array(z.string()).default([]),
  }),
});

export const collections = { themes, people, publications, news, projects, pages };
