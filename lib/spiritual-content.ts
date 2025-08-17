// Générateur de contenu spirituel basé sur l'analyse réelle des lectures liturgiques

export interface SpiritualContent {
  commentaires: {
    premiere_lecture: string
    psaume: string
    evangile: string
  }
  priere_universelle: {
    introduction: string
    intentions: string[]
    conclusion: string
  }
  homelie: string
  saint_du_jour: {
    nom: string
    biographie: string
    celebration: string
  }
  couleur_liturgique: {
    couleur: string
    signification: string
  }
  temps_liturgique: {
    nom: string
    description: string
  }
}

export async function generateSpiritualContent(liturgicalData: any, date: Date): Promise<SpiritualContent> {
  const info = liturgicalData.informations
  const lectures = liturgicalData.messes[0]?.lectures || []

  // Récupération des lectures
  const premiere_lecture = lectures.find((l: any) => l.type === "lecture_1")
  const psaume = lectures.find((l: any) => l.type === "psaume")
  const evangile = lectures.find((l: any) => l.type === "evangile")

  return {
    commentaires: {
      premiere_lecture: analyzeFirstReading(premiere_lecture),
      psaume: analyzePsalm(psaume),
      evangile: analyzeGospel(evangile),
    },
    priere_universelle: generateContextualUniversalPrayer(lectures, info),
    homelie: generateContextualHomily(lectures, info),
    saint_du_jour: generateSaintBiography(info.fete, date),
    couleur_liturgique: {
      couleur: info.couleur,
      signification: getLiturgicalColorMeaning(info.couleur),
    },
    temps_liturgique: {
      nom: info.temps_liturgique,
      description: getLiturgicalSeasonDescription(info.temps_liturgique, info.semaine),
    },
  }
}

function analyzeFirstReading(reading: any): string {
  if (!reading) return "Pas de première lecture disponible pour ce jour."

  const ref = reading.ref
  const titre = reading.titre || ""
  const contenu = reading.contenu || ""

  // Analyse du livre biblique
  if (ref.includes("Gn")) {
    return analyzeGenesis(titre, contenu, ref)
  } else if (ref.includes("Ex")) {
    return analyzeExodus(titre, contenu, ref)
  } else if (ref.includes("1 S") || ref.includes("2 S")) {
    return analyzeSamuel(titre, contenu, ref)
  } else if (ref.includes("1 R") || ref.includes("2 R")) {
    return analyzeKings(titre, contenu, ref)
  } else if (ref.includes("Is")) {
    return analyzeIsaiah(titre, contenu, ref)
  } else if (ref.includes("Jr")) {
    return analyzeJeremiah(titre, contenu, ref)
  } else if (ref.includes("Ez")) {
    return analyzeEzekiel(titre, contenu, ref)
  } else if (ref.includes("Rm")) {
    return analyzeRomans(titre, contenu, ref)
  } else if (ref.includes("1 Co") || ref.includes("2 Co")) {
    return analyzeCorinthians(titre, contenu, ref)
  } else if (ref.includes("Ga")) {
    return analyzeGalatians(titre, contenu, ref)
  } else if (ref.includes("Ep")) {
    return analyzeEphesians(titre, contenu, ref)
  } else if (ref.includes("Ph")) {
    return analyzePhilippians(titre, contenu, ref)
  } else if (ref.includes("Col")) {
    return analyzeColossians(titre, contenu, ref)
  } else if (ref.includes("1 Th") || ref.includes("2 Th")) {
    return analyzeThessalonians(titre, contenu, ref)
  } else if (ref.includes("1 Tm") || ref.includes("2 Tm")) {
    return analyzeTimothy(titre, contenu, ref)
  } else if (ref.includes("He")) {
    return analyzeHebrews(titre, contenu, ref)
  } else if (ref.includes("Jc")) {
    return analyzeJames(titre, contenu, ref)
  } else if (ref.includes("1 P") || ref.includes("2 P")) {
    return analyzePeter(titre, contenu, ref)
  } else if (ref.includes("1 Jn") || ref.includes("2 Jn") || ref.includes("3 Jn")) {
    return analyzeJohn(titre, contenu, ref)
  } else if (ref.includes("Ap")) {
    return analyzeRevelation(titre, contenu, ref)
  } else if (ref.includes("Ac")) {
    return analyzeActs(titre, contenu, ref)
  }

  // Analyse générique basée sur le contenu
  return analyzeGenericReading(titre, contenu, ref)
}

function analyzeGenesis(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("création") || contenu.includes("commencement")) {
    return `La Genèse nous ramène aux origines de toute chose. Ce récit de ${ref} nous révèle que Dieu est à l'origine de tout ce qui existe. "${titre}" nous invite à contempler l'amour créateur de Dieu qui nous appelle à l'existence. Dans notre monde moderne, cette parole nous rappelle notre dignité de créatures aimées de Dieu et notre responsabilité de gardiens de la création.`
  }
  if (contenu.includes("Abraham") || contenu.includes("Abram")) {
    return `Abraham, notre père dans la foi, nous montre le chemin de la confiance en Dieu. "${titre}" nous révèle comment Dieu appelle et guide ceux qui lui font confiance. Comme Abraham, nous sommes invités à sortir de nos sécurités humaines pour nous abandonner à la providence divine. Cette lecture nous encourage à faire confiance à Dieu même quand nous ne comprenons pas ses voies.`
  }
  if (contenu.includes("Jacob") || contenu.includes("Israël")) {
    return `L'histoire de Jacob nous montre comment Dieu transforme nos faiblesses en force. "${titre}" nous révèle la patience et la miséricorde de Dieu qui nous accompagne malgré nos défauts. Jacob devient Israël, celui qui lutte avec Dieu. Cette lecture nous invite à persévérer dans notre relation avec Dieu, même dans les moments difficiles.`
  }
  if (contenu.includes("Joseph")) {
    return `L'histoire de Joseph nous enseigne que Dieu peut tirer le bien du mal. "${titre}" nous montre comment la providence divine agit même à travers les épreuves. Joseph, vendu par ses frères, devient leur sauveur. Cette lecture nous invite à faire confiance à Dieu dans les moments difficiles et à pardonner comme Joseph a pardonné.`
  }
  return `La Genèse nous révèle les fondements de notre foi. "${titre}" nous invite à contempler l'action de Dieu dans l'histoire humaine. Ces récits anciens portent une vérité éternelle sur notre relation avec Dieu et notre vocation à vivre selon son dessein d'amour.`
}

