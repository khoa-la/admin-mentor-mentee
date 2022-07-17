export type TMajor = {
  id: number;
  name: string;
  imageUrl?: string;
};

export type TSubjectMajor = {
  subjectId: number;
  majorId: number;
}
