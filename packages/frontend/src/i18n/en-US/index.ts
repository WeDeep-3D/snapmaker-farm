const productName = 'Snapmaker Farm';

export default {
  components: {
    navigations: {
      main: {
        dashboard: 'Dashboard',
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
    headers: {
      MainHeader: {
        labels: {
          title: productName,
        },
      },
    },
  },
};