function analyzeExodus(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("Moïse") && contenu.includes("buisson")) {
    return `La vocation de Moïse au buisson ardent révèle le nom de Dieu : "Je suis celui qui suis". "${titre}" nous montre que Dieu entend le cri de son peuple et vient le libérer. Comme Moïse, nous sommes appelés à être des instruments de libération pour nos frères. Cette théophanie nous révèle un Dieu proche qui se soucie de la souffrance humaine.`
  }
  if (contenu.includes("Égypte") && contenu.includes("sortie")) {
    return `L'Exode d'Égypte est le grand récit de libération du peuple de Dieu. "${titre}" nous rappelle que Dieu libère son peuple de l'esclavage. Cette sortie d'Égypte préfigure notre propre libération du péché par le Christ. Nous sommes invités à sortir de nos propres "Égyptes" - tout ce qui nous asservit - pour marcher vers la terre promise.`
  }
  if (contenu.includes("commandements") || contenu.includes("Sinaï")) {
    return `Au Sinaï, Dieu donne sa Loi à son peuple. "${titre}" nous révèle que les commandements ne sont pas un fardeau mais un chemin de liberté. Cette alliance nous montre l'amour de Dieu qui veut notre bonheur. Les commandements sont comme un GPS divin qui nous guide vers la vraie vie.`
  }
  if (contenu.includes("désert")) {
    return `Le désert est l'école de la foi où Dieu éduque son peuple. "${titre}" nous montre que Dieu pourvoit aux besoins de ceux qui lui font confiance. Dans nos propres "déserts" - moments d'épreuve ou de sécheresse spirituelle - Dieu continue de nous nourrir et de nous guider vers la terre promise.`
  }
  return `L'Exode nous révèle un Dieu libérateur qui marche avec son peuple. "${titre}" nous invite à reconnaître l'action de Dieu dans notre propre histoire. Comme le peuple hébreu, nous sommes en marche vers la liberté que Dieu nous offre.`
}

function analyzeCorinthians(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("amour") || contenu.includes("charité")) {
    return `Saint Paul nous révèle ici le secret de la vie chrétienne : l'amour. "${titre}" nous montre que sans l'amour, toutes nos actions perdent leur valeur. Cette hymne à la charité nous invite à examiner la qualité de notre amour : est-il patient, bienveillant, sans jalousie ? L'amour véritable transforme notre regard sur les autres et nous fait grandir à l'image du Christ.`
  }
  if (contenu.includes("corps") && contenu.includes("membres")) {
    return `Paul nous enseigne que l'Église est le Corps du Christ dont nous sommes les membres. "${titre}" nous révèle l'unité dans la diversité : chacun a sa place et son rôle unique. Cette image nous invite à valoriser les dons de chacun et à vivre la solidarité chrétienne. Nous ne sommes pas des individus isolés mais des membres d'un même corps.`
  }
  if (contenu.includes("résurrection")) {
    return `La résurrection du Christ est le fondement de notre espérance. "${titre}" nous révèle que notre foi n'est pas vaine : le Christ est vraiment ressuscité. Cette vérité transforme notre vision de la mort et donne un sens à notre existence. Nous sommes appelés à vivre dès maintenant en ressuscités, porteurs d'espérance pour le monde.`
  }
  if (contenu.includes("sagesse") || contenu.includes("folie")) {
    return `Paul oppose la sagesse de Dieu à la sagesse du monde. "${titre}" nous révèle que la croix, folie pour les hommes, est sagesse de Dieu. Cette parole nous invite à changer nos critères de jugement : ce qui compte aux yeux de Dieu n'est pas toujours ce qui impressionne les hommes. La vraie sagesse consiste à accueillir l'amour de Dieu révélé en Jésus-Christ.`
  }
  if (contenu.includes("oui") && contenu.includes("non")) {
    return `Paul nous parle de la fidélité de Dieu et de notre réponse de foi. "${titre}" nous révèle que le Christ est le "oui" définitif de Dieu à l'humanité. Toutes les promesses de Dieu trouvent leur accomplissement en lui. Nous sommes invités à répondre par notre propre "oui" dans la foi, marqués par l'Esprit Saint qui nous fortifie dans notre engagement chrétien.`
  }
  if (contenu.includes("réconciliation")) {
    return `Paul nous révèle notre mission de réconciliation. "${titre}" nous montre que Dieu nous a réconciliés avec lui par le Christ et nous confie le ministère de la réconciliation. Nous sommes appelés à être des artisans de paix, des ponts entre Dieu et les hommes, entre les hommes eux-mêmes. Cette mission nous engage dans notre famille, notre travail, notre société.`
  }
  return `Saint Paul nous guide dans la vie chrétienne avec sagesse et tendresse. "${titre}" nous invite à approfondir notre foi et notre engagement. Cette lettre aux Corinthiens résonne encore aujourd'hui et nous aide à vivre en vrais disciples du Christ.`
}

function analyzeGospel(evangile: any): string {
  if (!evangile) return "Pas d'évangile disponible pour ce jour."

  const ref = evangile.ref
  const titre = evangile.titre || ""
  const contenu = evangile.contenu || ""

  // Analyse selon l'évangéliste
  if (ref.includes("Mt")) {
    return analyzeMatthew(titre, contenu, ref)
  } else if (ref.includes("Mc")) {
    return analyzeMark(titre, contenu, ref)
  } else if (ref.includes("Lc")) {
    return analyzeLuke(titre, contenu, ref)
  } else if (ref.includes("Jn")) {
    return analyzeJohnGospel(titre, contenu, ref)
  }

  return analyzeGenericGospel(titre, contenu, ref)
}

function analyzeMatthew(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("sel") && contenu.includes("lumière")) {
    return `Jésus nous révèle notre vocation profonde : être sel de la terre et lumière du monde. "${titre}" n'est pas un compliment mais un appel exigeant. Être sel, c'est donner du goût à la vie, préserver ce qui est bon, révéler la saveur de l'amour de Dieu. Être lumière, c'est éclairer les ténèbres par notre témoignage. Cette mission concerne tout baptisé : dans notre famille, notre travail, notre quartier, nous sommes appelés à être des signes de l'amour de Dieu.`
  }
  if (contenu.includes("Béatitudes") || contenu.includes("heureux")) {
    return `Les Béatitudes sont la charte du Royaume de Dieu. "${titre}" nous révèle le chemin du bonheur selon Jésus, si différent de celui que propose le monde. Être pauvre de cœur, miséricordieux, artisan de paix... voilà ce qui rend vraiment heureux. Ces paroles bouleversent nos valeurs et nous invitent à une conversion du cœur pour accueillir le Royaume.`
  }
  if (contenu.includes("Notre Père") || contenu.includes("priez")) {
    return `Jésus nous enseigne à prier comme des enfants de Dieu. "${titre}" nous révèle l'intimité filiale que nous pouvons avoir avec le Père. Cette prière résume tout l'Évangile : reconnaissance de la sainteté de Dieu, désir de son Règne, confiance pour nos besoins, pardon mutuel. Chaque demande nous engage dans une manière de vivre selon l'Évangile.`
  }
  if (contenu.includes("jugement") || contenu.includes("paille") || contenu.includes("poutre")) {
    return `Jésus nous met en garde contre l'esprit de jugement. "${titre}" nous invite à la miséricorde et à l'humilité. Avant de critiquer les autres, regardons-nous dans la vérité. Cette parole nous libère de l'orgueil et nous ouvre à la compassion. Elle nous apprend à corriger avec amour et à nous laisser corriger avec humilité.`
  }
  if (contenu.includes("parabole")) {
    return `À travers cette parabole, Jésus nous révèle les mystères du Royaume. "${titre}" nous invite à découvrir Dieu dans les réalités simples de la vie. Les paraboles nous parlent avec des images familières pour nous faire comprendre des vérités profondes sur l'amour de Dieu et notre vocation chrétienne.`
  }
  if (contenu.includes("Pierre") && contenu.includes("rocher")) {
    return `Jésus confie à Pierre une mission unique dans l'Église. "${titre}" nous révèle que l'Église est bâtie sur le roc de la foi en Jésus, Fils du Dieu vivant. Cette confession de foi de Pierre est aussi la nôtre. Nous sommes tous appelés à être des pierres vivantes de cette Église que les forces du mal ne peuvent détruire.`
  }
  if (contenu.includes("transfiguration") || (contenu.includes("montagne") && contenu.includes("gloire"))) {
    return `Sur la montagne, Jésus révèle sa gloire divine aux disciples. "${titre}" nous montre que Jésus est vraiment le Fils bien-aimé du Père. Cette vision fortifie notre foi et nous prépare à affronter les épreuves. Comme les disciples, nous sommes invités à contempler le Christ pour être transformés par sa lumière.`
  }
  return `Saint Matthieu nous transmet les paroles et les gestes de Jésus avec précision. "${titre}" nous invite à accueillir l'enseignement du Christ et à le mettre en pratique. Cet évangile nous guide sur le chemin du Royaume et nous apprend à vivre en vrais disciples.`
}

