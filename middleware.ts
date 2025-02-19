import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 这里可以配置需要保护的路径
const PROTECTED_PATHS = ['/editor', '/api/posts/create']
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your-secure-password'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 检查是否是受保护的路径
  if (PROTECTED_PATHS.some((protectedPath) => path.startsWith(protectedPath))) {
    const authHeader = request.headers.get('authorization')

    // 检查认证头
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      })
    }

    // 解码认证信息
    try {
      const authValue = authHeader.split(' ')[1]
      const [username, password] = atob(authValue).split(':')

      // 这里使用简单的用户名和密码检查
      // 在生产环境中应该使用更安全的认证方式
      if (username !== 'admin' || password !== ADMIN_PASSWORD) {
        return new NextResponse('Invalid credentials', { status: 401 })
      }
    } catch (e) {
      return new NextResponse('Invalid credentials', { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/editor/:path*', '/api/posts/create'],
}
