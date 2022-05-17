// routes
import { PATH_STORE_APP } from 'routes/storeAppPaths';
import SvgIconStyle from '../../components/SvgIconStyle';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  kanban: getIcon('ic_kanban'),
  tag: getIcon('tag'),
  menu: getIcon('menu'),
  store: getIcon('ic_store'),
  order: getIcon('ic_order'),
  category: getIcon('ic_category'),
  extraCategory: getIcon('ic_extra_category'),
  storeApply: getIcon('ic_store_apply'),
  combo: getIcon('ic_combo'),
  product: getIcon('ic_product'),
  collection: getIcon('ic_collection')
};

const sidebarConfig = [
  {
    subheader: 'general',
    items: [
      {
        title: 'app',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      {
        title: 'order',
        path: PATH_DASHBOARD.orders.list,
        icon: ICONS.order
      }
    ]
  },
  {
    subheader: 'menu-subheader',
    items: [
      { title: 'menu-list', path: PATH_DASHBOARD.menus.list, icon: ICONS.menu },
      { title: 'store-menu-apply', path: PATH_DASHBOARD.menus.storeMenu, icon: ICONS.storeApply }
    ]
  },
  {
    subheader: 'product-subheader',
    items: [
      // MANAGEMENT : PRODUCT
      {
        title: 'master',
        path: PATH_DASHBOARD.products.list,
        icon: ICONS.product
      },
      {
        title: 'combo-list',
        path: PATH_DASHBOARD.combos.list,
        icon: ICONS.combo
      }
    ]
  },
  {
    subheader: 'group-subheader',
    path: PATH_DASHBOARD.group.root,
    items: [
      {
        title: 'category',
        path: PATH_DASHBOARD.categories.list,
        icon: ICONS.category
      },
      {
        title: 'extra-category',
        path: PATH_DASHBOARD.categories.extra,
        icon: ICONS.extraCategory
      },
      {
        title: 'collection',
        path: PATH_DASHBOARD.collections.list,
        icon: ICONS.collection
      }
    ]
  },

  {
    subheader: 'store-subheader',
    items: [
      {
        title: 'store',
        path: PATH_DASHBOARD.stores.list,
        icon: ICONS.store
      }
    ]
  },

  {
    subheader: 'course-subheader',
    items: [
      {
        title: 'subject',
        path: PATH_DASHBOARD.subjects.list,
        icon: ICONS.store
      }
    ]
  }
];

export const storeAppSidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'app',
        path: PATH_STORE_APP.general.app,
        icon: ICONS.dashboard
      }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : PRODUCT

      {
        title: 'order',
        path: PATH_STORE_APP.orders.list,
        icon: ICONS.order
      },
      {
        title: 'store-menu',
        path: PATH_STORE_APP.menus.list,
        icon: ICONS.menu
      }
    ]
  }
];

export default sidebarConfig;
