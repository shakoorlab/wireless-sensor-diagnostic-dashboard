// components/Weekly.jsx
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import { daysSunToSat } from 'utils/tables/days';
import { useWeeklyStatus } from '../../../../hooks/useSelectedFieldMetrics';

const TZ = 'America/Chicago';
const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

function formatShortMonthDay(d) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, month: 'short', day: 'numeric' }).formatToParts(d);
  const m = parts.find((p) => p.type === 'month').value;
  const day = Number(parts.find((p) => p.type === 'day').value);
  return `${m} ${ordinal(day)}`;
}

export default function Weekly({ Table }) {
  const { rows, meta, isLoading, error } = useWeeklyStatus(TZ);

  // ✅ Define the name column fully and give it an id
  const nameColumn = {
    id: 'name',
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

  // ✅ Give each day column an explicit id (React Table v8 likes this when headers can be non-strings)
  const dayColumns = daysSunToSat.map((label, idx) => ({
    id: `d${idx.toString().padStart(2, '0')}`,
    header: label, // string header is fine
    footer: label,
    accessorKey: `d${idx.toString().padStart(2, '0')}`, // value: number or 'Pending'
    meta: { style: { minWidth: 120 } },
    cell: ({ getValue }) => {
      const val = getValue();
      if (val === 'Pending') return <Chip color="info" label="Pending" size="small" variant="light" />;
      if (typeof val !== 'number') return null;
      if (val === 0) return <Chip color="error" label="No Data" size="small" variant="light" />;
      if (val <= 8) return <Chip color="error" label={`Reported(${val})`} size="small" variant="light" />;
      if (val <= 16) return <Chip color="warning" label={`Reported(${val})`} size="small" variant="light" />;
      return <Chip color="success" label={`Reported(${val})`} size="small" variant="light" />;
    }
  }));

  const columns = useMemo(() => [nameColumn, ...dayColumns], []); // static labels → empty deps ok
  const tableData = useMemo(() => rows ?? [], [rows]);

  const title = useMemo(() => {
    if (meta?.weekStartUtc && meta?.weekEndUtc) {
      const start = new Date(meta.weekStartUtc);
      const endExcl = new Date(meta.weekEndUtc);
      const end = new Date(endExcl.getTime() - 24 * 3600 * 1000); // Saturday
      return `${formatShortMonthDay(start)} – ${formatShortMonthDay(end)}`;
    }
    // lightweight fallback
    const now = new Date();
    const weekdayShort = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }).format(now);
    const idx = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[weekdayShort] ?? 0;
    const startLocalMs = now.getTime() - idx * 24 * 3600 * 1000;
    const endLocalMs = now.getTime() + (6 - idx) * 24 * 3600 * 1000;
    return `${formatShortMonthDay(new Date(startLocalMs))} – ${formatShortMonthDay(new Date(endLocalMs))}`;
  }, [meta]);

  return <Table columns={columns} data={tableData} loading={isLoading} error={error} filename="weekly" title={title} />;
}

Weekly.propTypes = { Table: PropTypes.func.isRequired };
