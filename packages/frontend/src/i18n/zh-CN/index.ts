const productName = 'Snapmaker Farm';

export default {
  components: {
    devices: {
      IpInput: {
        labels: {
          invalidIp: '无效的 IP 地址',
        },
      },
      ScanPanel: {
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
      ScanResultListView: {
        labels: {
          networkType: {
            wired: '有线',
            wireless: '无线',
            unknown: '未知',
          },
          selectWired: '选择有线设备',
          selectWireless: '选择无线设备',
          uploadGCodeFile: '上传 G-code 文件',
          chooseFile: '选择文件...',
          cancel: '取消',
          startUpload: '开始上传',
        },
        notifications: {
          uploadNoDeviceSelected: '上传前请至少选择一个设备。',
          uploadSuccess: '已上传到所有 {count} 个已选设备。',
          uploadPartial: '已上传到 {success} 个设备；{failed} 个失败。',
          uploadFailed: '所有已选设备上传失败。',
        },
      },
      ScanResultPanel: {
        labels: {
          scanProgress: '扫描进度',
          displayMode: '显示模式',
          grid: '网格',
          list: '列表',
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
      scan: {
        notifications: {
          getScanDetailError: '获取扫描详情时发生错误',
          getScanDetailFailed: '获取扫描详情失败',
          getScanDetailSuccess: '获取扫描详情成功',
          requestScanError: '发起扫描时发生错误',
          requestScanFailed: '发起扫描失败',
          requestScanInProgress: '扫描请求正在进行中',
          requestScanSuccess: '发起扫描成功',
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
            setRegionDescription: '请设置您的设备所在的区域，这将用于后续分类显示设备。',
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
            title: '\u8bbe\u5907\u8be6\u60c5',
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
