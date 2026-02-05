const productName = 'Snapmaker Farm';

export default {
  components: {
    devices: {
      IpInput: {
        labels: {
          invalidIp: 'Invalid IP Address',
        },
      },
      ScanPanel: {
        labels: {
          title: 'Scan Devices',
          ipRanges: 'IP Ranges',
          addRange: 'Add Range',
          tooManyIps: 'Too many IP addresses to scan',
          requestScan: 'Request Scan',
          abortScan: 'AbortScan',
          scanProgress: 'Scan Progress',
        },
        notifications: {
          requestScanInProgress: 'A scan is already in progress',
          requestScanSuccess: 'Scan requested successfully',
          requestScanFailed: 'Failed to request scan',
          requestScanError: 'Error requesting scan',
          getScanDetailSuccess: 'Scan details retrieved successfully',
          getScanDetailFailed: 'Failed to get scan details',
          getScanDetailError: 'Error getting scan details',
        },
      },
      ScanResultGridView: {
        labels: {
          deviceName: 'Name:',
          serialNumber: 'S/N: ',
          macAddress: 'MAC Address: {mac}',
        },
        notifications: {
          copySerialNumberSuccess: 'Serial number copied to clipboard',
          copySerialNumberFailed: 'Failed to copy serial number',
          downloadLogSuccess: 'Device logs downloaded successfully',
          downloadLogFailed: 'Failed to download device logs',
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
          displayMode: 'Display Mode',
          grid: 'Grid',
          list: 'List',
          scanDevices: 'Scan Devices',
          viewDevices: 'View Devices',
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
