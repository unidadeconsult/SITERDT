export type Category =
  | 'Brasileirão'
  | 'Libertadores'
  | 'Seleção'
  | 'Europa'
  | 'Copa do Brasil'
  | 'Crônica';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  text: string;
  likes: number;
  replies: Comment[];
}

export interface Article {
  id: string;
  title: string;
  dek: string;
  category: Category;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: number;
  image: string;
  featured?: boolean;
  body: string[];
  comments: Comment[];
}

export interface LiveMatch {
  id: string;
  competition: string;
  homeTeam: string;
  homeAbbr: string;
  awayTeam: string;
  awayAbbr: string;
  homeScore: number;
  awayScore: number;
  status: 'AO VIVO' | 'FIM' | 'HOJE';
  time: string;
  cards?: { team: 'home' | 'away'; type: 'yellow' | 'red' }[];
}

export interface HighlightVideo {
  id: string;
  videoId: string;
  title: string;
  competition: string;
  duration: string;
  thumbnail: string;
}

export type TransferStatus = 'Rumor' | 'Esquentou' | 'Confirmado';

export interface Transfer {
  id: string;
  player: string;
  fromClub: string;
  toClub: string;
  status: TransferStatus;
  probability: number;
  detail: string;
}

export interface OnThisDayFact {
  id: string;
  year: number;
  title: string;
  description: string;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

export interface FanPost {
  id: string;
  author: string;
  avatar: string;
  team: string;
  date: string;
  text: string;
  likes: number;
  replies: Comment[];
}

export type FormationKey = '4-3-3' | '4-4-2' | '4-2-3-1' | '3-5-2' | '5-3-2';

export interface PitchPosition {
  x: number;
  y: number;
  label: string;
}
