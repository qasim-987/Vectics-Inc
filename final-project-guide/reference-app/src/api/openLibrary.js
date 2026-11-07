const BASE = 'https://openlibrary.org'
const COVERS = 'https://covers.openlibrary.org'

/**
 * One shared fetch wrapper so every request behaves the same way:
 * it has a timeout (no infinite spinners) and it throws an Error whose
 * message is safe to show directly in the UI.
 */
async function request(url, { timeout = 12000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })

    if (!response.ok) {
      if (response.status === 404) throw new Error('We could not find that book or author.')
      if (response.status === 429) throw new Error('Too many requests. Wait a moment, then try again.')
      if (response.status >= 500) throw new Error('Open Library is having trouble. Please try again shortly.')
      throw new Error(`Request failed with status ${response.status}.`)
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The request took too long. Check your connection and try again.')
    }
    // fetch() rejects with a TypeError when the network itself fails
    // (offline, DNS problem, blocked request).
    if (error instanceof TypeError) {
      throw new Error('Could not reach Open Library. Are you online?')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

/* The fields we ask for. Asking for fewer fields keeps responses small and fast. */
const LIST_FIELDS = [
  'key',
  'title',
  'author_name',
  'author_key',
  'first_publish_year',
  'cover_i',
  'edition_count',
  'ratings_average',
  'ratings_count',
  'subject',
].join(',')

/** Turn one API document into the shape our components expect. */
export function normaliseWork(doc) {
  return {
    // "/works/OL893414W" -> "OL893414W" so we can build clean URLs
    id: doc.key.replace('/works/', ''),
    title: doc.title ?? 'Untitled',
    authors: doc.author_name ?? [],
    authorIds: (doc.author_key ?? []).map((key) => key.replace('/authors/', '')),
    year: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
    editionCount: doc.edition_count ?? 0,
    rating: doc.ratings_average ? Number(doc.ratings_average.toFixed(2)) : null,
    ratingCount: doc.ratings_count ?? 0,
    subjects: (doc.subject ?? []).slice(0, 8),
  }
}

/** Bios and descriptions come back with Windows line endings and stray spaces. */
function cleanText(value) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .trim()
}

export function coverUrl(coverId, size = 'M') {
  return coverId ? `${COVERS}/b/id/${coverId}-${size}.jpg` : null
}

export function authorPhotoUrl(photoId) {
  return photoId ? `${COVERS}/a/id/${photoId}-M.jpg` : null
}

/** Free-text search across titles, authors and subjects. */
export async function searchBooks(query, { page = 1, sort = '' } = {}) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: '24',
    fields: LIST_FIELDS,
  })
  if (sort) params.set('sort', sort)

  const data = await request(`${BASE}/search.json?${params}`)
  return {
    total: data.numFound ?? 0,
    works: (data.docs ?? []).map(normaliseWork),
  }
}

/** All works by one author, best rated first. */
export async function searchByAuthor(authorId, limit = 24) {
  const params = new URLSearchParams({
    q: `author_key:${authorId}`,
    limit: String(limit),
    sort: 'rating',
    fields: LIST_FIELDS,
  })
  const data = await request(`${BASE}/search.json?${params}`)
  return { total: data.numFound ?? 0, works: (data.docs ?? []).map(normaliseWork) }
}

/**
 * A single work. Open Library splits this information over two endpoints:
 * /works/{id}.json has the title, description and subjects,
 * while the search endpoint knows the rating and first publish year.
 * We fetch both at the same time with Promise.all.
 */
export async function getBook(id) {
  const [work, meta] = await Promise.all([
    request(`${BASE}/works/${id}.json`),
    request(
      `${BASE}/search.json?${new URLSearchParams({
        q: `key:"/works/${id}"`,
        fields: 'key,first_publish_year,ratings_average,ratings_count,edition_count,subject,author_key,author_name',
        limit: '1',
      })}`,
    ),
  ])

  const extra = meta.docs?.[0] ?? {}
  return {
    id,
    title: work.title ?? 'Untitled',
    description: cleanText(
      typeof work.description === 'string' ? work.description : work.description?.value,
    ),
    subjects: work.subjects ?? extra.subject ?? [],
    coverId: work.covers?.find((cover) => cover > 0) ?? null,
    authorIds: [
      ...(work.authors ?? []).map((entry) => entry.author.key.replace('/authors/', '')),
      ...(extra.author_key ?? []).map((key) => key.replace('/authors/', '')),
    ].filter((value, index, all) => all.indexOf(value) === index),
    authors: extra.author_name ?? [],
    year: extra.first_publish_year ?? null,
    rating: extra.ratings_average ? Number(extra.ratings_average.toFixed(2)) : null,
    ratingCount: extra.ratings_count ?? 0,
    editionCount: extra.edition_count ?? work.covers?.length ?? 0,
  }
}

/** Name, bio and dates for one author. */
export async function getAuthor(id) {
  const data = await request(`${BASE}/authors/${id}.json`)
  return {
    id,
    name: data.name ?? 'Unknown author',
    bio: cleanText(typeof data.bio === 'string' ? data.bio : data.bio?.value),
    birthDate: data.birth_date ?? null,
    deathDate: data.death_date ?? null,
    photoId: data.photos?.find((photo) => photo > 0) ?? null,
    links: (data.links ?? []).slice(0, 3).map(({ title, url }) => ({ title, url })),
  }
}

/* -------------------------------------------------------------------------
 * Home screen: a few "shelves" of covers, one per subject.
 * ---------------------------------------------------------------------- */

export const SHELF_SUBJECTS = [
  { slug: 'fantasy', label: 'Fantasy' },
  { slug: 'science_fiction', label: 'Science fiction' },
  { slug: 'mystery', label: 'Mystery' },
  { slug: 'romance', label: 'Romance' },
  { slug: 'history', label: 'History' },
  { slug: 'poetry', label: 'Poetry' },
]

export async function getShelf(subject, limit = 12) {
  const params = new URLSearchParams({
    q: `subject:${subject}`,
    limit: String(limit),
    fields: 'key,title,author_name,cover_i,first_publish_year',
  })
  const data = await request(`${BASE}/search.json?${params}`)
  // Books without a cover would leave holes in the shelf, so filter them out.
  return (data.docs ?? []).map(normaliseWork).filter((work) => work.coverId)
}

/**
 * Several shelves at once. Promise.all means the user waits for the slowest
 * request instead of for the sum of all of them.
 */
export function getFeaturedShelves(count = SHELF_SUBJECTS.length) {
  return Promise.all(
    SHELF_SUBJECTS.slice(0, count).map(async ({ slug, label }) => ({
      slug,
      label,
      works: await getShelf(slug),
    })),
  )
}
