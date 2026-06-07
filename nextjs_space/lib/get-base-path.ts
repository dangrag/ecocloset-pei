// Helper para obter o basePath configurado no Next.js
// No GitHub Pages, o basePath e '/ecocloset-pei'
// No dev/Abacus, o basePath e ''
export function getBasePath(): string {
  // O Next.js define __NEXT_DATA__.basePath no runtime do client
  if (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.basePath) {
    return (window as any).__NEXT_DATA__.basePath;
  }
  return '';
}

// Adiciona o basePath a uma URL de imagem se necessario
export function withBasePath(path: string): string {
  if (!path) return path;
  // Se ja e uma URL absoluta, base64 ou ja tem basePath, nao modifica
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const base = getBasePath();
  if (base && !path.startsWith(base)) {
    return `${base}${path}`;
  }
  return path;
}
