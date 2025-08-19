export interface AelfLecture {
  type: string;
  titre: string;
  contenu: string;
  ref?: string;
  intro?: string;
  verset?: string;
  antienne?: string;
  repons?: string;
}

export interface AelfMesse {
  nom: string;
  lectures: AelfLecture[];
  jour_liturgique_nom: string;
}

export interface AelfInformations {
  ligne1: string;
  ligne2?: string;
  ligne3?: string;
  couleur: string;
  degre?: string;
  temps_liturgique?: string;
}

export interface AelfOffice {
  nom: string;
  office: {
    introduction?: AelfLecture;
    lectures?: AelfLecture[];
    cantique?: AelfLecture;
    psaumes?: AelfLecture[];
    pericopes?: AelfLecture[];
    conclusion?: AelfLecture;
  }
}

export interface AelfData {
  informations: AelfInformations;
  messes?: AelfMesse[];
  offices?: {
    [key: string]: AelfOffice;
  };
  date: string;
}