function analyzeMark(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("aussitôt") || contenu.includes("immédiatement")) {
    return `Marc nous présente un Jésus toujours en mouvement, pressé d'annoncer la Bonne Nouvelle. "${titre}" nous montre l'urgence de la mission du Christ. Cette dynamique nous interpelle : sommes-nous aussi empressés de témoigner de notre foi ? L'Évangile ne peut attendre, il demande une réponse immédiate de notre part.`
  }
  if (contenu.includes("guérison") || contenu.includes("miracle")) {
    return `Jésus manifeste sa puissance divine par ses guérisons. "${titre}" nous révèle que le Christ est venu libérer l'humanité de tout ce qui l'opprime. Ces miracles sont des signes du Royaume qui vient. Ils nous invitent à croire que Jésus peut aussi guérir nos blessures intérieures et nous libérer de nos esclavages.`
  }
  if (contenu.includes("disciples") && contenu.includes("suivre")) {
    return `Jésus appelle ses disciples à le suivre sans condition. "${titre}" nous montre que la vocation chrétienne demande un engagement total. Comme les premiers disciples, nous sommes invités à tout quitter pour suivre le Christ. Cet appel résonne encore aujourd'hui dans nos vies : que sommes-nous prêts à laisser pour suivre Jésus ?`
  }
  if (contenu.includes("croix") || contenu.includes("souffrir")) {
    return `Jésus annonce sa passion et nous invite à porter notre croix. "${titre}" nous révèle que le chemin du disciple passe par la croix. Cette parole difficile nous apprend que l'amour véritable implique parfois le sacrifice. Porter sa croix, c'est accepter les difficultés de la vie en union avec le Christ.`
  }
  if (contenu.includes("résurrection") || contenu.includes("ressuscité")) {
    return `La résurrection du Christ est le cœur de notre foi. "${titre}" nous annonce la victoire de la vie sur la mort. Cette Bonne Nouvelle transforme notre existence : nous ne sommes plus esclaves de la mort mais héritiers de la vie éternelle. Cette espérance donne un sens nouveau à toute notre vie.`
  }
  return `Saint Marc nous présente Jésus dans son humanité et sa divinité. "${titre}" nous invite à reconnaître en Jésus le Fils de Dieu qui vient nous sauver. Cet évangile nous appelle à une foi simple et confiante en celui qui a donné sa vie pour nous.`
}

function analyzeLuke(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("miséricorde") || contenu.includes("pardon")) {
    return `Luc nous révèle le visage miséricordieux de Jésus. "${titre}" nous montre que Dieu est riche en miséricorde et lent à la colère. Cette parole nous invite à accueillir le pardon de Dieu et à pardonner à notre tour. La miséricorde divine nous transforme et nous rend capables d'aimer comme Dieu aime.`
  }
  if (contenu.includes("pauvre") || contenu.includes("riches")) {
    return `Luc nous sensibilise à la question sociale et à l'amour préférentiel de Dieu pour les pauvres. "${titre}" nous interpelle sur notre rapport aux biens matériels et notre solidarité avec les plus démunis. Jésus nous invite à un partage généreux et à une simplicité de vie qui libère le cœur.`
  }
  if (contenu.includes("femme") || contenu.includes("Marie")) {
    return `Luc accorde une place importante aux femmes dans son évangile. "${titre}" nous montre que Jésus révolutionne les mentalités de son époque en accueillant et en valorisant les femmes. Cette attitude nous invite à reconnaître la dignité égale de tous et à lutter contre toute forme de discrimination.`
  }
  if (contenu.includes("joie") || contenu.includes("réjouir")) {
    return `La joie est une caractéristique de l'évangile de Luc. "${titre}" nous annonce que l'Évangile est une source de joie profonde. Cette joie ne dépend pas des circonstances extérieures mais de notre relation avec Dieu. Elle nous est donnée par l'Esprit Saint et devient contagieuse pour notre entourage.`
  }
  if (contenu.includes("prière") || contenu.includes("prier")) {
    return `Luc nous présente Jésus en prière dans les moments importants de sa vie. "${titre}" nous enseigne l'importance de la prière dans la vie chrétienne. Comme Jésus, nous sommes invités à nous retirer régulièrement pour prier et puiser dans cette intimité avec le Père la force pour notre mission.`
  }
  if (contenu.includes("Esprit Saint") || contenu.includes("Esprit")) {
    return `Luc souligne l'action de l'Esprit Saint dans la vie de Jésus et de l'Église. "${titre}" nous révèle que l'Esprit guide et fortifie les disciples. Nous aussi, nous sommes habités par cet Esprit qui nous donne la force de témoigner et nous conduit vers la vérité tout entière.`
  }
  return `Saint Luc nous présente Jésus comme le Sauveur de tous les hommes. "${titre}" nous invite à accueillir cette Bonne Nouvelle qui transforme nos vies. Cet évangile nous apprend la tendresse de Dieu et nous encourage à vivre dans la joie et l'espérance.`
}

