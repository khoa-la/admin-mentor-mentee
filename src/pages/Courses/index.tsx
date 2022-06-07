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
import courseApi from 'apis/course';
import { PATH_DASHBOARD } from 'routes/paths';
import { TCourse } from 'types/course';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import LoadingAsyncButton from 'components/LoadingAsyncButton';

const CourseListPage = () => {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentItem, setCurrentItem] = useState<TCourse | null>(null);
  const tableRef = useRef<any>();

  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  console.log(id);

  const { data, isLoading } = useQuery(
    ['course', currentItem],
    () => courseApi.getCourseById(Number(currentItem)),
    {
      select: (res) => res.data,
    }
  );
  console.log(data);

  const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên khoá học'),
  });
  const courseForm = useForm<TCourse>({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    defaultValues: { ...data },
  });

  const { handleSubmit, control, reset } = courseForm;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const deleteSubjectHandler = () =>
    courseApi
      .delete(currentItem?.id!)
      .then(() => setCurrentItem(null))
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

  const updateCourseHandler = (course: TCourse) =>
    courseApi
      .update(course?.id!, course!)
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
      title: 'Tên khoá học',
      dataIndex: 'name',
    },
    {
      title: 'Xác thực',
      dataIndex: 'isVerified',
      hideInSearch: true,
      render: (isVeri: any) => (
        <Iconify
          icon={isVeri ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!isVeri && { color: 'warning.main' }),
          }}
        />
      ),
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
      dataIndex: 'isAvailable',
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
      title={`Khoá học`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Khoá học`,
              href: PATH_DASHBOARD.courses.root,
            },
            { name: `${translate('list')}` },
          ]}
        />
      }
      actions={() => [
        <Button
          key="create-subject"
          onClick={() => {
            navigate(PATH_DASHBOARD.courses.new);
          }}
          variant="contained"
          startIcon={<Icon icon={plusFill} />}
        >
          {translate('pages.subjects.addBtn')}
        </Button>,
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
            }}
            getData={courseApi.getCourses}
            onDelete={setCurrentItem}
            columns={columns}
          />
        </Stack>
      </Card>
    </Page>
  );
};

export default CourseListPage;
