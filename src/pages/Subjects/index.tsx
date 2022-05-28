/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
// material
import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import { InputField, SelectField } from 'components/form';
import Label from 'components/Label';
import Page from 'components/Page';
import ResoTable from 'components/ResoTable/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';
// components
import { useNavigate } from 'react-router-dom';
import subjectApi from 'apis/subject';
import { PATH_DASHBOARD } from 'routes/paths';
import { TSubject } from 'types/subject';
import SubjectForm from './components/SubjectForm';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const SubjectListPage = () => {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentDeleteItem, setCurrentDeleteItem] = useState<TSubject | null>(null);
  const tableRef = useRef<any>();

  const schema = yup.object().shape({
    subjectName: yup.string().required('Vui lòng nhập tên môn học'),
  });
  const subjectForm = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
  });

  const { handleSubmit } = subjectForm;

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
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'subjectName',
    },
    {
      title: 'Ngày',
      // dataIndex: 'createdAt',
      valueType: 'date',
      hideInTable: true,
    },
    {
      title: 'Giờ',
      // dataIndex: 'createdAt',
      valueType: 'time',
      hideInTable: true,
    },
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
    {
      title: translate('common.table.isAvailable'),
      dataIndex: 'is_available',
      render: (isAvai: any) => (
        <Label color={isAvai ? 'success' : 'default'}>
          {isAvai ? translate('common.available') : translate('common.notAvailable')}
        </Label>
      ),
      renderFormItem: () => (
        <SelectField
          fullWidth
          sx={{ minWidth: '150px' }}
          options={[
            {
              label: translate('common.all'),
              value: '',
            },
            {
              label: translate('common.available'),
              value: 'true',
            },
            {
              label: translate('common.unAvailable'),
              value: 'false',
            },
          ]}
          name="is-available"
          size="small"
          label={translate('common.table.isAvailable')}
        />
      ),
    },
  ];

  return (
    <Page
      title={`${translate('pages.subjects.listTitle')}`}
      isTable
      actions={() => [
        <SubjectForm
          key={''}
          maxWidth="sm"
          onOk={async () => {
            try {
              await handleSubmit((data: any) => subjectApi.add(data))()
                .then(tableRef.current?.reload)
                .then(() =>
                  enqueueSnackbar(`Tạo môn học thành công`, {
                    variant: 'success',
                  })
                )
                .catch((err: any) => {
                  const errMsg = get(
                    err.response,
                    ['data', 'message'],
                    `Có lỗi xảy ra. Vui lòng thử lại`
                  );
                  enqueueSnackbar(errMsg, {
                    variant: 'error',
                  });
                });
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
              onClick={() => {
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
      ]}
    >
      <DeleteConfirmDialog
        open={Boolean(currentDeleteItem)}
        onClose={() => setCurrentDeleteItem(null)}
        onDelete={deleteSubjectHandler}
        title={
          <>
            {translate('common.confirmDeleteTitle')}{' '}
            <strong>{currentDeleteItem?.subjectName}</strong>
          </>
        }
      />
      <Card>
        <Stack spacing={2}>
          <ResoTable
            rowKey="id"
            ref={tableRef}
            onEdit={(subject: any) => navigate(`${PATH_DASHBOARD.subjects.root}/${subject.id}`)}
            getData={subjectApi.getSubjects}
            onDelete={setCurrentDeleteItem}
            columns={columns}
          />
        </Stack>
      </Card>
    </Page>
  );
};

export default SubjectListPage;
