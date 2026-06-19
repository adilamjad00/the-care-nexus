'use client';

import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  className?: string;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  viewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  onMove?: (e: any) => void;
  onClick?: (e: any) => void;
  interactive?: boolean;
  children?: React.ReactNode;
}

export default function CustomMap({
  className,
  initialViewState,
  viewState,
  onMove,
  onClick,
  interactive = true,
  children,
}: MapProps) {
  const defaultInitial = {
    longitude: 73.0479, // Islamabad
    latitude: 33.6844,
    zoom: 12,
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Map
        {...(viewState
          ? {
              longitude: viewState.longitude,
              latitude: viewState.latitude,
              zoom: viewState.zoom,
            }
          : {
              initialViewState: initialViewState || defaultInitial,
            })}
        onMove={onMove}
        style={{ width: '100%', height: '100%', minHeight: '300px' }}
        mapStyle='https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
        onClick={onClick}
        interactive={interactive}
        attributionControl={false}
      >
        {children}
      </Map>
    </div>
  );
}

export { Marker };