function analyzeJohnGospel(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("lumière") || contenu.includes("ténèbres")) {
    return `Jean nous présente Jésus comme la Lumière du monde. "${titre}" nous révèle que le Christ éclaire tout homme qui vient en ce monde. Cette lumière dissipe les ténèbres du péché et de la mort. Nous sommes invités à marcher dans cette lumière et à en témoigner par notre vie.`
  }
  if (contenu.includes("vie éternelle") || contenu.includes("vie")) {
    return `Jean nous révèle que Jésus est venu nous donner la vie en abondance. "${titre}" nous montre que la vie éternelle commence dès maintenant pour celui qui croit. Cette vie nouvelle transforme notre existence et nous fait participer à la vie même de Dieu. C'est le plus beau cadeau que Dieu puisse nous faire.`
  }
  if (contenu.includes("amour") || contenu.includes("aimer")) {
    return `L'évangile de Jean est l'évangile de l'amour par excellence. "${titre}" nous révèle que Dieu est amour et qu'il nous a aimés le premier. Cet amour nous transforme et nous rend capables d'aimer à notre tour. Le commandement nouveau de Jésus - "Aimez-vous les uns les autres" - devient possible grâce à l'amour de Dieu répandu en nos cœurs.`
  }
  if (contenu.includes("Je suis")) {
    return `Jésus se révèle par ces paroles solennelles "Je suis". "${titre}" nous dévoile l'identité divine du Christ. Ces révélations nous invitent à approfondir notre foi en Jésus, vrai Dieu et vrai homme. Chaque "Je suis" nous révèle un aspect de l'amour de Dieu pour nous.`
  }
  if (contenu.includes("Père") && contenu.includes("Fils")) {
    return `Jean nous fait entrer dans l'intimité de la relation entre le Père et le Fils. "${titre}" nous révèle le mystère de la Trinité et notre adoption filiale. Nous sommes appelés à vivre comme des enfants bien-aimés du Père, à l'image de Jésus, le Fils unique.`
  }
  if (contenu.includes("signe") || contenu.includes("miracle")) {
    return `Jean appelle les miracles de Jésus des "signes" qui révèlent sa gloire. "${titre}" nous invite à voir au-delà du prodige pour découvrir qui est vraiment Jésus. Ces signes fortifient notre foi et nous préparent à croire sans voir, comme Jésus le demande à Thomas.`
  }
  if (contenu.includes("vérité")) {
    return `Jésus se présente comme la Vérité qui libère. "${titre}" nous révèle que la vérité n'est pas d'abord une doctrine mais une personne : Jésus lui-même. Cette vérité nous libère de nos illusions et nous fait entrer dans la réalité de l'amour de Dieu. Connaître cette vérité, c'est connaître Jésus.`
  }
  return `Saint Jean nous fait entrer dans les profondeurs du mystère du Christ. "${titre}" nous invite à contempler Jésus, Verbe fait chair, qui nous révèle l'amour du Père. Cet évangile nourrit notre foi et notre amour pour celui qui a donné sa vie pour nous.`
}

function analyzePsalm(psaume: any): string {
  if (!psaume) return "Pas de psaume disponible pour ce jour."

  const ref = psaume.ref
  const refrain = psaume.refrain_psalmique || ""
  const contenu = psaume.contenu || ""

  // Analyse selon le numéro du psaume
  const psalmNumber = ref.match(/\d+/)?.[0]

  if (psalmNumber) {
    const num = Number.parseInt(psalmNumber)

    if (num === 23 || num === 22) {
      return `Le psaume 23 est l'un des plus beaux chants de confiance de la Bible. "${refrain.replace(/<[^>]*>/g, "")}" exprime notre abandon total entre les mains de Dieu. Comme un berger prend soin de ses brebis, Dieu veille sur nous avec tendresse. Ce psaume nous apprend à faire confiance même dans les moments difficiles, car nous savons que Dieu marche avec nous.`
    }

    if (num >= 120 && num <= 134) {
      return `Ce psaume fait partie des "cantiques des montées" que chantaient les pèlerins en montant à Jérusalem. "${refrain.replace(/<[^>]*>/g, "")}" exprime notre désir de Dieu et notre joie de nous rassembler pour la prière. Comme ces pèlerins d'autrefois, nous sommes en marche vers Dieu, et chaque eucharistie est une étape de ce pèlerinage vers la Jérusalem céleste.`
    }

    if (num >= 1 && num <= 10) {
      return `Ce psaume nous enseigne les fondements de la vie spirituelle. "${refrain.replace(/<[^>]*>/g, "")}" nous guide sur le chemin de la sagesse. Les premiers psaumes nous montrent la différence entre le juste et l'impie, entre celui qui met sa confiance en Dieu et celui qui s'appuie sur ses propres forces. Ils nous invitent à méditer la Parole de Dieu jour et nuit.`
    }
  }

  // Analyse thématique du contenu
  if (contenu.includes("louange") || contenu.includes("gloire") || contenu.includes("alléluia")) {
    return `Ce psaume de louange nous invite à célébrer la grandeur de Dieu. "${refrain.replace(/<[^>]*>/g, "")}" exprime notre joie de croire et notre reconnaissance pour les bienfaits du Seigneur. La louange élève notre cœur vers Dieu et nous fait participer à la joie du ciel. Elle transforme notre regard sur la vie et nous aide à voir la main de Dieu dans tous les événements.`
  }

  if (contenu.includes("pardon") || contenu.includes("péché") || contenu.includes("miséricorde")) {
    return `Ce psaume pénitentiel exprime notre besoin de pardon et notre confiance en la miséricorde de Dieu. "${refrain.replace(/<[^>]*>/g, "")}" nous apprend à reconnaître nos fautes avec humilité et à espérer en la bonté divine. Ces prières nous aident à nous réconcilier avec Dieu et avec nous-mêmes, dans la vérité et l'espérance.`
  }

  if (contenu.includes("confiance") || contenu.includes("espoir") || contenu.includes("refuge")) {
    return `Ce psaume de confiance nous apprend à nous abandonner entre les mains de Dieu. "${refrain.replace(/<[^>]*>/g, "")}" exprime notre foi en celui qui ne nous abandonne jamais. Dans les moments d'épreuve comme dans la joie, nous pouvons nous appuyer sur Dieu qui est notre roc et notre refuge. Cette confiance nous donne la paix du cœur.`
  }

  if (contenu.includes("justice") || contenu.includes("droit") || contenu.includes("opprimé")) {
    return `Ce psaume nous sensibilise à la justice de Dieu et à notre responsabilité envers les plus faibles. "${refrain.replace(/<[^>]*>/g, "")}" nous rappelle que Dieu prend la défense des opprimés et des pauvres. Nous sommes invités à être des instruments de cette justice divine dans notre monde, en défendant la dignité de chaque personne.`
  }

  if (contenu.includes("création") || contenu.includes("cieux") || contenu.includes("terre")) {
    return `Ce psaume de création nous invite à contempler les merveilles de Dieu. "${refrain.replace(/<[^>]*>/g, "")}" exprime notre émerveillement devant l'œuvre du Créateur. La nature entière chante la gloire de Dieu et nous invite à la louange. Cette contemplation nous rend responsables de la sauvegarde de la création que Dieu nous a confiée.`
  }

  return `Ce psaume nous enseigne à prier avec les mots mêmes que Jésus a utilisés. "${refrain.replace(/<[^>]*>/g, "")}" guide notre prière et unit notre voix à celle de toute l'Église. Les psaumes sont l'école de prière par excellence, où nous apprenons à exprimer tous nos sentiments devant Dieu : joie, peine, reconnaissance, supplication.`
}

