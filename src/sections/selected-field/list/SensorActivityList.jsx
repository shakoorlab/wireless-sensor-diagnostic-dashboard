import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// assets
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';

import Avatar1 from 'assets/images/icons/ws.svg';
import Avatar2 from 'assets/images/icons/ws.svg';
import Avatar3 from 'assets/images/icons/ws.svg';

// ===========================|| DATA WIDGET - USER ACTIVITY CARD ||=========================== //

export default function SensorActivityList() {
  const iconSX = {
    fontSize: '0.675rem'
  };

  return (
    <MainCard
      title="Sensor Activity"
      content={false}
      secondary={
        <Link component={RouterLink} to="#" color="primary">
          View all
        </Link>
      }
    >
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Badge
                  variant="dot"
                  overlap="circular"
                  color="error"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                >
                  <Avatar alt="image" src={Avatar1} variant="square" />
                </Badge>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography variant="subtitle1">WS-2a5a9ed1</Typography>
                <Typography variant="caption" color="secondary">
                  Has not reported in 4 hours.
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" color="secondary">
                    now
                  </Typography>
                  <ClockCircleOutlined style={iconSX} />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ position: 'relative' }}>
                  <Badge
                    variant="dot"
                    overlap="circular"
                    color="warning"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                  >
                    <Avatar alt="image" src={Avatar2} variant="square" />
                  </Badge>
                </Box>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography variant="subtitle1">WS-ef106a9f</Typography>
                <Typography variant="caption" color="secondary">
                  Has not reported in 6 hours.
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" color="secondary">
                    2 min ago
                  </Typography>
                  <ClockCircleOutlined style={iconSX} />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ position: 'relative' }}>
                  <Badge
                    variant="dot"
                    overlap="circular"
                    color="error"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                  >
                    <Avatar alt="image" src={Avatar3} variant="square" />
                  </Badge>
                </Box>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography variant="subtitle1">WS-23791212</Typography>
                <Typography variant="caption" color="secondary">
                  Has not reported in 2 hours.
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" color="secondary">
                    1 day ago
                  </Typography>
                  <ClockCircleOutlined style={iconSX} />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ position: 'relative' }}>
                  <Badge
                    variant="dot"
                    overlap="circular"
                    color="warning"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                  >
                    <Avatar alt="image" src={Avatar1} variant="square" />
                  </Badge>
                </Box>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography variant="subtitle1">WS-730abc75</Typography>
                <Typography variant="caption" color="secondary">
                  Has not reported in 3 hours.
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" color="secondary">
                    3 week ago
                  </Typography>
                  <ClockCircleOutlined style={iconSX} />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
