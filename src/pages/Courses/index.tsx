/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Icon } from '@iconify/react';
// material
import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Tooltip,
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
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import LoadingAsyncButton from 'components/LoadingAsyncButton';
import { TabContext, TabList } from '@mui/lab';
import { type } from 'os';
import axios from 'axios';
import { axiosInstance } from 'utils/axios';

const STATUS_OPTIONS = ['Tất cả', 'Đã duyệt', 'Chờ duyệt', 'Đã huỷ'];

enum STATUS {
  Draft = 1, //Mentor tạo khóa học nháp
  Pending = 2, //Mentor đã submit khóa học, chờ duyệt
  Waiting = 3, //Khóa học đã được duyệt chờ đủ mentee
  CancelNotEnough = 4, //Khóa học kết thúc do không đủ thành viên
  Start = 5,
  End = 6,
}

function groupBy(list: any, keyGetter: any) {
  const map = new Map();
  list?.forEach((item: any) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

const CourseListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentItem, setCurrentItem] = useState<TCourse | null>(null);
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();

  const { data: allData } = useQuery('courses', () => axiosInstance.get('/courses'), {
    select: (res) => res.data.data,
  });
  console.log(allData);
  const result = groupBy(allData, (data: any) => data.status);
  console.log(result.get(5)?.length);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    ref.current?.formControl.setValue(
      'status',
      newValue === '1' ? STATUS.Start : newValue === '2' ? STATUS.Pending : STATUS.CancelNotEnough
    );
    setActiveTab(newValue);
    ref.current?.formControl.setValue('tabindex', newValue);
  };

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
      .then(() => ref.current?.reload)
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
      .then(() => ref.current?.reload)
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
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      valueType: 'datetime',
      hideInSearch: true,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'finishDate',
      valueType: 'datetime',
      hideInSearch: true,
    },
    // {
    //   title: 'Ngày cập nhật',
    //   dataIndex: 'updateDate',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
    {
      title: 'Ngày tạo',
      dataIndex: 'createDate',
      valueType: 'datetime',
      hideInSearch: true,
    },
    {
      title: translate('common.table.isAvailable'),
      dataIndex: 'status',
      render: (status: any) => (
        <Label
          color={
            status === 5
              ? 'secondary'
              : status === 2
              ? 'error'
              : status === 3
              ? 'warning'
              : status === 6
              ? 'success'
              : 'default'
          }
        >
          {status === 5
            ? translate('common.available')
            : status === 2
            ? 'Chờ duyệt'
            : status === 3
            ? 'Chờ đủ mentee'
            : status === 6
            ? 'Đã hoàn thành'
            : 'Đã huỷ'}
        </Label>
      ),
      renderFormItem: () => (
        <SelectField
          fullWidth
          sx={{ minWidth: '150px' }}
          options={[
            {
              label: 'Đang diễn ra',
              value: '5',
            },
            {
              label: 'Chờ đủ mentee',
              value: '3',
            },
            {
              label: 'Đã kết thúc',
              value: '6',
            },
          ]}
          name="status"
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
        <DeleteConfirmDialog
          key={''}
          open={Boolean(currentItem)}
          onClose={() => setCurrentItem(null)}
          onDelete={deleteSubjectHandler}
          title={
            <>
              {translate('common.confirmDeleteTitle')} <strong>{currentItem?.name}</strong>
            </>
          }
        />,
      ]}
    >
      <Card>
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{ px: 2, bgcolor: 'background.neutral' }}
            >
              <Tab
                disableRipple
                label={
                  <Badge
                    color="success"
                    badgeContent={
                      result.get(5)?.length + result.get(6)?.length + result.get(3)?.length
                    }
                  >
                    Đã duyệt
                  </Badge>
                }
                value="1"
                sx={{ px: 2 }}
              />
              <Tab
                label={
                  <Badge color="error" badgeContent={result.get(2)?.length}>
                    Chờ duyệt
                  </Badge>
                }
                value="2"
                sx={{ px: 2 }}
              />
              <Tab
                label={
                  <Badge color="warning" badgeContent={result.get(4)?.length}>
                    Đã huỷ
                  </Badge>
                }
                value="3"
                sx={{ px: 2 }}
              />
            </TabList>
          </Box>
          <Stack spacing={2}>
            <ResoTable
              rowKey="id"
              ref={ref}
              onEdit={(course: any) => {
                navigate(`${PATH_DASHBOARD.courses.root}/${course.id}`);
                setIsUpdate(true);
              }}
              onView={(course: any) => navigate(`${PATH_DASHBOARD.courses.root}/${course.id}/view`)}
              getData={courseApi.getCourses}
              onDelete={setCurrentItem}
              columns={columns}
            />
          </Stack>
        </TabContext>
      </Card>
    </Page>
  );
};

export default CourseListPage;
