import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cross, Heart, Users, Globe, User, GraduationCap, Briefcase } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Cross className="h-12 w-12 text-liturgical-primary mr-3" />
          <h1 className="text-4xl font-bold text-liturgical-primary">Lux Lectio</h1>
        </div>
        <p className="text-xl text-muted-foreground">Votre compagnon spirituel quotidien</p>
        <Badge variant="secondary" className="mt-2">
          Version 2.0
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Mission */}
        <Card className="border-liturgical-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center text-liturgical-primary">
              <Heart className="h-6 w-6 mr-2" />
              Notre mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Lux Lectio (Lumière de la Lecture) a été conçue pour accompagner les fidèles catholiques dans leur vie
              spirituelle quotidienne. Notre application offre un accès simple et complet aux richesses de la liturgie
              catholique : lectures du jour, offices des heures, vies des saints et méditations spirituelles.
            </p>
          </CardContent>
        </Card>

        {/* Concepteur */}
        <Card className="border-liturgical-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center text-liturgical-primary">
              <User className="h-6 w-6 mr-2" />
              Concepteur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="bg-liturgical-primary/10 p-4 rounded-full flex items-center justify-center">
                <User className="h-16 w-16 text-liturgical-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-liturgical-primary">AHOUFACK Dylanne Baudouin</h3>
                <p className="text-muted-foreground">Ingénieur en Génie Logiciel</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-liturgical-primary mr-2 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Affiliations professionnelles</h4>
                  <p className="text-sm text-muted-foreground">
                    Promoteur de la Progress Intelligent Startup (PI Startup)
                  </p>
                  <p className="text-sm text-muted-foreground">Fondateur du mouvement Voie, Vérité, Vie (3V)</p>
                </div>
              </div>

              <div className="flex items-start">
                <GraduationCap className="h-5 w-5 text-liturgical-primary mr-2 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Formation</h4>
                  <p className="text-sm text-muted-foreground">
                    Diplômé de l'ECATHED (École Cathédrale de Théologie pour les Laïcs de Douala)
                  </p>
                  <p className="text-sm text-muted-foreground">19e promotion, 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fonctionnalités */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-liturgical-primary">
              <Globe className="h-6 w-6 mr-2" />
              Fonctionnalités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">📖 Lectures quotidiennes</h4>
                <p className="text-sm text-muted-foreground">
                  Première lecture, psaume et évangile avec commentaires spirituels
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🕐 Offices des heures</h4>
                <p className="text-sm text-muted-foreground">
                  Laudes, Vêpres, Complies et tous les offices de la journée
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">👤 Saints du jour</h4>
                <p className="text-sm text-muted-foreground">Biographies détaillées et enseignements spirituels</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🎨 Couleurs liturgiques</h4>
                <p className="text-sm text-muted-foreground">
                  Interface qui s'adapte aux temps et couleurs liturgiques
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">💭 Méditations</h4>
                <p className="text-sm text-muted-foreground">
                  Commentaires, homélies et prières universelles quotidiennes
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📱 Mode hors ligne</h4>
                <p className="text-sm text-muted-foreground">Accès aux contenus même sans connexion internet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-liturgical-primary">
              <Users className="h-6 w-6 mr-2" />
              Remerciements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Nous remercions tous ceux qui ont contribué à la réalisation de cette application, ainsi que les sources
              des textes liturgiques qui permettent de nourrir notre foi au quotidien.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
