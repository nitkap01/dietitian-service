import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './app/server/tokens';

// Public paths that never require a session.
function isPublic(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname === '/portal/login' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/portal/auth')
  );
}

function isPortalArea(pathname: string): boolean {
  return pathname === '/portal' || pathname.startsWith('/portal/') || pathname.startsWith('/api/portal');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  // Client portal area → portal_session (client)
  if (isPortalArea(pathname)) {
    const token = req.cookies.get('portal_session')?.value;
    const session = await verifySession(token);
    if (!session || session.kind !== 'client') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/portal/login', req.url));
    }
    return NextResponse.next();
  }

  // Everything else → admin (cms_session)
  const token = req.cookies.get('cms_session')?.value;
  const session = await verifySession(token);
  if (!session || session.kind !== 'admin') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
