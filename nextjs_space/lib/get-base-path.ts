// Helper para obter o basePath configurado no Next.js
// Detecta automaticamente se esta rodando no GitHub Pages
export function getBasePath(): string {
  if (typeof window === 'undefined') return '';

  // Tenta pegar do __NEXT_DATA__ (funciona em SSR/dev)
  if ((window as any).__NEXT_DATA__?.basePath) {
    return (window as any).__NEXT_DATA__.basePath;
  }

  // Fallback: detecta pelo pathname da URL atual
  // Se a URL e /ecocloset-pei/..., o basePath e /ecocloset-pei
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/([^/]+)/);
  if (match && match[1] === 'ecocloset-pei') {
    return '/ecocloset-pei';
  }

  return '';
}

// Adiciona o basePath a uma URL de imagem se necessario
export function withBasePath(path: string): string {
  if (!path) return path;
  // Se ja e uma URL absoluta, base64 ou blob, nao modifica
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const base = getBasePath();
  if (base && !path.startsWith(base)) {
    return `${base}${path}`;
  }
  return path;
}
