export enum IdleTimeoutState {
  printing = 'Printing',
  ready = 'Ready',
  idle = 'Idle',
}

export enum KlippyState {
  disconnected = 'disconnected',
  error = 'error',
  ready = 'ready',
  shutdown = 'shutdown',
  startup = 'startup',
  unknown = 'unknown',
}

export enum PrintState {
  standby = 'standby',
  printing = 'printing',
  paused = 'paused',
  complete = 'complete',
  error = 'error',
  cancelled = 'cancelled',
  unknown = 'unknown',
}

export interface PrinterObjectTypes {
  webhooks: {
    state: KlippyState
    state_message: string
  }
  motion_report: {
    live_position: number[]
    live_velocity: number
    live_extruder_velocity: number
    steppers: string[]
    trapq: string[]
  }
  gcode_move: {
    speed_factor: number
    speed: number
    extrude_factor: number
    absolute_coordinates: boolean
    absolute_extrude: boolean
    homing_origin: number[]
    position: number[]
    gcode_position: number[]
  }
  toolhead: {
    homed_axes: string
    axis_minimum: number[]
    axis_maximum: number[]
    print_time: number
    stalls: number
    estimated_print_time: number
    extruder: string
    position: number[]
    max_velocity: number
    max_accel: number
    minimum_cruise_ratio: number
    square_corner_velocity: number
  }
  configfile: {
    config: Record<string, any>
    settings: Record<string, any>
    save_config_pending: boolean
    save_config_pending_items: Record<string, any>
    warnings: string[]
  }
  extruder: {
    temperature: number
    target: number
    power: number
    can_extrude: boolean
    pressure_advance: number
    smooth_time: number
    motion_queue: string | null
  }
  heater_bed: {
    temperature: number
    target: number
    power: number
  }
  fan: {
    speed: number
    rpm: number | null
  }
  idle_timeout: {
    state: IdleTimeoutState
    printing_time: number
  }
  virtual_sdcard: {
    file_path: string | null
    progress: number
    is_active: boolean
    file_position: number
    file_size: number
  }
  print_stats: {
    filename: string
    total_duration: number
    print_duration: number
    filament_used: number
    state: PrintState
    message: string
    info: {
      total_layer: number | null
      current_layer: number | null
    }
  }
  display_status: {
    message: string
    progress: number
  }
  temperature_sensor: {
    temperature: number
    measured_min_temp: number
    measured_max_temp: number
  }
  temperature_fan: {
    speed: number
    rpm: number | null
    temperature: number
    target: number
  }
  filament_switch_sensor: {
    filament_detected: false
    enabled: boolean
  }
  output_pin: {
    value: number
  }
  bed_mesh: {
    profile_name: string
    mesh_min: number[]
    mesh_max: number[]
    probed_matrix: number[][]
    mesh_matrix: number[][]
    profiles: Record<
      string,
      {
        mesh_params: {
          min_x: number
          max_x: number
          min_y: number
          max_y: number
          x_count: number
          y_count: number
          mesh_x_pos: number
          mesh_y_pos: number
          algo: string
          tension: number
        }
        points: number[][]
      }
    >
  }
  exclude_object: {
    object: {
      name: string
      polygon: [number, number][]
      center: [number, number]
    }[]
    excluded_object: string[]
    current_object: string | null
  }
  gcode_macro: {
    var_name: string
  }
  mcu: {
    mcu_version: string
    mcu_build_versions: string
    mcu_constants: Record<string, any>
  }
  stepper_enable: {
    steppers: Record<string, boolean>
  }
}

export type PrinterObjectQuery = {
  [K in keyof PrinterObjectTypes]?: null | readonly (keyof PrinterObjectTypes[K])[]
}

export type PrinterObjectQueryStatus<T extends PrinterObjectQuery> = {
  [K in keyof T & keyof PrinterObjectTypes]: T[K] extends null
    ? PrinterObjectTypes[K]
    : T[K] extends readonly (keyof PrinterObjectTypes[K])[]
      ? Pick<PrinterObjectTypes[K], T[K][number]>
      : never
}

export interface GetPrinterObjectsResp<T extends PrinterObjectQuery = PrinterObjectQuery> {
  result: {
    eventtime: number
    status: PrinterObjectQueryStatus<T>
  }
}

export interface GetMoonrakerInfoResp {
  result: {
    klippy_connected: boolean
    klippy_state: KlippyState
    components: string[]
    failed_components: string[]
    registered_directories: string[]
    warnings: string[]
    websocket_count: number
    moonraker_version: string
    missing_klippy_requirements: string[]
    api_version: [number, number, number]
    api_version_string: string
  }
}

export interface GetPrinterInfoResp {
  result: {
    state: KlippyState
    state_message: string
    hostname: string
    klipper_path: string
    python_path: string
    process_id: number
    user_id: number
    group_id: number
    log_file: string
    config_file: string
    software_version: string
    cpu_info: string
  }
}

export interface GetSystemInfoResp {
  result: {
    system_info: {
      python: {
        version: [number, number, number, 'alpha' | 'beta' | 'candidate' | 'final', number]
        version_string: string
      }
      product_info: {
        machine_type: string
        nozzle_diameter: number[]
        serial_number: string
        device_name: string
        firmware_version: string
        software_version: string
      }
      cpu_info: {
        cpu_count: number
        bits: string
        processor: string
        cpu_desc: string
        serial_number: string
        hardware_desc: string
        model: string
        total_memory: number | null
        memory_units: string
      }
      sd_info: {
        manufacturer_id: string
        manufacturer: string
        oem_id: string
        product_name: string
        product_revision: string
        serial_number: string
        manufacturer_date: string
        capacity: string
        total_bytes: number
      }
      distribution: {
        name: string
        id: string
        version: string
        version_parts: {
          major: string
          minor: string
          build_number: string
        }
        like: string
        codename: string
        release_info: Record<string, string>
        kernel_version: string
      }
      virtualization: {
        virt_type: string
        virt_identifier: string
      }
      network: Record<
        string,
        {
          mac_address: string
          ip_addresses: {
            family: 'ipv4' | 'ipv6'
            address: string
            is_link_local: boolean
          }[]
        }
      >
      canbus: Record<
        string,
        {
          tx_queue_len: number
          bitrate: number
          driver: string
        }
      >
      provider: 'none' | 'systemd_cli' | 'systemd_dbus' | 'supervisord_cli'
      available_services: string[]
      service_state: Record<
        string,
        {
          active_state: string
          sub_state: string
        }
      >
      instance_ids: {
        moonraker: string
        klipper: string
      }
    }
  }
}

interface BaseFileInfo {
  path: string
  modified: number
  size: number
  permissions: string
}

export interface ListAvailableFilesResp {
  result: BaseFileInfo[]
}

export interface ListRegisteredRootsResp {
  result: {
    name: string
    path: string
    permissions: string
  }[]
}

export interface DeleteFileResp {
  result: {
    item: BaseFileInfo & {
      root: string
    }
    action: 'delete_file'
  }
}
