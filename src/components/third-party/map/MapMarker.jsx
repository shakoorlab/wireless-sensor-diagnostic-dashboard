// src/components/MapMarker.jsx
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import sensorPin from 'assets/images/icons/ws.svg';
import { Marker } from 'react-map-gl/mapbox';

export default function MapMarker({ longitude, latitude, size = 24, label, onClick }) {
  return (
    <Marker longitude={longitude} latitude={latitude} onClick={onClick}>
      <Tooltip title={label} placement="top" arrow>
        <Box
          component="img"
          src={sensorPin}
          alt={label}
          sx={{
            width: size,
            height: size,
            cursor: 'pointer',
            transform: `translate(${-size / 2}px,${-size}px)`
          }}
        />
      </Tooltip>
    </Marker>
  );
}

MapMarker.propTypes = {
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  size: PropTypes.number,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
