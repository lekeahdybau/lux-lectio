import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, Heart, Lightbulb, User, Palette, Calendar } from "lucide-react"
import type { SpiritualContent } from "@/lib/spiritual-content"

interface SpiritualContentDisplayProps {
  content: SpiritualContent
}

export function SpiritualContentDisplay({ content }: SpiritualContentDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Commentaires des messes */}
      <Card className="border-blue-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center">
            <Book className="h-5 w-5 mr-2" />
            Commentaires des messes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Première messe</h4>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {content.commentaires.premiere_lecture}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Psaume</h4>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{content.commentaires.psaume}</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Évangile</h4>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{content.commentaires.evangile}</p>
          </div>
        </CardContent>
      </Card>

      {/* Homélie */}
      <Card className="border-amber-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Méditation du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-gray-700 dark:text-gray-300 italic">{content.homelie}</p>
        </CardContent>
      </Card>

      {/* Prière universelle */}
      <Card className="border-purple-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Prière universelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm italic text-purple-700 dark:text-purple-300">
            {content.priere_universelle.introduction}
          </p>
          <div className="space-y-2">
            {content.priere_universelle.intentions.map((intention, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold mt-1">•</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{intention}</p>
              </div>
            ))}
          </div>
          <p className="text-sm italic text-purple-700 dark:text-purple-300 pt-2 border-t border-purple-200 dark:border-purple-800">
            {content.priere_universelle.conclusion}
          </p>
        </CardContent>
      </Card>

      {/* Saint du jour */}
      <Card className="border-rose-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-rose-800 dark:text-rose-200 flex items-center">
            <User className="h-5 w-5 mr-2" />
            {content.saint_du_jour.nom}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{content.saint_du_jour.biographie}</p>
          <p className="text-sm italic text-rose-700 dark:text-rose-300">{content.saint_du_jour.celebration}</p>
        </CardContent>
      </Card>

      {/* Informations liturgiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200 flex items-center text-base">
              <Palette className="h-4 w-4 mr-2" />
              Couleur liturgique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="mb-2 capitalize" variant="secondary">
              {content.couleur_liturgique.couleur}
            </Badge>
            <p className="text-sm text-gray-700 dark:text-gray-300">{content.couleur_liturgique.signification}</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-indigo-800 dark:text-indigo-200 flex items-center text-base">
              <Calendar className="h-4 w-4 mr-2" />
              Temps liturgique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="mb-2 capitalize" variant="secondary">
              {content.temps_liturgique.nom}
            </Badge>
            <p className="text-sm text-gray-700 dark:text-gray-300">{content.temps_liturgique.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
