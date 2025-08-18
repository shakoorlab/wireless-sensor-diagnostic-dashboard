// components/Hourly.jsx
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Chip from '@mui/material/Chip';

// project/utils
import { hours12amTo12pm } from 'utils/tables/hours';

// hooks
import { useHourlyStatus } from 'hooks/useSelectedFieldMetrics';

const TZ = 'America/Chicago';
const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

function dailyTitle() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    month: 'long',
    day: 'numeric'
  }).formatToParts(now);
  const month = parts.find((p) => p.type === 'month').value;
  const day = Number(parts.find((p) => p.type === 'day').value);
  return `${month} ${ordinal(day)}`;
}

export default function Daily({ Table }) {
  // 1) fetch the table data
  const { data, error } = useHourlyStatus(23);
  const tableData = useMemo(() => data ?? [], [data]);

  // 2) define columns (name + 24 hours)
  const nameColumn = {
    header: 'Name',
    footer: 'Name',
    accessorKey: 'name',
    meta: {
      style: {
        position: 'sticky',
        left: 0,
        zIndex: 100,
        minWidth: 140,
        background: '#F8F8F8'
      }
    }
  };

  const hourColumns = hours12amTo12pm.map((label, idx) => ({
    header: label,
    footer: label,
    accessorKey: `h${idx.toString().padStart(2, '0')}`,
    meta: { style: { minWidth: 100 } },
    cell: ({ getValue }) => {
      const val = getValue();
      if (val === 'Reported') return <Chip color="success" label="Reported" size="small" variant="light" />;
      if (val === 'Pending') return <Chip color="info" label="Pending" size="small" variant="light" />;
      return <Chip color="error" label="No Data" size="small" variant="light" />;
    }
  }));

  const columns = useMemo(() => [nameColumn, ...hourColumns], []); // column objects are stable

  // 3) render via the shared scaffold
  const loading = !data && !error;
  return <Table columns={columns} data={tableData} loading={loading} error={error} title={dailyTitle()} filename="hourly" />;
}

Daily.propTypes = {
  Table: PropTypes.func.isRequired
};
