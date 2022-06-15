import closeIcon from '@iconify/icons-eva/close-outline';
import { Icon } from '@iconify/react';
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EmptyContent from 'components/EmptyContent';
import { InputField } from 'components/form';
import { useFieldArray, useFormState } from 'react-hook-form';

const AddProductTable = ({ control }: any) => {
  const { errors } = useFormState({ control });
  const { fields: subjects, remove: removeProd } = useFieldArray({ name: 'subjects', control });
  const buildProductTable = () => (
    <TableContainer>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Môn học</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((data, idx) => (
            <TableRow key={data.id}>
              <TableCell align="left">
                <Box display="flex" justifyContent="space-between">
                  <Stack direction="row" spacing={2} alignItems="center">
                    {/* <Avatar variant="square" src={data.pic_url} /> */}
                    <Typography noWrap>{data.id}</Typography>
                  </Stack>
                </Box>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProd(idx);
                  }}
                  size="large"
                >
                  <Icon icon={closeIcon} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Stack spacing={2}>
      {subjects.length ? (
        buildProductTable()
      ) : (
        <EmptyContent title="Chưa có môn học nào được thêm" />
      )}
    </Stack>
  );
};

export default AddProductTable;
