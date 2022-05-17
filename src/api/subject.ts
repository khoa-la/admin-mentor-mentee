import { TSubject } from 'types/subject';
import { generateAPIWithPaging } from './utils';

const subjectApi = {
  ...generateAPIWithPaging<TSubject>('subjects')
};

export default subjectApi;
