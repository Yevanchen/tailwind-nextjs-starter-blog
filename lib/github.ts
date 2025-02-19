const GITHUB_API_URL = 'https://api.github.com'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.GITHUB_REPO_OWNER
const REPO_NAME = process.env.GITHUB_REPO_NAME

// 添加环境变量检查日志
console.log('GitHub Configuration:', {
  token: GITHUB_TOKEN ? '存在' : '缺失',
  owner: REPO_OWNER,
  repo: REPO_NAME,
})

interface GitHubAPIOptions {
  method: string
  path: string
  body?: Record<string, unknown>
}

async function githubAPI({ method, path, body }: GitHubAPIOptions) {
  console.log('Making GitHub API call:', {
    method,
    path,
    hasBody: !!body,
  })

  const response = await fetch(`${GITHUB_API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    console.error('GitHub API error:', {
      status: response.status,
      statusText: response.statusText,
      body: await response.text(),
    })
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}

export async function createOrUpdateFile(filePath: string, content: string, message: string) {
  console.log('Attempting to create/update file:', {
    filePath,
    contentLength: content.length,
    message,
  })

  // 首先获取文件信息（如果存在）
  let sha: string | undefined
  try {
    const fileInfo = await githubAPI({
      method: 'GET',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    })
    sha = fileInfo.sha
    console.log('Existing file found, SHA:', sha)
  } catch (error) {
    console.log('No existing file found, creating new file')
  }

  // 创建或更新文件
  return githubAPI({
    method: 'PUT',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    body: {
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
    },
  })
}

export async function getCurrentBranch() {
  const response = await githubAPI({
    method: 'GET',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/branches/main`,
  })
  return response.name
}
