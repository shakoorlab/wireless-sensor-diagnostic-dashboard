import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SignalStrengthChart from './SignalStrengthChart';

// assets
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';

export default function SignalOverviewCard() {
  const theme = useTheme();
  const [slot, setSlot] = useState('week');
  const [quantity, setQuantity] = useState('By volume');

  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const handleChange = (event, newAlignment) => {
    if (newAlignment) setSlot(newAlignment);
  };

  return (
    <MainCard content={false} sx={{ mt: 1.5 }}>
      <Grid item>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Stack sx={{ ml: { xs: 0, sm: 2 }, mt: 3 }} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              <Stack direction="row" alignItems="center">
                <CaretDownOutlined style={{ color: theme.palette.error.main, paddingRight: '4px' }} />
                <Typography color="error.main">$1,12,900 (45.67%)</Typography>
              </Stack>
              <Typography color="text.secondary" sx={{ display: 'block' }}>
                Compare to : 01 Dec 2021-08 Jan 2022
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent={{ xs: 'center', sm: 'flex-end' }}
              sx={{ mt: 3, mr: { xs: 0, sm: 2 } }}
            >
              <Select value={quantity} onChange={handleQuantity} size="small" sx={{ minWidth: 120 }}>
                <MenuItem value="By volume">WS-83da7fe9</MenuItem>
                <MenuItem value="By margin">WS-f8c5a6ee</MenuItem>
                <MenuItem value="By margin">WS-aca04ce2</MenuItem>
              </Select>
              <Select value={quantity} onChange={handleQuantity} size="small">
                <MenuItem value="By volume">By RSSI</MenuItem>
                <MenuItem value="By margin">By SNR</MenuItem>
              </Select>
              <ToggleButtonGroup exclusive onChange={handleChange} size="small" value={slot}>
                <ToggleButton disabled={slot === 'hour'} value="hour" sx={{ px: 2, py: 0.5 }}>
                  Hour
                </ToggleButton>
                <ToggleButton disabled={slot === 'day'} value="day" sx={{ px: 2, py: 0.5 }}>
                  Day
                </ToggleButton>
                <ToggleButton disabled={slot === 'week'} value="week" sx={{ px: 2, py: 0.5 }}>
                  Week
                </ToggleButton>
                <ToggleButton disabled={slot === 'month'} value="month" sx={{ px: 2, py: 0.5 }}>
                  Month
                </ToggleButton>
              </ToggleButtonGroup>
              <IconButton size="small" sx={{ border: `1px solid`, borderColor: ' grey.400', '&:hover': { bgcolor: 'transparent' } }}>
                <DownloadOutlined style={{ color: theme.palette.grey[900] }} />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Box width={1} sx={{ pt: 1 }}>
        <SignalStrengthChart slot={slot} quantity={quantity} />
      </Box>
    </MainCard>
  );
}
