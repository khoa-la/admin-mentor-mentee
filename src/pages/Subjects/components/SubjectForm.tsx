import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import LoadingAsyncButton from 'components/LoadingAsyncButton';
import useLocales from 'hooks/useLocales';
import React, { ReactNode, useEffect, useState } from 'react';
import subjectApi from 'apis/subject';
import { useQuery } from 'react-query';
import { TSubject } from 'types/subject';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props extends Omit<Partial<DialogProps>, 'title'> {
  // title: ReactNode;
  // trigger: ReactNode;
  onCancle?: () => void;
  // onOk: () => Promise<any>;
  children?: ReactNode;
  subject_id?: number;
  onAdd?: (data: TSubject) => Promise<any>;
  onEdit?: (data: TSubject) => Promise<any>;
  onClose: () => any;
}

const SubjectForm: React.FC<Props> = ({
  subject_id,
  open,
  onAdd,
  onEdit,
  onClose,
  // trigger,
  // onOk: onSubmit,
  // title,
  children,
  ...others
}: Props) => {
  // const [open, setOpen] = useState(false);
  const { translate } = useLocales();

  const isUpdate = !!subject_id;

  const { data, isLoading } = useQuery(
    ['subject', subject_id],
    () => subjectApi.getSubjectById(subject_id!),
    {
      select: (res) => res.data,
    }
  );

  const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên môn học'),
  });
  const form = useForm<TSubject>({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    defaultValues: { ...data },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const submitHandler = (values: TSubject) =>
    (isUpdate ? onEdit!(values) : onAdd!(values)).finally(() => {
      if (onClose) {
        onClose();
      }
    });

  return (
    <>
      {/* <span
        onClick={() => {
          setOpen(true);
        }}
      >
        {trigger}
      </span> */}
      <Dialog {...others} fullWidth maxWidth="sm" open={open!} onClose={onClose}>
        <DialogTitle>{!isUpdate ? 'Tạo môn học' : 'Cập nhật môn học'}</DialogTitle>
        <DialogContent dividers>
          {isLoading ? <CircularProgress /> : <FormProvider {...form}>{children}</FormProvider>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="inherit">
            {translate('common.cancel')}
          </Button>
          <LoadingAsyncButton variant="contained" onClick={handleSubmit(submitHandler)}>
            {isUpdate ? translate('common.update') : translate('common.save')}
          </LoadingAsyncButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubjectForm;
