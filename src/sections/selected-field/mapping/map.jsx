// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

// project-import
import MainCard from 'components/MainCard';
import MapContainerStyled from 'components/third-party/map/MapContainerStyled';

import { ThemeMode } from 'config';
import { countries } from 'data/location';
import SensorMapping from './SensorMapping';

const MAPBOX_THEMES = {
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  streets: 'mapbox://styles/mapbox/streets-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11'
};

const mapConfiguration = {
  mapboxAccessToken: import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN,
  minZoom: 1
};

// ==============================|| MAP ||============================== //

export default function Map() {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <MainCard title="Markers & Popups">
          <MapContainerStyled>
            <SensorMapping
              {...mapConfiguration}
              data={countries}
              mapStyle={theme.palette.mode === ThemeMode.DARK ? MAPBOX_THEMES.dark : MAPBOX_THEMES.light}
            />
          </MapContainerStyled>
        </MainCard>
      </Grid>
    </Grid>
  );
}
