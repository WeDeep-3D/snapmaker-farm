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
          tooManyIps: 'Too many IP addresses to scan',
          requestScan: 'Request Scan',
          confirm: 'Confirm',
          cancel: 'Cancel',
        },
        notifications: {
          requestScanSuccess: 'Scan requested successfully',
          requestScanFailed: 'Failed to request scan',
          requestScanError: 'Error requesting scan',
          getScanDetailSuccess: 'Scan details retrieved successfully',
          getScanDetailFailed: 'Failed to get scan details',
          getScanDetailError: 'Error getting scan details',
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
