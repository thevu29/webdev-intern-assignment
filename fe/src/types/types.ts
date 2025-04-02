export interface Score {
  registrationNumber: string;
  toan: number;
  ngu_van: number;
  vat_li: number;
  hoa_hoc: number;
  sinh_hoc: number;
  lich_su: number;
  dia_li: number;
  ngoai_ngu: number;
  gdcd: number;
  ma_ngoai_ngu: string;
}

export interface ScoreResponse {
  success: boolean;
  score: Score | null;
  message?: string;
}

type SubjectKey =
  | "toan"
  | "ngu_van"
  | "vat_li"
  | "hoa_hoc"
  | "sinh_hoc"
  | "lich_su"
  | "dia_li"
  | "ngoai_ngu"
  | "gdcd";

export interface ScoreStatistic {
  subject: SubjectKey;
  greaterThanOrEqual8: number;
  from6To8: number;
  from4To6: number;
  lessThan4: number;
}

export interface StatisticsResponse {
  success: boolean;
  statistics: ScoreStatistic[];
  message?: string;
}

export interface BarChartData {
  name: string;
  data: number[];
}

export interface GroupAScore {
  registrationNumber: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  totalScore: number;
}

export interface Top10StudentsGroupAResponse {
  success: boolean;
  topStudents: GroupAScore[];
  message?: string;
}
