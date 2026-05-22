'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Award, Truck, TreePine, Shield, Leaf,
  Building2, Navigation, BadgeCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getSuppliers } from '@/lib/storage';
import { Supplier, TRANSPORT_EMISSION_FACTORS, calculateShippingCarbon, STORE_LOCATION } from '@/lib/types';
import { LocalSupplierBadge } from '@/components/eco/sustainability-badge';

export default function FornecedoresContent() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    setSuppliers(getSuppliers());
  }, []);

  const localSuppliers = suppliers.filter(s => s.isLocal);
  const externalSuppliers = suppliers.filter(s => !s.isLocal);
  const avgDistance = suppliers.length > 0
    ? Math.round(suppliers.reduce((acc, s) => acc + s.distanceKm, 0) / suppliers.length)
    : 0;
  const avgLocalDistance = localSuppliers.length > 0
    ? Math.round(localSuppliers.reduce((acc, s) => acc + s.distanceKm, 0) / localSuppliers.length)
    : 0;
  const avgExternalDistance = externalSuppliers.length > 0
    ? Math.round(externalSuppliers.reduce((acc, s) => acc + s.distanceKm, 0) / externalSuppliers.length)
    : 0;

  const maxDistance = Math.max(...suppliers.map(s => s.distanceKm), 1);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
          Nossos <span className="text-primary">Fornecedores</span>
        </h1>
        <p className="text-muted-foreground">
          Conheca quem produz as pecas do EcoCloset e a pegada de carbono do transporte
        </p>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
          <Building2 className="h-4 w-4" />
          Base: {STORE_LOCATION.label}
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{suppliers.length}</p>
              <p className="text-xs text-muted-foreground">Fornecedores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{localSuppliers.length}</p>
              <p className="text-xs text-muted-foreground">Locais (selo verde)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Navigation className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgLocalDistance} km</p>
              <p className="text-xs text-muted-foreground">Media local</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Truck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgExternalDistance} km</p>
              <p className="text-xs text-muted-foreground">Media externo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {suppliers
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .map((supplier, i) => {
            const shippingCO2 = calculateShippingCarbon(supplier.distanceKm, supplier.transportType);
            const transport = TRANSPORT_EMISSION_FACTORS[supplier.transportType];

            return (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className={`overflow-hidden h-full ${supplier.isLocal ? 'border-emerald-300 dark:border-emerald-800' : ''}`}>
                  {supplier.isLocal && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Fornecedor Local - Selo Verde
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{supplier.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {supplier.address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {supplier.city}/{supplier.state} - CEP: {supplier.cep}
                        </p>
                      </div>
                      {supplier.isLocal && <LocalSupplierBadge size="md" />}
                    </div>

                    {/* Distance bar */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Navigation className="h-3 w-3" /> Distancia
                        </span>
                        <span className="font-mono font-semibold text-foreground">{supplier.distanceKm} km</span>
                      </div>
                      <Progress
                        value={(supplier.distanceKm / maxDistance) * 100}
                        className="h-2"
                      />
                    </div>

                    {/* Transport & CO2 */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Transporte</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {transport?.icon} {transport?.label ?? supplier.transportType}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${shippingCO2 === 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <TreePine className={`h-4 w-4 ${shippingCO2 === 0 ? 'text-emerald-600' : 'text-amber-600'}`} />
                          <span className={`text-xs ${shippingCO2 === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>CO2 Frete</span>
                        </div>
                        <p className={`text-sm font-bold font-mono ${shippingCO2 === 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                          {shippingCO2 === 0 ? 'Zero!' : `${shippingCO2.toFixed(1)} kg`}
                        </p>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Certificacoes
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {supplier.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs gap-1">
                            <BadgeCheck className="h-3 w-3" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Sustainability Score */}
                    <div className="mt-4 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Score sustentabilidade:</span>
                      <span className="font-bold text-primary">{supplier.sustainabilityScore}/10</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
      </div>

      {/* Educational Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <TreePine className="h-5 w-5 text-primary" />
              Como calculamos a pegada de carbono do frete?
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                O calculo de CO2 do frete e baseado na <strong className="text-foreground">distancia</strong> entre o fornecedor e a loja,
                multiplicada pelo <strong className="text-foreground">fator de emissao</strong> do tipo de transporte utilizado.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {Object.entries(TRANSPORT_EMISSION_FACTORS).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-lg bg-background border border-border">
                    <p className="text-lg mb-1">{val.icon}</p>
                    <p className="font-medium text-foreground text-xs">{val.label}</p>
                    <p className="font-mono text-xs">{val.factor} kg CO2/km</p>
                  </div>
                ))}
              </div>
              <p className="mt-3">
                <strong className="text-foreground">Formula:</strong> CO2 (kg) = Distancia (km) x Fator de emissao (kg CO2/km)
              </p>
              <p>
                Fornecedores <strong className="text-foreground">locais</strong> (menos de 100 km) recebem o selo verde
                e podem utilizar transporte de baixa emissao como bicicletas e vans eletricas.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
