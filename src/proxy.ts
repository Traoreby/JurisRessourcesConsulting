import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname === "/admin/login";

  // Si non connecté et qu'on tente d'accéder à /admin (sauf login)
  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Si connecté et qu'on tente d'accéder au login -> redirige vers le dashboard
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // Optionnel : on peut aussi refuser l'accès si l'utilisateur n'a pas de profil.
  // Mais cela nécessiterait un appel à la base de données supplémentaire dans le middleware
  // Il est souvent préférable de vérifier le rôle dans le composant ou layout pour afficher une page "Accès refusé".

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*", // Protège tout ce qui commence par /admin
  ],
};
