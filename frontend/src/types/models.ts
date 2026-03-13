export interface Site {
  id: number;
  code: string;
  nom: string;
}

export interface User {
  id: number;
  login: string;
  nom: string;
  prenom: string;
  email: string;
  typeAcces: "GLOBAL" | "RESTREINT";
  dateCreation: string;
  sites: Site[];
}

export interface UserPayload {
  nom: string;
  prenom: string;
  email: string;
  globalAccess: boolean;
  sites: number[];
}