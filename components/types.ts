export type Student = {
  id: number;
  name: string;
}

export type Pod = {
  students: Student[];
}

export type Row = {
  pods: Pod[];
}

export type ClassPeriod = {
  number: number;
  rows: Row[];
  unassignedStudents: Student[];
}