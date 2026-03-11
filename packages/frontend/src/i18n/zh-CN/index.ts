const productName = 'Snapmaker Farm';

export default {
  components: {
    devices: {
      IpInput: {
        labels: {
          invalidIp: '无效的 IP 地址',
        },
      },
      ScanDialog: {
        labels: {
          setRegionTitle: '设置区域',
          setRegionDescription: '请设置您的设备所在的区域，这将用于后续分类显示设备。',
          continue: '继续',
          startScan: '开始扫描',
          bindDevices: '绑定设备',
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
        notifications: {
          requestScanInProgress: '已有扫描任务进行中',
          requestScanSuccess: '扫描请求成功',
          requestScanFailed: '扫描请求失败',
          requestScanError: '扫描请求出错',
          getScanDetailSuccess: '扫描详情获取成功',
          getScanDetailFailed: '扫描详情获取失败',
          getScanDetailError: '获取扫描详情出错',
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
  layouts: {
    drawers: {
      devices: {
        AddDevicesDrawer: {
          labels: {
            title: '\u6dfb\u52a0\u8bbe\u5907',
            setRegionTitle: '\u8bbe\u7f6e\u533a\u57df',
            setRegionDescription:
              '\u8bf7\u8bbe\u7f6e\u60a8\u7684\u8bbe\u5907\u6240\u5728\u7684\u533a\u57df\uff0c\u8fd9\u5c06\u7528\u4e8e\u540e\u7eed\u5206\u7c7b\u663e\u793a\u8bbe\u5907\u3002',
            scanDevicesTitle: '\u626b\u63cf\u8bbe\u5907',
            selectDevicesTitle: '\u9009\u62e9\u8bbe\u5907',
            displayMode: '\u663e\u793a\u6a21\u5f0f',
            grid: '\u7f51\u683c',
            list: '\u5217\u8868',
            continue: '\u7ee7\u7eed',
            back: '\u8fd4\u56de',
            bindDevices: '\u7ed1\u5b9a\u8bbe\u5907',
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
