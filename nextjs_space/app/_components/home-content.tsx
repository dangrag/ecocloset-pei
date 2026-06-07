'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Leaf, Recycle, ShieldCheck, TreePine, ShoppingBag,
  Shirt, ScanLine, MapPin, BarChart3, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProducts } from '@/lib/storage';
import { withBasePath } from '@/lib/get-base-path';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { saveProducts } from '@/lib/storage';
import { Product } from '@/lib/types';
import SustainabilityBadge, { LocalSupplierBadge } from '@/components/eco/sustainability-badge';

function CountUp({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    const safeEnd = end ?? 0;
    let start = 0;
    const step = safeEnd / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= safeEnd) {
        setCount(safeEnd);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const FEATURES = [
  {
    icon: Shirt,
    title: 'Cadastro de Produtos',
    desc: 'Gerencie seu estoque de moda sustentavel com informacoes detalhadas sobre materiais e fornecedores.',
    href: '/admin',
  },
  {
    icon: ScanLine,
    title: 'Provador Virtual',
    desc: 'Experimente roupas virtualmente sobrepostas em sua foto. Tecnologia de canvas para visualizacao.',
    href: '/provador',
  },
  {
    icon: MapPin,
    title: 'Fornecedores Locais',
    desc: 'Selo exclusivo para fornecedores locais, priorizando a economia regional e reduzindo emissoes.',
    href: '/catalogo',
  },
  {
    icon: BarChart3,
    title: 'Indice de Sustentabilidade',
    desc: 'Nota ecologica para cada produto baseada no material utilizado e processo de fabricacao.',
    href: '/catalogo',
  },
  {
    icon: TreePine,
    title: 'Pegada de Carbono',
    desc: 'Calcule o impacto ambiental estimado das suas compras comparado com a moda convencional.',
    href: '/carrinho',
  },
  {
    icon: Recycle,
    title: 'Economia Circular',
    desc: 'Promovemos materiais reciclados e organicos para um ciclo de moda mais consciente.',
    href: '/catalogo',
  },
];

export default function HomeContent() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let prods = getProducts();
    if ((prods?.length ?? 0) === 0) {
      saveProducts(SEED_PRODUCTS);
      prods = SEED_PRODUCTS;
    }
    setProducts(prods ?? []);
  }, []);

  const featured = (products ?? []).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/30 dark:via-background dark:to-teal-950/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-[1200px] px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              Projeto PEI - Analise e Desenvolvimento de Sistemas
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Moda que respeita o{' '}
              <span className="text-primary">planeta</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sistema de controle de estoque com provador virtual e foco em sustentabilidade.
              Cada peca carrega seu indice ecologico e pegada de carbono.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/catalogo">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Ver Catalogo
                </Button>
              </Link>
              <Link href="/provador">
                <Button size="lg" variant="outline" className="gap-2">
                  <ScanLine className="h-5 w-5" />
                  Provador Virtual
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold font-display">
                <CountUp end={products?.length ?? 0} />
              </p>
              <p className="text-sm opacity-80 mt-1">Produtos Eco</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold font-display">
                <CountUp end={85} suffix="%" />
              </p>
              <p className="text-sm opacity-80 mt-1">Menos CO2</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold font-display">
                <CountUp end={10} />
              </p>
              <p className="text-sm opacity-80 mt-1">Materiais Sustentaveis</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold font-display">
                <CountUp end={100} suffix="%" />
              </p>
              <p className="text-sm opacity-80 mt-1">Transparencia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Funcionalidades <span className="text-primary">Sustentaveis</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada recurso foi pensado para promover a moda consciente e reduzir o impacto ambiental
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat: any, i: number) => {
              const Icon = feat?.icon ?? Leaf;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link href={feat?.href ?? '/'}>
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{feat?.title}</h3>
                        <p className="text-sm text-muted-foreground">{feat?.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-[1200px] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground mb-2">
                Destaques do Catalogo
              </h2>
              <p className="text-muted-foreground">Pecas com os melhores indices de sustentabilidade</p>
            </div>
            <Link href="/catalogo">
              <Button variant="outline" className="gap-2 hidden md:flex">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product: Product, i: number) => (
              <motion.div
                key={product?.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={withBasePath(product?.image ?? '/products/tshirt.jpg')}
                      alt={product?.name ?? 'Produto'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <SustainabilityBadge score={product?.sustainabilityScore ?? 0} size="sm" showLabel={false} />
                      {product?.isLocal && <LocalSupplierBadge />}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground truncate">{product?.name ?? 'Produto'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{product?.supplier ?? ''}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-primary font-mono">
                        R$ {(product?.price ?? 0)?.toFixed?.(2)?.replace?.('.', ',')}
                      </span>
                      <span className="text-xs text-muted-foreground">{product?.size ?? ''}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/catalogo">
              <Button variant="outline" className="gap-2">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About PEI */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground mb-4">
              Sobre o Projeto
            </h2>
            <p className="text-muted-foreground mb-6">
              O EcoCloset foi desenvolvido como Projeto de Extensao e Integracao (PEI) da disciplina
              de Analise e Desenvolvimento de Sistemas. O objetivo e demonstrar como a tecnologia
              pode ser aliada da sustentabilidade na industria da moda, oferecendo ferramentas para
              controle de estoque ecologico, rastreabilidade de materiais e conscientizacao sobre
              o impacto ambiental do consumo de vestuario.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm dark:bg-emerald-900/30 dark:text-emerald-400">ODS 12 - Consumo Responsavel</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm dark:bg-blue-900/30 dark:text-blue-400">ODS 13 - Acao Climatica</span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm dark:bg-amber-900/30 dark:text-amber-400">ODS 9 - Inovacao</span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
