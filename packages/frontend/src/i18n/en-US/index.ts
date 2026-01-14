const productName = 'Snapmaker Farm';

export default {
  components: {
    navigations: {
      main: {
        projects: 'Projects',
        devices: 'Devices',
        filaments: 'Filaments',
        messages: 'Messages',
        settings: 'Settings',
      },
      stack: {
        about: 'About',
        settings: 'Settings',
      },
    },
    ThemeButton: {
      labels: {
        switchTheme: 'Switch Theme',
      },
    },
  },
  layouts: {
    drawers: {
      ProjectsLeftDrawer: {
        labels: {
          title: 'Filters'
        },
      },
    },
    headers: {
      MainHeader: {
        labels: {
          title: productName,
        },
      },
    },
  },
};
