// GitHub API utility for creating repositories

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_ORG = process.env.GITHUB_ORG

interface CreateRepoResponse {
  repoName: string
  repoUrl: string
}

interface GithubRepo {
  name: string
  html_url: string
}

/**
 * Transliterate Russian text to Latin
 */
function transliterate(text: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
  }
  
  return text
    .split('')
    .map(char => map[char] || char)
    .join('')
}

/**
 * Convert project name to repo slug
 * Example: "Мой проект #1" → "moi-proekt-1"
 */
export function slugifyProjectName(name: string): string {
  // Transliterate Russian characters
  let slug = transliterate(name)
  
  // Convert to lowercase
  slug = slug.toLowerCase()
  
  // Replace spaces and underscores with hyphens
  slug = slug.replace(/[\s_]+/g, '-')
  
  // Remove special characters except hyphens
  slug = slug.replace(/[^a-z0-9-]/g, '')
  
  // Remove multiple consecutive hyphens
  slug = slug.replace(/-+/g, '-')
  
  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '')
  
  return slug || 'project'
}

/**
 * Check if repo exists
 */
async function repoExists(repoName: string): Promise<boolean> {
  if (!GITHUB_TOKEN || !GITHUB_ORG) {
    throw new Error('GitHub credentials not configured')
  }

  const url = `https://api.github.com/repos/${GITHUB_ORG}/${repoName}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })
    
    return response.status === 200
  } catch (error) {
    return false
  }
}

/**
 * Generate unique repo name by adding suffix if needed
 */
async function generateUniqueRepoName(baseName: string): Promise<string> {
  let repoName = baseName
  let suffix = 2
  
  while (await repoExists(repoName)) {
    repoName = `${baseName}-${suffix}`
    suffix++
  }
  
  return repoName
}

/**
 * Create a GitHub repository
 */
export async function createGithubRepo(
  name: string,
  description?: string
): Promise<CreateRepoResponse | null> {
  if (!GITHUB_TOKEN || !GITHUB_ORG) {
    console.error('GitHub credentials not configured')
    return null
  }

  try {
    // Generate slug and ensure uniqueness
    const baseRepoName = slugifyProjectName(name)
    const repoName = await generateUniqueRepoName(baseRepoName)

    const url = `https://api.github.com/user/repos`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        description: description || `Project: ${name}`,
        private: false,
        auto_init: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('GitHub API error:', errorData)
      return null
    }

    const data: GithubRepo = await response.json()
    
    return {
      repoName: data.name,
      repoUrl: data.html_url,
    }
  } catch (error) {
    console.error('Error creating GitHub repo:', error)
    return null
  }
}
