/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import { InputField, SelectField } from 'components/form';
import Label from 'components/Label';
import Page from 'components/Page';
import ResoTable from 'components/ResoTable/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
// components
import { useNavigate } from 'react-router-dom';
import subjectApi from 'apis/subject';
import { PATH_DASHBOARD } from 'routes/paths';
import { TSubject } from 'types/subject';
import SubjectForm from './components/SubjectForm';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import LoadingAsyncButton from 'components/LoadingAsyncButton';

const SubjectListPage = () => {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentDeleteItem, setCurrentDeleteItem] = useState<TSubject | null>(null);
  const [currentUpdateItem, setCurrentUpdateItem] = useState<TSubject | null>(null);
  const tableRef = useRef<any>();

  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  console.log(id);

  const { data, isLoading } = useQuery(
    ['subject', currentUpdateItem],
    () => subjectApi.getSubjectById(Number(currentUpdateItem)),
    {
      select: (res) => res.data,
    }
  );
  console.log(data);

  const schema = yup.object().shape({
    subjectName: yup.string().required('Vui lòng nhập tên môn học'),
  });
  const subjectForm = useForm<TSubject>({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    defaultValues: { ...data },
  });

  const { handleSubmit, control, reset } = subjectForm;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const deleteSubjectHandler = () =>
    subjectApi
      .delete(currentDeleteItem?.id!)
      .then(() => setCurrentDeleteItem(null))
      .then(tableRef.current?.reload)
      .then(() =>
        enqueueSnackbar(`Xóa thành công`, {
          variant: 'success',
        })
      )
      .catch((err: any) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error',
        });
      });

  const updateSubjectHandler = (subject: TSubject) =>
    subjectApi
      .update(subject?.id!, subject!)
      .then(tableRef.current?.reload)
      .then(() =>
        enqueueSnackbar(`Cập nhât thành công`, {
          variant: 'success',
        })
      )
      .catch((err: any) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error',
        });
      });

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
    },
    // {
    //   title: 'Xác thực',
    //   dataIndex: 'isVerified',
    //   hideInSearch: true,
    //   render: (isVeri: any) => (
    //     <Iconify
    //       icon={isVeri ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
    //       sx={{
    //         width: 20,
    //         height: 20,
    //         color: 'success.main',
    //         ...(!isVeri && { color: 'warning.main' }),
    //       }}
    //     />
    //   ),
    // },
    // {
    //   title: 'Ngày',
    //   // dataIndex: 'createdAt',
    //   valueType: 'date',
    //   hideInTable: true,
    // },
    // {
    //   title: 'Giờ',
    //   // dataIndex: 'createdAt',
    //   valueType: 'time',
    //   hideInTable: true,
    // },
    // {
    //   title: 'Ngày update',
    //   dataIndex: 'updatedDate',
    //   valueType: 'datetime',
    //   hideInSearch: true
    // },
    // {
    //   title: 'Ngày phát hành',
    //   dataIndex: 'publishedDate',
    //   valueType: 'datetime',
    //   hideInSearch: true
    // },
    // {
    //   title: translate('common.table.isAvailable'),
    //   dataIndex: 'isAvailable',
    //   render: (isAvai: any) => (
    //     <Label color={isAvai ? 'success' : 'default'}>
    //       {isAvai ? translate('common.available') : translate('common.notAvailable')}
    //     </Label>
    //   ),
    //   renderFormItem: () => (
    //     <SelectField
    //       fullWidth
    //       sx={{ minWidth: '150px' }}
    //       options={[
    //         {
    //           label: translate('common.all'),
    //           value: '',
    //         },
    //         {
    //           label: translate('common.available'),
    //           value: 'true',
    //         },
    //         {
    //           label: translate('common.unAvailable'),
    //           value: 'false',
    //         },
    //       ]}
    //       name="is-available"
    //       size="small"
    //       label={translate('common.table.isAvailable')}
    //     />
    //   ),
    // },
  ];

  return (
    <Page
      title={`${translate('pages.subjects.listTitle')}`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `${translate('pages.subjects.listTitle')}`,
              href: PATH_DASHBOARD.subjects.root,
            },
            { name: `${translate('list')}` },
          ]}
        />
      }
      actions={() => [
        // Create
        <SubjectForm
          key={''}
          maxWidth="sm"
          onOk={async () => {
            try {
              await handleSubmit(
                (data: any) => subjectApi.add(data),
                (e: any) => {
                  throw e;
                }
              )();
              enqueueSnackbar(`Tạo môn học thành công`, {
                variant: 'success',
              });
              tableRef.current?.reload();
              return true;
            } catch (error) {
              enqueueSnackbar('Có lỗi', { variant: 'error' });
              return false;
            }
          }}
          title={<Typography variant="h3">Tạo môn học</Typography>}
          trigger={
            <Button
              key="create-subject"
              onClick={(subject: any) => {
                navigate(PATH_DASHBOARD.subjects.new);
              }}
              variant="contained"
              startIcon={<Icon icon={plusFill} />}
            >
              {translate('pages.subjects.addBtn')}
            </Button>
          }
        >
          <FormProvider {...subjectForm}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputField fullWidth required name="subjectName" label="Tên môn học" />
              </Grid>
            </Grid>
          </FormProvider>
        </SubjectForm>,

        // Delete
        <DeleteConfirmDialog
          key={''}
          open={Boolean(currentDeleteItem)}
          onClose={() => setCurrentDeleteItem(null)}
          onDelete={deleteSubjectHandler}
          title={
            <>
              {translate('common.confirmDeleteTitle')} <strong>{currentDeleteItem?.name}</strong>
            </>
          }
        />,
      ]}
    >
      <Card>
        <Stack spacing={2}>
          <ResoTable
            rowKey="id"
            ref={tableRef}
            onEdit={(subject: any) => {
              navigate(`${PATH_DASHBOARD.subjects.root}/${subject.id}`);
              setIsUpdate(true);
              setCurrentUpdateItem(subject?.id);
            }}
            getData={subjectApi.getSubjects}
            onDelete={setCurrentDeleteItem}
            columns={columns}
          />
        </Stack>
      </Card>

      <Dialog
        open={isUpdate}
        fullWidth
        onClose={() => setIsUpdate(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Cập nhật môn học</DialogTitle>
        <DialogContent dividers>
          <FormProvider {...subjectForm}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputField fullWidth required name="name" label="Tên môn học" />
              </Grid>
            </Grid>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdate(false)} variant="outlined" color="inherit">
            {translate('common.cancel')}
          </Button>
          <LoadingAsyncButton
            variant="contained"
            onClick={async () => {
              try {
                await handleSubmit(
                  (data: any) => subjectApi.update(Number(id), data),
                  (e: any) => {
                    throw e;
                  }
                )();
                enqueueSnackbar(`Cập nhật môn học thành công`, {
                  variant: 'success',
                });
                setIsUpdate(false);
                reset(data);
                tableRef.current?.reload();
                return true;
              } catch (error) {
                enqueueSnackbar('Có lỗi', { variant: 'error' });
                return false;
              }
            }}
          >
            {translate('common.save')}
          </LoadingAsyncButton>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default SubjectListPage;
