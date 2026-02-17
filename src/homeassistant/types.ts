export interface HALightState {
  entity_id: string;
  state: 'on' | 'off' | 'unavailable';
  attributes: {
    brightness?: number;
    hs_color?: [number, number];
    color_mode?: string;
    supported_color_modes?: string[];
    friendly_name?: string;
  };
}

export interface HAInputBooleanState {
  entity_id: string;
  state: 'on' | 'off' | 'unavailable';
  attributes: {
    friendly_name?: string;
  };
}

export interface HAServiceData {
  entity_id: string;
  brightness?: number;
  hs_color?: [number, number];
  transition?: number;
}

export interface HAErrorResponse {
  message?: string;
}

export interface HAInputSelectState {
  entity_id: string;
  state: string;
  attributes: {
    options?: string[];
    friendly_name?: string;
  };
}
