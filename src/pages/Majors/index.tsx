/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
// material
import { Avatar, Button, Card, Stack } from '@mui/material';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import Page from 'components/Page';
import ResoTable from 'components/ResoTable/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';
// components
import majorApi from 'apis/major';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TMajor } from 'types/major';

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

const MajorListPage = () => {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentItem, setCurrentItem] = useState<TMajor | null>(null);
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();

  const deleteSubjectHandler = async () => {
    await majorApi
      .remove(currentItem?.id!)
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
  };

  const updateCourseHandler = async () => {
    await majorApi
      .update(currentItem!)
      .then(() => setCurrentItem(null))
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
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      hideInSearch: true,
      render: (src: any, { title }: any) => (
        <Avatar
          alt={title}
          src={src}
          variant={'rounded'}
          style={{ width: '54px', height: '54px' }}
        />
      ),
    },
    {
      title: 'Tên chuyên ngành',
      dataIndex: 'name',
    },
  ];

  return (
    <Page
      title={`Chuyên ngành`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Chuyên ngành`,
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
            navigate(PATH_DASHBOARD.majors.new);
          }}
          variant="contained"
          startIcon={<Icon icon={plusFill} />}
        >
          {`Tạo chuyên ngành`}
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
        <Stack spacing={2}>
          <ResoTable
            rowKey="id"
            ref={ref}
            onEdit={(major: any) => {
              navigate(`${PATH_DASHBOARD.majors.root}/${major.id}`);
            }}
            getData={majorApi.getMajors}
            onDelete={setCurrentItem}
            columns={columns}
          />
        </Stack>
      </Card>
    </Page>
  );
};

export default MajorListPage;
