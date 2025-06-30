// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

// project import
import MainCard from 'components/MainCard';
import HourlyTable from 'components/tables/Hourly';

import UserActivity from 'sections/widget/data/UserActivity';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import ApexPieChart from 'sections/charts/apexchart/ApexPieChart';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} xl={4}>
          <MainCard title="% Reporting (75 total)">
            <ApexPieChart />
          </MainCard>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <UserActivity />
        </Grid>
      </Grid>
      <br />
      <MainCard title="Sensor Data Reporting">
        <Typography variant="body2">
          The Wireless Sensor Network and its sensors report data every hour to the <strong>nearest PheNode tower</strong>, and then to{' '}
          <strong>the cloud</strong>. The backend for this dashboard checks <strong>5-10 minutes after the hour</strong> has passed to allow
          for latency. If{' '}
          <Chip
            label="No Data"
            color="error"
            size="small"
            sx={{
              height: 'auto', // let it size to the font
              // fontWeight: 'bold',
              backgroundColor: 'error.light',
              verticalAlign: 'middle',
              mx: 0.5 // small horizontal gap
            }}
          />{' '}
          is reported once, it probably is okay. If{' '}
          <Chip
            label="No Data"
            color="error"
            size="small"
            sx={{
              height: 'auto', // let it size to the font
              // fontWeight: 'bold',
              verticalAlign: 'middle',
              backgroundColor: 'error.light',
              color: 'red.light',
              mx: 0.5 // small horizontal gap
            }}
          />{' '}
          is reported multiple hours in a row, then best to check the sensor. The table below shows the <strong>hourly data</strong> for the
          last 23 hours.
        </Typography>
      </MainCard>
      <br />
      <HourlyTable />
      <br />
      <br />
      <Typography variant="h2">Sensor Signal Strength</Typography>
      <br />
      <Grid item xs={12} md={7} lg={8}>
        <MainCard title="RSSI vs SNR">
          <Typography variant="body2">
            <strong>RSSI Received Signal Strength Indicator (RSSI)</strong> is a measurement of the power present in a received radio
            signal. The RSSI is indicated by a negative dBm value. This value relates to the signal strength of the cellular signal from the
            tower to the modem. The higher the number, the better the signal (-70 dBm is excellent, -110dBm no signal).
            <br />
            <br />
            <strong>SNR Signal-to-noise ratio (SNR or S/N)</strong> is a measure of how much useful signal there is compared to background
            noise. The higher the SNR value, the better the output. The reason is that there’s more useful information (signal) than
            unwanted data (noise) in a high SNR output. For instance, an SNR of 100 dB is better than 70 dB.
          </Typography>
        </MainCard>
        <br />
        <UniqueVisitorCard />
      </Grid>
    </div>
  );
}