function generateContextualHomily(lectures: any[], info: any): string {
  const evangile = lectures.find((l: any) => l.type === "evangile")
  const premiere_lecture = lectures.find((l: any) => l.type === "lecture_1")

  if (!evangile) {
    return `En ce ${info.ligne1}, la Parole de Dieu nous invite à approfondir notre foi et notre engagement. Que cette journée soit l'occasion de vivre pleinement notre vocation chrétienne, dans la simplicité et la joie de l'Évangile. Demandons au Seigneur la grâce d'être des témoins authentiques de son amour.`
  }

  const ref_evangile = evangile.ref
  const titre_evangile = evangile.titre || ""
  const contenu_evangile = evangile.contenu || ""

  // Homélie contextuelle selon l'évangile du jour
  if (contenu_evangile.includes("sel") && contenu_evangile.includes("lumière")) {
    return `"Vous êtes le sel de la terre, vous êtes la lumière du monde." Ces paroles de Jésus ne sont pas un compliment, mais un appel exigeant. En ce ${info.ligne1}, le Seigneur nous rappelle notre mission : donner du goût à la vie par notre témoignage, éclairer les ténèbres par notre espérance. Être sel, c'est préserver ce qui est bon autour de nous. Être lumière, c'est révéler l'amour de Dieu par nos actes. Aujourd'hui, demandons-nous concrètement : comment puis-je être sel et lumière dans ma famille, mon travail, ma communauté ? Notre foi n'est pas un trésor à garder jalousement, mais un feu à partager pour réchauffer le monde.`
  }

  if (contenu_evangile.includes("Béatitudes") || contenu_evangile.includes("heureux")) {
    return `Les Béatitudes que nous venons d'entendre bouleversent nos critères de bonheur. En ce ${info.ligne1}, Jésus nous révèle le chemin du vrai bonheur : être pauvre de cœur, miséricordieux, artisan de paix. Ces paroles contredisent souvent ce que le monde nous propose comme recettes du bonheur. Mais Jésus nous assure que c'est là le chemin du Royaume. Chaque béatitude est un programme de vie qui nous transforme peu à peu à l'image du Christ. Demandons aujourd'hui la grâce de vivre une de ces béatitudes de manière plus concrète dans notre quotidien.`
  }

  if (contenu_evangile.includes("amour") && contenu_evangile.includes("ennemis")) {
    return `"Aimez vos ennemis" : cette parole de Jésus est peut-être l'une des plus difficiles de l'Évangile. En ce ${info.ligne1}, le Seigneur nous invite à dépasser la logique humaine de la vengeance pour entrer dans la logique divine du pardon. Aimer ses ennemis ne signifie pas être naïf ou accepter l'injustice, mais refuser que la haine empoisonne notre cœur. C'est choisir de voir en chaque personne, même hostile, un enfant de Dieu capable de conversion. Cette parole nous libère de l'amertume et nous rend semblables au Père qui fait lever son soleil sur les bons et les méchants.`
  }

  if (contenu_evangile.includes("pardon") || contenu_evangile.includes("péché")) {
    return `Le pardon est au cœur de l'Évangile que nous venons d'entendre. En ce ${info.ligne1}, Jésus nous révèle la miséricorde infinie de Dieu et nous invite à pardonner à notre tour. Pardonner ne signifie pas oublier ou excuser, mais libérer notre cœur du poison de la rancune. C'est un acte de foi en la possibilité de conversion de l'autre et en la puissance transformatrice de l'amour. Quand nous pardonnons, nous participons à l'œuvre de réconciliation du Christ et nous ouvrons un chemin de paix. Demandons aujourd'hui la grâce de pardonner là où c'est difficile.`
  }

  if (contenu_evangile.includes("prière") || contenu_evangile.includes("Notre Père")) {
    return `Jésus nous enseigne à prier en ce ${info.ligne1}. La prière n'est pas d'abord une technique mais une relation filiale avec Dieu notre Père. Quand nous disons "Notre Père", nous reconnaissons que nous sommes tous frères et sœurs, enfants du même Père. Cette prière résume tout l'Évangile : elle nous apprend à sanctifier le nom de Dieu par notre vie, à désirer son Règne, à lui faire confiance pour nos besoins, à pardonner et à demander pardon. Chaque fois que nous récitons le Notre Père, nous nous engageons à vivre selon l'Évangile.`
  }

  if (contenu_evangile.includes("parabole")) {
    return `À travers cette parabole, Jésus nous fait découvrir les mystères du Royaume en ce ${info.ligne1}. Les paraboles utilisent des images simples de la vie quotidienne pour nous révéler des vérités profondes sur Dieu et sur nous-mêmes. Elles nous invitent à changer notre regard, à voir avec les yeux de la foi. Cette parabole nous interpelle personnellement : où en suis-je dans ma relation avec Dieu ? Comment est-ce que j'accueille sa Parole ? Laissons cette image parlante résonner en nous et transformer notre cœur.`
  }

  // Homélie générique adaptée au temps liturgique
  if (info.temps_liturgique === "ordinaire") {
    return `En ce ${info.ligne1}, la Parole de Dieu nous invite à grandir dans la sainteté du quotidien. "${titre_evangile}" nous montre le chemin pour vivre en vrais disciples du Christ. Le temps ordinaire nous rappelle que la sainteté se vit dans l'ordinaire de nos jours, nourrie par la Parole et l'Eucharistie. Que cette journée soit l'occasion de poser des gestes concrets d'amour et de service, à l'image du Christ qui a donné sa vie pour nous.`
  }

  return `L'Évangile de ce ${info.ligne1} nous interpelle sur notre manière de suivre le Christ. "${titre_evangile}" nous invite à approfondir notre foi et notre engagement. Que cette Parole transforme notre cœur et nous donne la force d'être des témoins authentiques de l'amour de Dieu dans notre monde qui a soif d'espérance et de vérité.`
}

