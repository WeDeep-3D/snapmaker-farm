const productName = 'Snapmaker Farm';

export default {
  components: {
    devices: {
      AddDevicesPanel: {
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
      AddRegionDialog: {
        labels: {
          title: '新建区域',
          description: '请输入新区域的名称和描述信息。',
          regionName: '区域名称',
          regionDescription: '区域描述（可选）',
          confirm: '确认',
          cancel: '取消',
        },
      },
      DeviceDetailsPanel: {
        labels: {
          title: '设备详情',
        },
      },
      DevicesGridView: {
        labels: {
          cost: '消耗: {cost}mm',
          remaining: '剩余: {duration}',
          filename: '文件名：{filename}',
          layers: '层数：{current}/{total}',
        },
        printStates: {
          standby: '待机',
          printing: '打印中',
          paused: '暂停',
          complete: '完成',
          error: '错误',
          cancelled: '已取消',
          unknown: '未知',
        },
      },
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
          newRegion: '新建',
        },
      },
      ScanResultGridView: {
        labels: {
          networkType: {
            wired: '有线',
            wireless: '无线',
            unknown: '未知',
          },
          bindingStatus: {
            unbound: '未绑定',
            bound_self: '已绑定',
            bound_other: '已被其他系统绑定',
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
          bindingStatus: {
            unbound: '未绑定',
            bound_self: '已绑定',
            bound_other: '已被其他系统绑定',
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
    api: {
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
      devicesApi: {
        notifications: {
          getDevicesError: '获取设备时发生错误',
          getDevicesFailed: '获取设备失败',
          createDeviceError: '创建设备时发生错误',
          createDeviceFailed: '创建设备失败',
          createDeviceSuccess: '创建设备成功',
          removeDeviceError: '移除设备时发生错误',
          removeDeviceFailed: '移除设备失败',
          removeDeviceSuccess: '移除设备成功',
          downloadDeviceLogsError: '下载设备日志时发生错误',
          downloadDeviceLogsFailed: '下载设备日志失败',
          downloadDeviceLogsSuccess: '设备日志下载成功',
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
      farmsApi: {
        notifications: {
          getFarmError: '获取农场信息时发生错误',
          getFarmFailed: '获取农场信息失败',
          unknownError: '发生未知错误',
        },
      },
    },
  },
  layouts: {
    drawers: {
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
