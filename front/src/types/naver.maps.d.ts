// front/src/types/naver.maps.d.ts

declare namespace naver {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement | string, mapOptions?: MapOptions);
      getCenter(): LatLng;
      setCenter(latlng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number, effect?: boolean): void;
      getZoom(): number;
      setMapTypeId(mapTypeId: string): void;
      getMapTypeId(): string;
      setOptions(options: MapOptions): void;
      getOptions(key?: string): any;
      panTo(latlng: LatLng | LatLngLiteral, transitionOptions?: TransitionOptions): void;
      panBy(offset: Point | PointLiteral): void;
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, margin?: number | LatLngBoundsLiteral): void;
      getBounds(): LatLngBounds;
      getProjection(): Projection;
      getService(): Service;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      minZoom?: number;
      maxZoom?: number;
      mapTypeId?: string;
      disableKineticPan?: boolean;
      disableDoubleClickZoom?: boolean;
      disableTwoFingerZoom?: boolean;
      disableZoom?: boolean;
      draggable?: boolean;
      pinchZoom?: boolean;
      scrollWheel?: boolean;
      keyboardShortcuts?: boolean;
      mapDataControl?: boolean;
      scaleControl?: boolean;
      zoomControl?: boolean;
      logoControl?: boolean;
      mapTypeControl?: boolean;
      tileTransition?: boolean;
      size?: Size | SizeLiteral;
      bounds?: LatLngBounds | LatLngBoundsLiteral;
      padding?: number | LatLngBoundsLiteral;
      mapTypeControlOptions?: MapTypeControlOptions;
      zoomControlOptions?: ZoomControlOptions;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
      equals(other: LatLng | LatLngLiteral): boolean;
      toString(): string;
      toPoint(): Point;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor(southWest: LatLng | LatLngLiteral, northEast: LatLng | LatLngLiteral);
      isEmpty(): boolean;
      getCenter(): LatLng;
      getSouthWest(): LatLng;
      getNorthEast(): LatLng;
      getNorthWest(): LatLng;
      getSouthEast(): LatLng;
      equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      contains(latlng: LatLng | LatLngLiteral): boolean;
      intersects(bounds: LatLngBounds | LatLngBoundsLiteral): boolean;
      union(bounds: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
      toUrlValue(precision?: number): string;
      toString(): string;
    }

    interface LatLngBoundsLiteral {
      south: number;
      west: number;
      north: number;
      east: number;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
      equals(other: Point | PointLiteral): boolean;
      toString(): string;
    }

    interface PointLiteral {
      x: number;
      y: number;
    }

    class Size {
      constructor(width: number, height: number);
      width: number;
      height: number;
      equals(other: Size | SizeLiteral): boolean;
      toString(): string;
    }

    interface SizeLiteral {
      width: number;
      height: number;
    }

    namespace Event {
      function addListener(instance: any, eventName: string, listener: Function): any;
      function removeListener(listener: any): void;
      function once(instance: any, eventName: string, listener: Function): any;
      function trigger(instance: any, eventName: string, eventObject?: any): void;
    }

    namespace Service {
      function reverseGeocode(options: ReverseGeocodeOptions, callback: (status: Status, response: ReverseGeocodeResponse) => void): void;

      interface ReverseGeocodeOptions {
        coords: LatLng | LatLngLiteral;
        orders?: string[];
        output?: string;
      }

      enum Status {
        OK = 'OK',
        ERROR = 'ERROR',
        INVALID_REQUEST = 'INVALID_REQUEST',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        ZERO_RESULT = 'ZERO_RESULT',
      }

      enum Order {
        ROAD_ADDR = 'roadaddr',
        ADDR = 'addr',
      }

      interface ReverseGeocodeResponse {
        status: {
          code: number;
          name: string;
          message: string;
        };
        v2: {
          address: {
            roadAddress: string;
            jibunAddress: string;
            englishAddress: string;
            addressElements: Array<{
              name: string;
              code: string;
              type: string;
            }>;
          };
          // ... other properties if needed
        };
      }
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPosition(position: LatLng | LatLngLiteral): void;
      getPosition(): LatLng;
      setOptions(options: MarkerOptions): void;
      getOptions(key?: string): any;
      setDraggable(draggable: boolean): void;
      getDraggable(): boolean;
      setVisible(visible: boolean): void;
      getVisible(): boolean;
      setZIndex(zIndex: number): void;
      getZIndex(): number;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map | null;
      icon?: string | ImageIcon | SymbolIcon | HtmlIcon;
      shape?: MarkerShape;
      title?: string;
      cursor?: string;
      clickable?: boolean;
      draggable?: boolean;
      animation?: Animation;
      zIndex?: number;
    }

    interface ImageIcon {
      url: string;
      size?: Size | SizeLiteral;
      scaledSize?: Size | SizeLiteral;
      origin?: Point | PointLiteral;
      anchor?: Point | PointLiteral;
    }

    interface SymbolIcon {
      path: string;
      size?: Size | SizeLiteral;
      anchor?: Point | PointLiteral;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      rotation?: number;
    }

    interface HtmlIcon {
      content: string | HTMLElement;
      size?: Size | SizeLiteral;
      anchor?: Point | PointLiteral;
    }

    interface MarkerShape {
      coords: number[];
      type: string;
    }

    enum Animation {
      NONE = 0,
      BOUNCE = 1,
      DROP = 2,
    }

    interface MapTypeControlOptions {
      position?: ControlPosition;
      style?: MapTypeControlStyle;
    }

    enum MapTypeControlStyle {
      BUTTON = 0,
      DROPDOWN = 1,
    }

    interface ZoomControlOptions {
      position?: ControlPosition;
      style?: ZoomControlStyle;
    }

    enum ZoomControlStyle {
      SMALL = 0,
      LARGE = 1,
    }

    enum ControlPosition {
      TOP_LEFT = 0,
      TOP_CENTER = 1,
      TOP_RIGHT = 2,
      LEFT_TOP = 3,
      LEFT_CENTER = 4,
      LEFT_BOTTOM = 5,
      RIGHT_TOP = 6,
      RIGHT_CENTER = 7,
      RIGHT_BOTTOM = 8,
      BOTTOM_LEFT = 9,
      BOTTOM_CENTER = 10,
      BOTTOM_RIGHT = 11,
    }

    class Projection {
      fromLatLngToPoint(latlng: LatLng): Point;
      fromPointToLatLng(point: Point): LatLng;
    }
  }
}
