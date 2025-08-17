"use client"

import { useState, useEffect } from "react"
import { User, Calendar, MapPin, Heart, Star, Book } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLiturgical } from "@/components/liturgical-provider"

interface Saint {
  nom: string
  dates: string
  lieu: string
  fete: string
  biographie: string
  spiritualite: string
  patronage: string[]
  citation: string
}

export default function SaintsPage() {
  const { liturgicalData, currentDate } = useLiturgical()
  const [saints, setSaints] = useState<Saint[]>([])

  const formatLiturgicalDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const generateSaintsData = () => {
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()

    // Base de données enrichie des saints selon les dates
    const saintsDatabase: Record<string, Saint[]> = {
      "1-1": [
        {
          nom: "Sainte Marie, Mère de Dieu",
          dates: "Ier siècle",
          lieu: "Nazareth, Palestine",
          fete: "1er janvier - Solennité",
          biographie:
            "Marie, Mère de Jésus, est vénérée comme la Mère de Dieu depuis le Concile d'Éphèse (431). Elle a donné son 'oui' à l'Annonciation et a accompagné son Fils jusqu'à la croix. Elle est l'exemple parfait de la foi et de l'obéissance à Dieu.",
          spiritualite:
            "Marie nous enseigne l'abandon total à la volonté de Dieu. Son 'Fiat' (qu'il me soit fait selon ta parole) est le modèle de toute vocation chrétienne. Elle nous apprend à méditer la Parole de Dieu dans notre cœur et à faire confiance même quand nous ne comprenons pas.",
          patronage: ["Mère de l'Église", "Patronne de la France", "Reine de la paix"],
          citation: "Je suis la servante du Seigneur ; que tout m'advienne selon ta parole ! (Lc 1,38)",
        },
      ],
      "6-13": [
        {
          nom: "Saint Antoine de Padoue",
          dates: "1195-1231",
          lieu: "Lisbonne (Portugal) - Padoue (Italie)",
          fete: "13 juin - Mémoire",
          biographie:
            "Né Fernando Martins de Bulhões à Lisbonne, il devient franciscain et prend le nom d'Antoine. Docteur de l'Église, il était surnommé 'l'Arche du Testament' pour sa connaissance extraordinaire des Écritures. Grand prédicateur, il convertit de nombreux hérétiques et défend les pauvres.",
          spiritualite:
            "Saint Antoine nous enseigne l'amour de la Parole de Dieu et le zèle apostolique. Sa dévotion au Christ enfant nous rappelle l'importance de la simplicité et de l'humilité. Il nous montre comment allier contemplation et action, étude et prédication.",
          patronage: ["Objets perdus", "Pauvres", "Prédicateurs", "Portugal"],
          citation: "Les actions parlent plus haut que les paroles ; que votre livre soit votre vie.",
        },
      ],
      "10-1": [
        {
          nom: "Sainte Thérèse de l'Enfant-Jésus",
          dates: "1873-1897",
          lieu: "Alençon - Lisieux (France)",
          fete: "1er octobre - Mémoire",
          biographie:
            "Marie-Françoise-Thérèse Martin entre au Carmel de Lisieux à 15 ans. Elle découvre la 'petite voie' de l'enfance spirituelle, faite de confiance et d'abandon. Docteur de l'Église, elle meurt à 24 ans en promettant de passer son ciel à faire du bien sur la terre.",
          spiritualite:
            "Sainte Thérèse nous enseigne que la sainteté est accessible à tous par la 'petite voie' : faire les petites choses avec un grand amour. Sa confiance absolue en Dieu nous libère de l'angoisse spirituelle et nous ouvre à la miséricorde divine.",
          patronage: ["Missions", "France", "Aviateurs", "Malades de tuberculose"],
          citation: "Je veux passer mon ciel à faire du bien sur la terre.",
        },
      ],
      default: [
        {
          nom: liturgicalData?.informations?.fete || "Saints du jour",
          dates: "Diverses époques",
          lieu: "Divers lieux",
          fete: `${day} ${["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"][month - 1]}`,
          biographie:
            "Aujourd'hui, l'Église nous propose de nous inspirer de la vie des saints. Chaque saint a répondu à l'appel de Dieu de manière unique, nous montrant qu'il existe mille chemins vers la sainteté. Leur exemple nous encourage et leur intercession nous soutient.",
          spiritualite:
            "Les saints nous enseignent que la sainteté se vit dans l'ordinaire de nos jours. Ils ont su transformer leur époque par leur témoignage de foi, d'espérance et de charité. Leur vie nous montre que Dieu peut faire des merveilles avec ceux qui lui font confiance.",
          patronage: ["Intercesseurs", "Modèles de vie chrétienne"],
          citation: "Vous donc, vous serez parfaits comme votre Père céleste est parfait. (Mt 5,48)",
        },
      ],
    }

    const key = `${month}-${day}`
    return saintsDatabase[key] || saintsDatabase["default"]
  }

  useEffect(() => {
    setSaints(generateSaintsData())
  }, [currentDate, liturgicalData])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-liturgical-primary mb-2">Saints du jour</h1>
        <p className="text-muted-foreground">Modèles de sainteté et intercesseurs pour notre temps</p>
        <p className="text-sm text-liturgical-primary font-medium mt-2">{formatLiturgicalDate(currentDate)}</p>
      </div>

      <div className="space-y-6">
        {saints.map((saint, index) => (
          <Card key={index} className="border-liturgical-primary/20">
            <CardHeader className="bg-liturgical-primary/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-liturgical-primary/20 rounded-full">
                    <User className="h-6 w-6 text-liturgical-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-liturgical-primary">{saint.nom}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {saint.dates}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {saint.lieu}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-liturgical-primary/20 text-liturgical-primary">
                  {saint.fete}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Biographie */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-liturgical-primary mb-3">
                  <Book className="h-5 w-5 mr-2" />
                  Biographie
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{saint.biographie}</p>
              </div>

              {/* Spiritualité */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-liturgical-primary mb-3">
                  <Heart className="h-5 w-5 mr-2" />
                  Spiritualité et enseignement
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{saint.spiritualite}</p>
              </div>

              {/* Patronage */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-liturgical-primary mb-3">
                  <Star className="h-5 w-5 mr-2" />
                  Patronage
                </h3>
                <div className="flex flex-wrap gap-2">
                  {saint.patronage.map((patron, idx) => (
                    <Badge key={idx} variant="outline" className="border-liturgical-primary/30">
                      {patron}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Citation */}
              <div className="bg-liturgical-primary/5 p-4 rounded-lg border-l-4 border-liturgical-primary">
                <p className="italic text-liturgical-primary font-medium">"{saint.citation}"</p>
              </div>

              {/* Prière */}
              <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-liturgical-primary mb-2">Prière</h4>
                <p className="text-sm italic text-gray-700 dark:text-gray-300">
                  {saint.nom}, vous qui avez su répondre généreusement à l'appel de Dieu, intercédez pour nous auprès du
                  Seigneur. Aidez-nous à vivre notre foi avec la même ardeur et la même confiance que vous. Que votre
                  exemple nous guide sur le chemin de la sainteté. Amen.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
