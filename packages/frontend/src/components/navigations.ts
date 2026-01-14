import { i18nSubPath } from 'src/utils/common';

interface Navigation {
  label: string;
  icon: string;
  available: boolean;
  route: string;
}

const i18n = i18nSubPath('components.navigations');

// main: {
//         projects: 'Projects',
//         devices: 'Devices',
//         filaments: 'Filaments',
//         messages: 'Messages',
//         settings: 'Settings',
//       },
export const MAIN_NAVIGATIONS: Navigation[] = [
  {
    label: i18n('main.projects'),
    icon: 'folder_open',
    available: true,
    route: 'projects',
  },
  {
    label: i18n('main.devices'),
    icon: 'devices',
    available: true,
    route: 'devices',
  },
  {
    label: i18n('main.filaments'),
    icon: 'tune',
    available: true,
    route: 'filaments',
  },
  {
    label: i18n('main.messages'),
    icon: 'message',
    available: true,
    route: 'messages',
  },
  {
    label: i18n('main.settings'),
    icon: 'settings',
    available: true,
    route: 'settings',
  },
];

export const STACK_NAVIGATIONS: Navigation[] = [
  {
    label: i18n('stack.about'),
    icon: 'information',
    available: true,
    route: 'about',
  },
  {
    label: i18n('stack.settings'),
    icon: 'cog',
    available: true,
    route: 'settings',
  },
];