function generateContextualUniversalPrayer(
  lectures: any[],
  info: any,
): {
  introduction: string
  intentions: string[]
  conclusion: string
} {
  const evangile = lectures.find((l: any) => l.type === "evangile")
  const premiere_lecture = lectures.find((l: any) => l.type === "lecture_1")

  const intentions = [
    "Pour l'Église universelle et notre pape François, afin qu'elle soit toujours fidèle à sa mission d'évangélisation et témoin de l'amour du Christ dans le monde, prions le Seigneur.",
    "Pour tous les dirigeants du monde, afin qu'ils œuvrent pour la justice, la paix et le respect de la dignité humaine, particulièrement pour les plus vulnérables, prions le Seigneur.",
    "Pour ceux qui souffrent dans leur corps ou leur cœur, pour les malades, les personnes âgées, et tous ceux qui traversent des épreuves, afin qu'ils trouvent réconfort et espérance, prions le Seigneur.",
  ]

  // Intentions adaptées selon l'évangile
  if (evangile?.contenu.includes("sel") && evangile?.contenu.includes("lumière")) {
    intentions.push(
      "Pour notre communauté paroissiale et nos familles, afin que nous sachions être sel de la terre et lumière du monde par notre témoignage de foi et de charité, prions le Seigneur.",
    )
  } else if (evangile?.contenu.includes("amour") && evangile?.contenu.includes("ennemis")) {
    intentions.push(
      "Pour tous ceux qui vivent dans la haine et la violence, afin qu'ils découvrent la force libératrice du pardon et de l'amour, prions le Seigneur.",
    )
  } else if (evangile?.contenu.includes("pardon")) {
    intentions.push(
      "Pour toutes les familles et communautés blessées par les conflits, afin qu'elles trouvent le chemin de la réconciliation et de la paix, prions le Seigneur.",
    )
  } else if (evangile?.contenu.includes("pauvre") || evangile?.contenu.includes("Béatitudes")) {
    intentions.push(
      "Pour les pauvres, les exclus et tous ceux qui souffrent d'injustice, afin que nous sachions partager et construire un monde plus fraternel, prions le Seigneur.",
    )
  } else {
    intentions.push(
      "Pour notre communauté paroissiale et nos familles, afin que nous vivions toujours plus selon l'Évangile et témoignions de la joie de croire, prions le Seigneur.",
    )
  }

  intentions.push(
    "Pour nos défunts et particulièrement ceux qui nous ont quittés récemment, afin qu'ils reposent dans la paix du Christ ressuscité, prions le Seigneur.",
  )

  return {
    introduction: `Frères et sœurs, forts de la Parole que nous venons d'entendre en ce ${info.ligne1}, présentons au Seigneur nos prières pour l'Église et pour le monde :`,
    intentions,
    conclusion: `Dieu notre Père, écoute nos prières et accorde-nous la grâce de vivre selon ta volonté. Par Jésus, le Christ, notre Seigneur. Amen.`,
  }
}

// Fonctions d'analyse pour les autres livres bibliques
function analyzeIsaiah(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("consolez") || contenu.includes("consolation")) {
    return `Le prophète Isaïe nous transmet la consolation de Dieu pour son peuple. "${titre}" nous révèle que Dieu n'abandonne jamais ceux qui souffrent. Cette parole de réconfort résonne encore aujourd'hui pour tous ceux qui traversent des épreuves. Dieu nous console non seulement pour notre bien-être, mais pour que nous puissions consoler à notre tour ceux qui souffrent.`
  }
  if (contenu.includes("serviteur") || contenu.includes("souffrant")) {
    return `Isaïe nous présente la figure mystérieuse du Serviteur souffrant, que nous reconnaissons en Jésus. "${titre}" nous révèle que la souffrance peut devenir source de salut quand elle est unie à celle du Christ. Cette prophétie nous aide à comprendre le sens de la croix et nous invite à offrir nos propres souffrances pour le salut du monde.`
  }
  if (contenu.includes("lumière") || contenu.includes("ténèbres")) {
    return `Isaïe annonce la venue de la lumière qui dissipera les ténèbres. "${titre}" nous révèle l'espérance qui habite le cœur de Dieu pour l'humanité. Cette lumière, c'est le Christ qui vient éclairer notre monde. Nous sommes invités à être des porteurs de cette lumière dans les ténèbres de notre époque.`
  }
  return `Le prophète Isaïe nous transmet la parole de Dieu avec force et beauté. "${titre}" nous invite à accueillir l'espérance que Dieu offre à son peuple. Cette prophétie nous prépare à reconnaître l'action de Dieu dans notre histoire et à espérer en ses promesses.`
}

function analyzeRomans(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("justification") || contenu.includes("foi")) {
    return `Paul nous enseigne le cœur de l'Évangile : nous sommes justifiés par la foi et non par nos œuvres. "${titre}" nous libère de l'angoisse de devoir mériter notre salut. C'est un don gratuit de Dieu que nous accueillons dans la foi. Cette vérité transforme notre relation à Dieu et nous donne une paix profonde.`
  }
  if (contenu.includes("péché") || contenu.includes("grâce")) {
    return `Paul nous révèle la puissance de la grâce qui surabonde là où le péché a abondé. "${titre}" nous montre que rien ne peut nous séparer de l'amour de Dieu. Même nos fautes les plus graves peuvent devenir occasions de découvrir la miséricorde divine. Cette espérance nous relève et nous encourage à recommencer.`
  }
  if (contenu.includes("Esprit") || contenu.includes("chair")) {
    return `Paul nous enseigne le combat spirituel entre la chair et l'Esprit. "${titre}" nous aide à comprendre nos contradictions intérieures et nous montre le chemin de la liberté. L'Esprit Saint nous donne la force de vivre selon Dieu et de résister aux tentations qui nous éloignent de lui.`
  }
  return `Saint Paul nous guide avec sagesse sur le chemin de la foi. "${titre}" nous aide à approfondir notre compréhension de l'Évangile et à vivre en vrais chrétiens. Cette lettre aux Romains reste un trésor de sagesse spirituelle pour notre vie de foi.`
}

function analyzeGenericReading(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("alliance") || contenu.includes("promesse")) {
    return `Cette lecture nous révèle la fidélité de Dieu à ses promesses. "${titre}" nous montre que Dieu tient toujours ses engagements envers son peuple. Cette alliance nous invite à la confiance et à la fidélité dans notre propre relation avec Dieu.`
  }
  if (contenu.includes("conversion") || contenu.includes("retour")) {
    return `Cette parole nous appelle à la conversion du cœur. "${titre}" nous invite à revenir vers Dieu avec sincérité. La conversion n'est pas seulement un moment ponctuel mais un chemin de toute la vie, où nous nous laissons transformer par l'amour de Dieu.`
  }
  if (contenu.includes("espérance") || contenu.includes("avenir")) {
    return `Cette lecture nourrit notre espérance en l'avenir que Dieu prépare. "${titre}" nous rappelle que notre destinée est entre les mains de Dieu qui veut notre bonheur. Cette espérance nous donne la force d'affronter les difficultés du présent.`
  }
  return `Cette lecture nous invite à approfondir notre relation avec Dieu. "${titre}" nous rappelle l'importance de la foi dans notre vie quotidienne. Que cette Parole nourrisse notre prière et guide nos actions, afin que nous puissions témoigner de l'amour du Christ dans notre monde.`
}

function analyzeGenericGospel(titre: string, contenu: string, ref: string): string {
  if (contenu.includes("royaume") || contenu.includes("Royaume")) {
    return `Jésus nous révèle les mystères du Royaume de Dieu. "${titre}" nous invite à découvrir ce Royaume qui est déjà présent parmi nous mais pas encore pleinement réalisé. Nous sommes appelés à être des artisans de ce Royaume par notre témoignage de foi, d'espérance et de charité.`
  }
  if (contenu.includes("disciples") || contenu.includes("suivre")) {
    return `Jésus nous appelle à être ses disciples. "${titre}" nous montre les exigences et la joie de suivre le Christ. Être disciple, c'est apprendre de Jésus, l'imiter et témoigner de son amour. Cette vocation nous engage toute notre vie.`
  }
  return `Cet évangile nous révèle le cœur de Jésus et son message d'amour. "${titre}" nous interpelle sur notre manière de vivre en disciples. Que cette parole du Christ transforme notre regard sur le monde et nous donne la force d'être des témoins authentiques de son amour dans notre quotidien.`
}

