const productName = 'Snapmaker Farm';

export default {
  components: {
    devices: {
      IpInput: {
        labels: {
          invalidIp: 'Invalid IP Address',
        },
      },
      ScanDevicesDialog: {
        labels: {
          title: 'Scan Devices',
          ipRanges: 'IP Ranges',
          addRange: 'Add Range',
          invalidIp: 'Invalid IP Address',
          tooManyIps: 'Too many IP addresses to scan',
          confirm: 'Confirm',
          cancel: 'Cancel',
        },
      },
    },
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
          title: 'Filters',
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
  pages: {
    main: {
      DevicesPage: {
        labels: {
          scanDevices: 'Scan Devices',
        },
        tooltips: {
          display: {
            grid: 'Grid View',
            list: 'List View',
          },
        },
      },
    },
  },
};
