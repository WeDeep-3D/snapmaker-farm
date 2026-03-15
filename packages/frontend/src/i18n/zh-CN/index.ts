const productName = 'Snapmaker Farm';

export default {
  components: {
    devices: {
      IpInput: {
        labels: {
          invalidIp: '无效的 IP 地址',
        },
      },
      ScanRangesPanel: {
        labels: {
          title: '扫描设备',
          ipRanges: 'IP 段',
          addRange: '添加网段',
          tooManyIps: '待扫描的 IP 地址过多',
          requestScan: '发起扫描',
          abortScan: '终止扫描',
          scanProgress: '扫描进度',
        },
      },
      ScanRegionPanel: {
        labels: {
          description: '请设置您的设备所在的区域，这将用于后续分类显示设备。',
          region: '区域',
          newRegion: '新建区域',
          confirm: '确认',
          cancel: '取消',
        },
      },
      ScanResultGridView: {
        labels: {
          networkType: {
            wired: '有线',
            wireless: '无线',
            unknown: '未知',
          },
          deviceName: '名称：',
          serialNumber: '序列号：',
          macAddress: 'MAC 地址：{mac}',
          downloadLogs: '下载日志',
        },
        notifications: {
          copySerialNumberSuccess: '序列号已复制到剪贴板',
          copySerialNumberFailed: '复制序列号失败',
          downloadLogsFailed: '设备日志下载失败',
        },
      },
      ScanResultPanel: {
        labels: {
          scanProgress: '扫描进度',
          networkType: {
            wired: '有线',
            wireless: '无线',
            unknown: '未知',
          },
          selectUnselectAll: '全选/反选',
          selectWired: '选择有线设备',
          selectWireless: '选择无线设备',
        },
      },
    },
    navigations: {
      main: {
        projects: '项目',
        devices: '设备',
        filaments: '耗材',
        messages: '消息',
        settings: '设置',
      },
      stack: {
        about: '关于',
        settings: '设置',
      },
    },
    ThemeButton: {
      labels: {
        switchTheme: '切换主题',
      },
    },
  },
  composables: {
    devices: {
      regionsApi: {
        notifications: {
          createRegionError: '创建区域时发生错误',
          createRegionFailed: '创建区域失败',
          createRegionSuccess: '创建区域成功',
          getRegionsError: '获取区域时发生错误',
          getRegionsFailed: '获取区域失败',
          unknownError: '发生未知错误',
        },
      },
      scansApi: {
        notifications: {
          getScanDetailError: '获取扫描详情时发生错误',
          getScanDetailFailed: '获取扫描详情失败',
          getScanDetailSuccess: '获取扫描详情成功',
          requestScanError: '发起扫描时发生错误',
          requestScanFailed: '发起扫描失败',
          requestScanInProgress: '扫描请求正在进行中',
          requestScanSuccess: '发起扫描成功',
          unknownError: '发生未知错误',
        },
      },
    },
  },
  layouts: {
    drawers: {
      devices: {
        AddDevicesDrawer: {
          labels: {
            title: '添加设备',
            setRegionTitle: '设置区域',
            scanDevicesTitle: '扫描设备',
            selectDevicesTitle: '选择设备',
            continue: '继续',
            back: '返回',
            startScan: '开始扫描',
            bindDevices: '绑定设备',
          },
        },
        DeviceDetailsDrawer: {
          labels: {
            title: '设备详情',
          },
        },
      },
      ProjectsLeftDrawer: {
        labels: {
          title: '筛选',
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
          displayMode: '显示模式',
          grid: '网格',
          list: '列表',
          scanDevices: '扫描设备',
          viewDevices: '查看设备',
        },
        tooltips: {
          display: {
            grid: '网格视图',
            list: '列表视图',
          },
        },
      },
    },
  },
};