// Fonctions pour les autres livres (versions simplifiées)
function analyzeSamuel(titre: string, contenu: string, ref: string): string {
  return `Les livres de Samuel nous racontent l'histoire du peuple de Dieu et de ses rois. "${titre}" nous montre comment Dieu guide son peuple à travers l'histoire. Ces récits nous enseignent que Dieu choisit souvent les plus petits pour accomplir de grandes choses, comme il l'a fait avec David.`
}

function analyzeKings(titre: string, contenu: string, ref: string): string {
  return `Les livres des Rois nous enseignent les conséquences de la fidélité ou de l'infidélité à Dieu. "${titre}" nous montre l'importance de rester attachés au Seigneur. Ces récits nous invitent à examiner notre propre fidélité et à revenir vers Dieu quand nous nous sommes égarés.`
}

function analyzeJeremiah(titre: string, contenu: string, ref: string): string {
  return `Le prophète Jérémie nous transmet un message de conversion et d'espérance. "${titre}" nous appelle à un retour sincère vers Dieu. Jérémie nous enseigne que même dans les moments les plus sombres, Dieu reste fidèle et prépare un avenir de paix pour son peuple.`
}

function analyzeEzekiel(titre: string, contenu: string, ref: string): string {
  return `Ézéchiel nous révèle la sainteté de Dieu et son désir de renouveler son peuple. "${titre}" nous montre que Dieu peut transformer nos cœurs de pierre en cœurs de chair. Cette promesse nous donne l'espérance d'une conversion profonde et d'une vie nouvelle.`
}

function analyzeGalatians(titre: string, contenu: string, ref: string): string {
  return `Paul nous enseigne la liberté chrétienne dans sa lettre aux Galates. "${titre}" nous libère de l'esclavage de la loi pour nous faire entrer dans la liberté des enfants de Dieu. Cette liberté nous responsabilise : nous sommes libres pour aimer et servir.`
}

function analyzeEphesians(titre: string, contenu: string, ref: string): string {
  return `Paul nous révèle le mystère du Christ et de l'Église. "${titre}" nous montre notre vocation à vivre dans l'unité et l'amour. Cette lettre nous enseigne que nous sommes appelés à former un seul corps dans le Christ, au-delà de nos différences.`
}

function analyzePhilippians(titre: string, contenu: string, ref: string): string {
  return `La lettre aux Philippiens respire la joie et l'affection de Paul pour cette communauté. "${titre}" nous invite à vivre dans la joie du Seigneur malgré les épreuves. Paul nous enseigne que la vraie joie vient de notre union au Christ.`
}

function analyzeColossians(titre: string, contenu: string, ref: string): string {
  return `Paul nous révèle la primauté du Christ sur toute la création. "${titre}" nous montre que le Christ est le centre de tout. Cette vérité transforme notre vision du monde et nous invite à tout rapporter au Christ dans notre vie.`
}

function analyzeThessalonians(titre: string, contenu: string, ref: string): string {
  return `Paul encourage les Thessaloniciens dans leur foi et leur espérance. "${titre}" nous enseigne à vivre dans l'attente du retour du Christ. Cette espérance donne un sens à notre vie présente et nous encourage à persévérer dans le bien.`
}

function analyzeTimothy(titre: string, contenu: string, ref: string): string {
  return `Paul donne ses conseils pastoraux à Timothée. "${titre}" nous enseigne comment vivre et transmettre la foi. Ces lettres nous montrent l'importance de la formation chrétienne et du témoignage dans la transmission de l'Évangile.`
}

function analyzeHebrews(titre: string, contenu: string, ref: string): string {
  return `La lettre aux Hébreux nous révèle la supériorité du Christ sur l'ancienne alliance. "${titre}" nous montre que Jésus est le grand prêtre parfait qui nous donne accès au Père. Cette lettre nous encourage à persévérer dans la foi malgré les difficultés.`
}

function analyzeJames(titre: string, contenu: string, ref: string): string {
  return `Jacques nous enseigne la sagesse pratique de la vie chrétienne. "${titre}" nous montre que la foi doit se traduire en actes. Cette lettre nous rappelle que nous ne pouvons pas séparer l'amour de Dieu et l'amour du prochain.`
}

function analyzePeter(titre: string, contenu: string, ref: string): string {
  return `Pierre nous encourage dans les épreuves et nous enseigne l'espérance chrétienne. "${titre}" nous montre comment vivre notre foi dans un monde hostile. Ces lettres nous rappellent notre vocation à être des témoins du Christ ressuscité.`
}

function analyzeJohn(titre: string, contenu: string, ref: string): string {
  return `Jean nous révèle l'amour de Dieu et notre vocation à aimer. "${titre}" nous montre que Dieu est amour et que nous sommes appelés à vivre dans cet amour. Ces lettres nous enseignent les critères de l'amour véritable.`
}

function analyzeRevelation(titre: string, contenu: string, ref: string): string {
  return `L'Apocalypse nous révèle l'espérance chrétienne et la victoire finale du Christ. "${titre}" nous encourage à persévérer dans la foi malgré les persécutions. Ce livre nous montre que l'histoire humaine a un sens et une fin : la victoire de l'amour sur le mal.`
}

function analyzeActs(titre: string, contenu: string, ref: string): string {
  return `Les Actes des Apôtres nous racontent les débuts de l'Église. "${titre}" nous montre comment l'Esprit Saint guide et fortifie les premiers chrétiens. Ce récit nous inspire pour notre propre mission d'évangélisation et nous enseigne l'importance de la communauté chrétienne.`
}

