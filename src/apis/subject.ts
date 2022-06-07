import { TSubject } from 'types/subject';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getSubjects = (params?: any) => request.get('/subjects', { params });

const getSubjectById = (id: number, params?: any) => request.get(`/subjects/${id}`, { params });

const remove = (id: number) => request.delete(`/subjects/${id}`);

const add = (data: any) => request.post('/subjects', data);

const update = (id: number, data: TSubject) => request.put(`/subjects/${id}`, data);

const subjectApi = {
  ...generateAPIWithPaging<TSubject>('subjects'),
  getSubjects,
  getSubjectById,
  remove,
  add,
  update,
};

export default subjectApi;
