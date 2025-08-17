"use client"

import type React from "react"

import { useState } from "react"
import { Heart, Coffee, Gift, Star, Share2, Mail, MessageCircle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SupportPage() {
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation d'envoi de message
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setMessage("")
    setEmail("")
  }

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Lux Lectio - Compagnon Liturgique",
          text: "Découvrez Lux Lectio, votre compagnon spirituel quotidien pour les lectures liturgiques, offices et méditations.",
          url: window.location.origin,
        })
      } catch (err) {
        console.log("Partage annulé")
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API de partage
      navigator.clipboard.writeText(window.location.origin)
      alert("Lien copié dans le presse-papiers !")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 text-center animate-slide-in-right">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-12 w-12 text-liturgical-primary mr-3 animate-float" />
          <h1 className="text-4xl font-bold text-liturgical-primary">Soutenir Lux Lectio</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Aidez-nous à répandre la Parole de Dieu et à nourrir la foi de nos frères
        </p>
        <Badge variant="secondary" className="mt-2 bg-liturgical-primary/20 text-liturgical-primary">
          Projet à but spirituel
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moyens de soutien */}
        <div className="space-y-6">
          <Card className="liturgical-card hover-lift animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center text-liturgical-primary">
                <Gift className="h-6 w-6 mr-2" />
                Comment nous soutenir
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-liturgical-bg rounded-lg hover-lift">
                  <MessageCircle className="h-6 w-6 text-liturgical-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-liturgical-text">Prière</h4>
                    <p className="text-sm text-muted-foreground">
                      Priez pour le succès de cette mission d'évangélisation numérique
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-liturgical-bg rounded-lg hover-lift">
                  <Share2 className="h-6 w-6 text-liturgical-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-liturgical-text">Partage</h4>
                    <p className="text-sm text-muted-foreground">
                      Partagez l'application avec votre famille, vos amis et votre communauté
                    </p>
                    <Button variant="outline" size="sm" onClick={shareApp} className="mt-2 hover-glow">
                      <Share2 className="h-4 w-4 mr-1" />
                      Partager
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-liturgical-bg rounded-lg hover-lift">
                  <Star className="h-6 w-6 text-liturgical-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-liturgical-text">Témoignage</h4>
                    <p className="text-sm text-muted-foreground">
                      Témoignez de l'impact de cette application dans votre vie spirituelle
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-liturgical-bg rounded-lg hover-lift">
                  <Users className="h-6 w-6 text-liturgical-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-liturgical-text">Communauté</h4>
                    <p className="text-sm text-muted-foreground">
                      Rejoignez le mouvement Voie, Vérité, Vie (3V) pour approfondir votre foi
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-liturgical-bg rounded-lg hover-lift">
                  <Coffee className="h-6 w-6 text-liturgical-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-liturgical-text">Don financier</h4>
                    <p className="text-sm text-muted-foreground">
                      Soutenez le développement et la maintenance de l'application
                    </p>
                    <div className="mt-2 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover-glow"
                        onClick={() => alert("Fonctionnalité de don en cours de développement")}
                      >
                        Faire un don
                      </Button>
                      <p className="text-xs text-muted-foreground">Système de don sécurisé en cours d'implémentation</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact et mission */}
          <Card className="liturgical-card hover-lift animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center text-liturgical-primary">
                <Heart className="h-6 w-6 mr-2" />
                Notre mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lux Lectio est né d'une vision : rendre accessible à tous les trésors de la liturgie catholique grâce
                  aux technologies modernes. Notre objectif est de nourrir la foi de milliers de personnes à travers le
                  monde francophone.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-liturgical-bg rounded-lg">
                    <div className="text-2xl font-bold text-liturgical-primary">100%</div>
                    <div className="text-xs text-muted-foreground">Gratuit</div>
                  </div>
                  <div className="text-center p-3 bg-liturgical-bg rounded-lg">
                    <div className="text-2xl font-bold text-liturgical-primary">24/7</div>
                    <div className="text-xs text-muted-foreground">Disponible</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-liturgical-primary/10 to-liturgical-accent/10 rounded-lg border-l-4 border-liturgical-primary">
                  <p className="text-sm italic text-liturgical-text">
                    "Que votre lumière brille devant les hommes, afin qu'ils voient vos bonnes œuvres et qu'ils
                    glorifient votre Père qui est dans les cieux." - Mt 5,16
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact et feedback */}
        <div className="space-y-6">
          <Card className="liturgical-card hover-lift animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center text-liturgical-primary">
                <Mail className="h-6 w-6 mr-2" />
                Nous contacter
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8 animate-scale-in">
                  <div className="w-16 h-16 bg-liturgical-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-liturgical-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-liturgical-primary mb-2">Merci !</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre message a été envoyé. Nous vous répondrons rapidement.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optionnel)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Votre message</Label>
                    <Textarea
                      id="message"
                      placeholder="Partagez vos suggestions, témoignages ou questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-liturgical-primary hover:bg-liturgical-secondary hover-glow"
                  >
                    Envoyer le message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Développeur */}
          <Card className="liturgical-card hover-lift animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-liturgical-primary">À propos du développeur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-liturgical-primary/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-liturgical-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-liturgical-primary">AHOUFACK Dylanne Baudouin</h4>
                    <p className="text-sm text-muted-foreground">Ingénieur en Génie Logiciel</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-liturgical-primary rounded-full mr-2"></span>
                    Promoteur de Progress Intelligent Startup (PI Startup)
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-liturgical-primary rounded-full mr-2"></span>
                    Fondateur du mouvement Voie, Vérité, Vie (3V)
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-liturgical-primary rounded-full mr-2"></span>
                    Diplômé ECATHED 19e promotion, 2025
                  </div>
                </div>

                <div className="p-3 bg-liturgical-bg rounded-lg">
                  <p className="text-sm italic text-liturgical-text">
                    "Cette application est un acte de foi et d'amour pour l'Église. Que Dieu bénisse tous ceux qui
                    l'utilisent pour grandir dans la sainteté."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques d'impact */}
          <Card className="liturgical-card hover-lift animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-liturgical-primary">Impact spirituel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-liturgical-bg rounded-lg">
                  <div className="text-3xl font-bold text-liturgical-primary mb-1">∞</div>
                  <div className="text-xs text-muted-foreground">Prières accompagnées</div>
                </div>
                <div className="text-center p-4 bg-liturgical-bg rounded-lg">
                  <div className="text-3xl font-bold text-liturgical-primary mb-1">365</div>
                  <div className="text-xs text-muted-foreground">Jours de l'année</div>
                </div>
                <div className="text-center p-4 bg-liturgical-bg rounded-lg">
                  <div className="text-3xl font-bold text-liturgical-primary mb-1">7</div>
                  <div className="text-xs text-muted-foreground">Offices quotidiens</div>
                </div>
                <div className="text-center p-4 bg-liturgical-bg rounded-lg">
                  <div className="text-3xl font-bold text-liturgical-primary mb-1">❤️</div>
                  <div className="text-xs text-muted-foreground">Fait avec amour</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
