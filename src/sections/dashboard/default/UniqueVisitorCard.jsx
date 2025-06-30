import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Link from '@mui/material/Link';

// project import
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard() {
  const [view, setView] = useState('monthly'); // 'monthly' or 'weekly'

  return (
    <>
      {/* <Grid container alignItems="center" justifyContent="space-between"> */}
      <MainCard
        title="Signal Strength"
        content={false}
        secondary={
          <Stack direction="row" alignItems="center" spacing={0}>
            <Button
              size="small"
              onClick={() => setView('hourly')}
              color={view === 'hourly' ? 'primary' : 'secondary'}
              variant={view === 'hourly' ? 'outlined' : 'text'}
            >
              Hour
            </Button>
            <Button
              size="small"
              onClick={() => setView('daily')}
              color={view === 'daily' ? 'primary' : 'secondary'}
              variant={view === 'daily' ? 'outlined' : 'text'}
            >
              Day
            </Button>
            <Button
              size="small"
              onClick={() => setView('weekly')}
              color={view === 'weekly' ? 'primary' : 'secondary'}
              variant={view === 'weekly' ? 'outlined' : 'text'}
            >
              Week
            </Button>
            <Button
              size="small"
              onClick={() => setView('monthly')}
              color={view === 'monthly' ? 'primary' : 'secondary'}
              variant={view === 'monthly' ? 'outlined' : 'text'}
            >
              Month
            </Button>
          </Stack>
        }
      ></MainCard>
      {/* </Grid> */}

      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart view={view} />
        </Box>
      </MainCard>
    </>
  );
}