function generateSaintBiography(
  fete: string,
  date: Date,
): {
  nom: string
  biographie: string
  celebration: string
} {
  // Base de données enrichie des saints
  const saints: Record<string, any> = {
    "de la férie": {
      nom: "Jour de férie",
      biographie:
        "Aujourd'hui, nous célébrons un jour de férie, c'est-à-dire un jour ordinaire du calendrier liturgique. Ces jours nous rappellent que la sainteté se vit aussi dans l'ordinaire de nos vies. Chaque jour est une occasion de grandir dans l'amour de Dieu et du prochain. Les jours de férie nous invitent à sanctifier notre quotidien par la prière, le travail bien fait et les gestes de charité.",
      celebration:
        "Les jours de férie nous rappellent que tous les jours sont saints quand nous les vivons en union avec Dieu.",
    },
    "Saint Antoine de Padoue": {
      nom: "Saint Antoine de Padoue",
      biographie:
        "Saint Antoine (1195-1231) était un franciscain portugais devenu l'un des plus grands prédicateurs de son époque. Docteur de l'Église, il était surnommé 'l'arche du Testament' pour sa connaissance extraordinaire des Écritures. Il consacra sa vie à l'évangélisation et à la défense des pauvres. On l'invoque pour retrouver les objets perdus, mais surtout pour retrouver la foi quand elle s'affaiblit.",
      celebration: "Nous célébrons saint Antoine comme modèle de prédicateur et défenseur des pauvres.",
    },
    "Sainte Thérèse de l'Enfant-Jésus": {
      nom: "Sainte Thérèse de l'Enfant-Jésus",
      biographie:
        "Sainte Thérèse Martin (1873-1897) entra au Carmel de Lisieux à 15 ans. Elle découvrit la 'petite voie' de l'enfance spirituelle, faite de confiance et d'abandon à Dieu. Docteur de l'Église, elle nous enseigne que la sainteté est accessible à tous par l'amour et la simplicité. Elle promit de passer son ciel à faire du bien sur la terre.",
      celebration: "Nous célébrons sainte Thérèse comme patronne des missions et modèle de confiance en Dieu.",
    },
    "Saint Jean-Baptiste": {
      nom: "Saint Jean-Baptiste",
      biographie:
        "Jean-Baptiste, cousin de Jésus, fut le précurseur du Messie. Né de Zacharie et Élisabeth, il vécut dans le désert et prêcha la conversion en baptisant dans le Jourdain. Il eut l'honneur de baptiser Jésus et de le désigner comme 'l'Agneau de Dieu'. Il mourut martyr pour avoir dénoncé l'adultère du roi Hérode. Il est le modèle du témoin qui s'efface devant le Christ.",
      celebration: "Nous célébrons saint Jean-Baptiste comme le plus grand des prophètes et le précurseur du Christ.",
    },
  }

  // Génération contextuelle selon la date
  const month = date.getMonth() + 1
  const day = date.getDate()

  // Saints selon les dates importantes
  if (month === 6 && day === 13) {
    return saints["Saint Antoine de Padoue"]
  }
  if (month === 10 && day === 1) {
    return saints["Sainte Thérèse de l'Enfant-Jésus"]
  }
  if (month === 6 && day === 24) {
    return saints["Saint Jean-Baptiste"]
  }

  // Saint du jour selon la fête liturgique
  if (saints[fete]) {
    return saints[fete]
  }

  // Saint générique
  return {
    nom: fete || "Saint du jour",
    biographie: `Aujourd'hui, l'Église nous propose de nous inspirer de la vie des saints. ${fete ? `En célébrant ${fete}, nous` : "Nous"} découvrons un modèle de vie chrétienne qui a su répondre généreusement à l'appel de Dieu. Chaque saint a vécu sa vocation particulière avec fidélité, nous montrant qu'il existe mille manières de suivre le Christ. Leur exemple nous encourage et leur intercession nous soutient sur notre propre chemin de sainteté.`,
    celebration: `Que l'exemple ${fete ? `de ${fete}` : "des saints"} nous inspire à vivre notre foi avec générosité et persévérance.`,
  }
}

function getLiturgicalColorMeaning(couleur: string): string {
  const meanings: Record<string, string> = {
    vert: "Le vert symbolise l'espérance et la croissance spirituelle. C'est la couleur du Temps ordinaire, période où nous sommes invités à grandir dans la foi et à porter du fruit dans nos vies. Cette couleur nous rappelle que la vie chrétienne est un chemin de maturation constante, nourrie par la Parole et les sacrements.",
    rouge:
      "Le rouge évoque l'amour ardent, le sacrifice et l'Esprit Saint. Cette couleur est utilisée pour les fêtes des martyrs qui ont versé leur sang pour le Christ, la Pentecôte où l'Esprit descend comme des langues de feu, et les célébrations de la Passion. Elle nous rappelle que l'amour véritable peut aller jusqu'au don de sa vie.",
    blanc:
      "Le blanc représente la pureté, la joie et la gloire divine. C'est la couleur des grandes fêtes comme Noël et Pâques, des fêtes de la Vierge Marie et des saints non martyrs. Cette couleur exprime la joie de la résurrection et la beauté de la sainteté qui transfigure l'existence humaine.",
    violet:
      "Le violet symbolise la pénitence, la préparation et l'attente. C'est la couleur de l'Avent et du Carême, temps de conversion et de préparation spirituelle. Cette couleur nous invite au recueillement, à la prière et à la pénitence pour nous préparer aux grandes fêtes chrétiennes.",
    rose: "Le rose, utilisé au 3e dimanche de l'Avent (Gaudete) et au 4e dimanche de Carême (Laetare), exprime une joie tempérée dans l'attente et la pénitence. Cette couleur nous rappelle que même dans les temps de préparation, la joie chrétienne transparaît car nous savons que Dieu vient à notre rencontre.",
    noir: "Le noir, rarement utilisé aujourd'hui, évoquait le deuil et était porté pour les messes des défunts. Il a été largement remplacé par le violet ou le blanc pour exprimer l'espérance chrétienne face à la mort.",
  }

  return (
    meanings[couleur] ||
    "Cette couleur liturgique nous invite à entrer dans le mystère célébré aujourd'hui et à laisser notre cœur se conformer à l'esprit de la liturgie."
  )
}

function getLiturgicalSeasonDescription(temps: string, semaine: string): string {
  const descriptions: Record<string, string> = {
    ordinaire: `Le Temps ordinaire est le cœur de l'année liturgique. ${semaine} nous invite à approfondir notre vie chrétienne dans l'ordinaire de nos jours. C'est le temps de la croissance spirituelle, où nous sommes appelés à porter du fruit dans nos vies quotidiennes, nourris par la Parole de Dieu et les sacrements. Chaque dimanche nous fait grandir dans la connaissance et l'amour du Christ.`,
    avent:
      "L'Avent est un temps d'attente joyeuse et de préparation à la venue du Christ. Nous nous préparons à célébrer sa naissance à Noël tout en attendant son retour glorieux. Ce temps nous invite à la vigilance, à la conversion et à l'espérance. C'est un temps privilégié pour redécouvrir le sens de l'attente et de la préparation spirituelle.",
    carême:
      "Le Carême est un temps de conversion, de pénitence et de préparation à Pâques. Par la prière, le jeûne et l'aumône, nous nous préparons à revivre le mystère pascal. Ce temps nous invite à nous détacher de ce qui nous éloigne de Dieu pour nous rapprocher de lui et de nos frères. C'est un chemin de libération intérieure.",
    paques:
      "Le Temps pascal célèbre la résurrection du Christ, victoire sur la mort et le péché. C'est le cœur de notre foi chrétienne et la source de notre espérance. Pendant cinquante jours, nous célébrons cette Bonne Nouvelle qui transforme notre existence. Nous sommes invités à vivre en ressuscités, porteurs de vie nouvelle.",
    noel: "Le Temps de Noël célèbre l'Incarnation du Fils de Dieu. Dieu se fait homme pour que l'homme puisse participer à la vie divine. Cette fête nous révèle l'amour infini de Dieu qui vient partager notre condition humaine pour nous élever jusqu'à lui. C'est le mystère de l'Emmanuel, Dieu avec nous.",
  }

  return (
    descriptions[temps] ||
    "Ce temps liturgique nous invite à vivre pleinement le mystère du Christ selon l'esprit de l'Église. Chaque temps a sa grâce particulière qui nous aide à grandir dans la foi, l'espérance et la charité."
  )
}
