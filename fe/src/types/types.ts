export interface Score {
  sbd: string;
  toan: number;
  ngu_van: number;
  vat_ly: number;
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
