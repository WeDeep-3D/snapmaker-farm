const productName = 'Snapmaker Farm';

export default {
  components: {
    devices: {
      AddRegionDialog: {
        labels: {
          title: 'New Region',
          description: 'Please enter the name and description for the new region.',
          regionName: 'Region Name',
          regionDescription: 'Region Description (Optional)',
          confirm: 'Confirm',
          cancel: 'Cancel',
        }
      },
      IpInput: {
        labels: {
          invalidIp: 'Invalid IP Address',
        },
      },
      ScanRangesPanel: {
        labels: {
          title: 'Scan Devices',
          ipRanges: 'IP Ranges',
          addRange: 'Add Range',
          tooManyIps: 'Too many IP addresses to scan',
          requestScan: 'Request Scan',
          abortScan: 'AbortScan',
          scanProgress: 'Scan Progress',
        },
      },
      ScanRegionPanel: {
        labels: {
          description:
            'Please set the region for new devices. This will be used for categorizing devices later.',
          region: 'Region',
          newRegion: 'New',
        },
      },
      ScanResultGridView: {
        labels: {
          networkType: {
            wired: 'Wired',
            wireless: 'Wireless',
            unknown: 'Unknown',
          },
          deviceName: 'Name:',
          serialNumber: 'S/N: ',
          macAddress: 'MAC Address: {mac}',
          downloadLogs: 'Download Logs',
        },
        notifications: {
          copySerialNumberSuccess: 'Serial number copied to clipboard',
          copySerialNumberFailed: 'Failed to copy serial number',
          downloadLogsFailed: 'Failed to download device logs',
        },
      },
      ScanResultPanel: {
        labels: {
          scanProgress: 'Scan Progress',
          networkType: {
            wired: 'Wired',
            wireless: 'Wireless',
            unknown: 'Unknown',
          },
          selectUnselectAll: 'Select/Unselect All',
          selectWired: 'Select Wired',
          selectWireless: 'Select Wireless',
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
  composables: {
    devices: {
      regionsApi: {
        notifications: {
          createRegionError: 'Error creating region',
          createRegionFailed: 'Failed to create region',
          createRegionSuccess: 'Region created successfully',
          getRegionsError: 'Error getting regions',
          getRegionsFailed: 'Failed to get regions',
          unknownError: 'An unknown error occurred',
        },
      },
      scansApi: {
        notifications: {
          getScanDetailError: 'Error getting scan details',
          getScanDetailFailed: 'Failed to get scan details',
          getScanDetailSuccess: 'Successfully got scan details',
          requestScanError: 'Error requesting scan',
          requestScanFailed: 'Failed to request scan',
          requestScanInProgress: 'A scan request is already in progress',
          requestScanSuccess: 'Scan requested successfully',
          unknownError: 'An unknown error occurred',
        },
      },
    },
  },
  layouts: {
    drawers: {
      devices: {
        AddDevicesDrawer: {
          labels: {
            title: 'Add Devices',
            setRegionTitle: 'Set Region',
            scanDevicesTitle: 'Scan Devices',
            selectDevicesTitle: 'Select Devices',
            continue: 'Continue',
            back: 'Back',
            startScan: 'Start Scan',
            bindDevices: 'Bind Devices',
          },
        },
        DeviceDetailsDrawer: {
          labels: {
            title: 'Device Details',
          },
        },
      },
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
