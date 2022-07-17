import roundAccountBox from '@iconify/icons-ic/round-account-box';
// import roundReceipt from '@iconify/icons-ic/round-receipt';
// import { Icon } from '@iconify/react';
// import { Box, Button, Stack, Tab, Tabs } from '@mui/material';
// import Page from 'components/Page';
// import useLocales from 'hooks/useLocales';
// import { get } from 'lodash';
// import { useSnackbar } from 'notistack';
// import React from 'react';
// import { FormProvider, useForm } from 'react-hook-form';
// import { useQuery } from 'react-query';
// import { useLocation, useParams } from 'react-router-dom';
// import { getCollectionById, updateCollection } from 'redux/collections/api';
// import { TMajor } from 'types/major';
// import majorApi from 'apis/major';
// import CollectionInfoTab from './tabs/CollectionInfoTab';
// import ProductInCollectionTab from './tabs/ProductInCollectionTab';
// import ModalSubjectForm from './components/ModalSubjectForm';

// enum TabType {
//   COLLECTION_INFO = 'COLLETION_INFO',
//   PRODUCT_COLLECTION = 'PRODUCT_COLLECTION'
// }

// function TabPanel(props: any) {
//   const { children, hidden, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={hidden}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       <Box sx={{ py: 2 }}>{children}</Box>
//     </div>
//   );
// }

// const UpdateMajorPage = () => {
//   const { translate } = useLocales();
//   const { state } = useLocation();
//   const { id } = useParams();
//   const [currentTab, setCurrentTab] = React.useState<TabType>(TabType.COLLECTION_INFO);
//   const { enqueueSnackbar } = useSnackbar();

//   const { data: major } = useQuery(['major', Number(id)], () =>
//     majorApi.getMajorById(Number(id))
//   );
//   const form = useForm<TMajor>({
//     defaultValues: {
//       ...major
//     }
//   });

//   React.useEffect(() => {
//     if (major) {
//       form.reset(major);
//     }
//   }, [major]);

//   const onUpdateCollection = (values: TMajor) =>
//     updateCollection(+id!, values)
//       .then(() =>
//         enqueueSnackbar(translate('common.200'), {
//           variant: 'success'
//         })
//       )
//       .catch((err: any) => {
//         const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
//         enqueueSnackbar(errMsg, {
//           variant: 'error'
//         });
//       });

//   const MENU_TABS = [
//     {
//       value: TabType.COLLECTION_INFO,
//       label: translate('collections.collectionInfoTab'),
//       icon: <Icon icon={roundAccountBox} width={20} height={20} />,
//       component: (
//         <Stack>
//           <CollectionInfoTab onSubmit={form.handleSubmit(onUpdateCollection)} />
//         </Stack>
//       )
//     },
//     {
//       value: TabType.PRODUCT_COLLECTION,
//       label: translate('collections.productTab'),
//       icon: <Icon icon={roundReceipt} width={20} height={20} />,
//       component: <ProductInCollectionTab id={id} onSubmit={form.handleSubmit(onUpdateCollection)} />
//     }
//   ];

//   return (
//     <FormProvider {...form}>
//       <Page
//         title={translate('collections.editTitle')}
//         actions={() => [
//           <Button key="delete-collection" size="small" color="error" variant="outlined">
//             {translate('common.delete')}
//           </Button>
//         ]}
//       >
//         <Box mx="auto">
//           <Tabs
//             value={currentTab}
//             scrollButtons="auto"
//             variant="scrollable"
//             allowScrollButtonsMobile
//             onChange={(e, value) => setCurrentTab(value)}
//           >
//             {MENU_TABS.map((tab) => (
//               <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
//             ))}
//           </Tabs>
//           <Box mt={2}>
//             {MENU_TABS.map((tab, index) => {
//               const isMatched = tab.value === currentTab;
//               return (
//                 <TabPanel key={tab.value} index={index} hidden={!isMatched}>
//                   {tab.component}
//                 </TabPanel>
//               );
//             })}
//           </Box>
//         </Box>
//       </Page>
//     </FormProvider>
//   );
// };

// export default UpdateMajorPage;
