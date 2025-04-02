export interface IScore {
  id: number;
  studentId: number;
  subjectId: number;
  score: number;
}

export interface IStudent {
  id: number;
  registrationNumber: string;
}

export interface ISubject {
  id: number;
  name: string;
  code: string;
  groupId?: number;
}

export interface ISubjectGroup {
  id: number;
  name: string;
  code: string;
  subjects?: string[];
}
