"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Zap,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react"
import { fleeceColors } from "@/lib/fleece-theme"

export default function FleeceAIDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch dashboard stats from API
    // For now, using mock data
    setStats({
      auditsCompleted: 3,
      activeWorkflows: 5,
      coursesInProgress: 2,
      certificatesEarned: 1,
      level: 3,
      totalPoints: 1250,
    })
    setLoading(false)
  }, [])

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: fleeceColors.background.primary }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-white/95 backdrop-blur-sm" style={{ borderColor: fleeceColors.border.light }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-1" style={{ color: fleeceColors.accent.primary }}>
                Fleece AI
              </h1>
              <p className="text-base" style={{ color: fleeceColors.text.secondary }}>
                Votre écosystème complet d'automatisation IA
              </p>
            </div>

            {!loading && stats && (
              <div className="flex items-center gap-4 px-6 py-3 rounded-lg" style={{ backgroundColor: fleeceColors.accent.ultraLight }}>
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: fleeceColors.text.secondary }}>
                    Niveau {stats.level}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: fleeceColors.accent.primary }}>
                    {stats.totalPoints} pts
                  </div>
                </div>
                <Award className="w-10 h-10" style={{ color: fleeceColors.accent.primary }} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: fleeceColors.text.primary }}>
            Bienvenue 👋
          </h2>
          <p className="text-lg" style={{ color: fleeceColors.text.secondary }}>
            Transformez votre entreprise avec l'IA - de l'audit à l'implémentation jusqu'à la formation.
          </p>
        </div>

        {/* Stats Overview */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border" style={{ borderColor: fleeceColors.border.light }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: fleeceColors.text.secondary }}>
                  Audits Complétés
                </CardTitle>
                <CheckCircle2 className="w-4 h-4" style={{ color: fleeceColors.services.consulting }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: fleeceColors.text.primary }}>{stats.auditsCompleted}</div>
              </CardContent>
            </Card>

            <Card className="border" style={{ borderColor: fleeceColors.border.light }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: fleeceColors.text.secondary }}>
                  Workflows Actifs
                </CardTitle>
                <Zap className="w-4 h-4" style={{ color: fleeceColors.services.automations }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: fleeceColors.text.primary }}>{stats.activeWorkflows}</div>
              </CardContent>
            </Card>

            <Card className="border" style={{ borderColor: fleeceColors.border.light }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: fleeceColors.text.secondary }}>
                  Cours en Cours
                </CardTitle>
                <Clock className="w-4 h-4" style={{ color: fleeceColors.services.formations }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: fleeceColors.text.primary }}>{stats.coursesInProgress}</div>
              </CardContent>
            </Card>

            <Card className="border" style={{ borderColor: fleeceColors.border.light }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: fleeceColors.text.secondary }}>
                  Certificats
                </CardTitle>
                <Award className="w-4 h-4" style={{ color: fleeceColors.status.warning }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: fleeceColors.text.primary }}>{stats.certificatesEarned}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* The 3 Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Consulting */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4" style={{ borderTopColor: fleeceColors.services.consulting }}>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Search className="w-12 h-12" style={{ color: fleeceColors.services.consulting }} />
                <Badge className="text-xs px-3 py-1" style={{ backgroundColor: fleeceColors.accent.ultraLight, color: fleeceColors.accent.primary }}>
                  Étape 1
                </Badge>
              </div>
              <CardTitle className="text-xl mb-2" style={{ color: fleeceColors.text.primary }}>
                Fleece AI Consulting
              </CardTitle>
              <CardDescription style={{ color: fleeceColors.text.secondary }}>
                Auditez vos processus métier et découvrez les opportunités d'automatisation IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.consulting }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Audit IA de vos processus métier</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.consulting }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Cartographie des processus et diagrammes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.consulting }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Recommandations d'automatisation détaillées</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.consulting }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Estimations ROI et priorités</span>
                </li>
              </ul>

              <Link href="/fleece/consulting" className="w-full block">
                <Button className="w-full font-semibold" style={{ backgroundColor: fleeceColors.services.consulting, color: fleeceColors.background.primary }}>
                  Démarrer un Audit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Automatisations */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4" style={{ borderTopColor: fleeceColors.services.automations }}>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-12 h-12" style={{ color: fleeceColors.services.automations }} />
                <Badge className="text-xs px-3 py-1" style={{ backgroundColor: '#F3E8FF', color: fleeceColors.services.automations }}>
                  Étape 2
                </Badge>
              </div>
              <CardTitle className="text-xl mb-2" style={{ color: fleeceColors.text.primary }}>
                Fleece AI Automatisations
              </CardTitle>
              <CardDescription style={{ color: fleeceColors.text.secondary }}>
                Transformez les recommandations en workflows actifs avec Pipedream
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.automations }} />
                  <span style={{ color: fleeceColors.text.secondary }}>L'IA génère des workflows Pipedream</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.automations }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Connexion à 2,500+ apps via OAuth</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.automations }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Déploiement en un clic</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.automations }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Monitoring d'exécution en temps réel</span>
                </li>
              </ul>

              <Link href="/fleece/automations" className="w-full block">
                <Button className="w-full font-semibold" style={{ backgroundColor: fleeceColors.services.automations, color: fleeceColors.background.primary }}>
                  Créer des Workflows
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Formations */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4" style={{ borderTopColor: fleeceColors.services.formations }}>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <GraduationCap className="w-12 h-12" style={{ color: fleeceColors.services.formations }} />
                <Badge className="text-xs px-3 py-1" style={{ backgroundColor: '#D1FAE5', color: fleeceColors.services.formations }}>
                  Étape 3
                </Badge>
              </div>
              <CardTitle className="text-xl mb-2" style={{ color: fleeceColors.text.primary }}>
                Fleece AI Formations
              </CardTitle>
              <CardDescription style={{ color: fleeceColors.text.secondary }}>
                Maîtrisez vos automations avec des cours personnalisés et certifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.formations }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Cours personnalisés générés par IA</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.formations }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Leçons vidéo interactives</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.formations }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Quiz de validation des connaissances</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: fleeceColors.services.formations }} />
                  <span style={{ color: fleeceColors.text.secondary }}>Certificats vérifiés</span>
                </li>
              </ul>

              <Link href="/fleece/formations" className="w-full block">
                <Button className="w-full font-semibold" style={{ backgroundColor: fleeceColors.services.formations, color: fleeceColors.background.primary }}>
                  Commencer la Formation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="border" style={{ borderColor: fleeceColors.border.light, backgroundColor: fleeceColors.accent.ultraLight }}>
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: fleeceColors.text.primary }}>
              Comment ça fonctionne
            </CardTitle>
            <CardDescription style={{ color: fleeceColors.text.secondary }}>
              Transformez votre entreprise en 3 étapes simples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl mb-4 text-white" style={{ backgroundColor: fleeceColors.services.consulting }}>
                  1
                </div>
                <h3 className="font-semibold mb-2 text-lg" style={{ color: fleeceColors.text.primary }}>
                  Audit & Découverte
                </h3>
                <p className="text-sm" style={{ color: fleeceColors.text.secondary }}>
                  Consulting analyse vos processus et identifie les opportunités d'automatisation
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl mb-4 text-white" style={{ backgroundColor: fleeceColors.services.automations }}>
                  2
                </div>
                <h3 className="font-semibold mb-2 text-lg" style={{ color: fleeceColors.text.primary }}>
                  Construction & Déploiement
                </h3>
                <p className="text-sm" style={{ color: fleeceColors.text.secondary }}>
                  Automatisations crée et déploie vos workflows avec les apps connectées
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl mb-4 text-white" style={{ backgroundColor: fleeceColors.services.formations }}>
                  3
                </div>
                <h3 className="font-semibold mb-2 text-lg" style={{ color: fleeceColors.text.primary }}>
                  Apprentissage & Maîtrise
                </h3>
                <p className="text-sm" style={{ color: fleeceColors.text.secondary }}>
                  Formations génère des cours pour que votre équipe maîtrise les nouveaux workflows
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/95 backdrop-blur-sm mt-auto" style={{ borderColor: fleeceColors.border.light }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm" style={{ color: fleeceColors.text.secondary }}>
            <div>© 2024 Fleece AI. Propulsé par Pipedream.</div>
            <div className="flex gap-6">
              <Link href="/docs" className="hover:opacity-80 transition-opacity">
                Documentation
              </Link>
              <Link href="/support" className="hover:opacity-80 transition-opacity">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
