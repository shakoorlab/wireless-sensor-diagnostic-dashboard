import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// third-party
import {
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  flexRender,
  useReactTable,
  sortingFns
} from '@tanstack/react-table';
import { compareItems, rankItem } from '@tanstack/match-sorter-utils';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, DebouncedInput, EmptyTable } from 'components/third-party/react-table';

// utils import (for column headers)
import { hours12amTo12pm } from '../../../../utils/tables/hours';

// hooks import
import { useHourlyStatus } from '../../../../hooks/useSelectedFieldMetrics';

// ==============================|| REACT TABLE - FILTERING ||============================== //
export const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta(itemRank);
  return itemRank.passed;
};

export const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(rowA.columnFiltersMeta[columnId], rowB.columnFiltersMeta[columnId]);
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

// ==============================|| REACT TABLE ||============================== //
function ReactTable({ columns, data }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [slot, setSlot] = useState('hour');
  const [quantity, setQuantity] = useState('By volume');

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter
  });

  // extract headers for CSVExport
  const headers = table.getAllColumns().map((col) => ({
    label: typeof col.columnDef.header === 'string' ? col.columnDef.header : '#',
    key: col.columnDef.accessorKey
  }));

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
        <DebouncedInput
          value={globalFilter}
          onFilterChange={(v) => setGlobalFilter(String(v))}
          placeholder={`Search ${data.length} sensors...`}
        />
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2 }}>
          <Select value={quantity} onChange={(e) => setQuantity(e.target.value)} size="small" sx={{ minWidth: 120 }}>
            <MenuItem value="By volume">Sensor Head</MenuItem>
            <MenuItem value="By margin">Soil Probes</MenuItem>
          </Select>
          <ToggleButtonGroup exclusive value={slot} onChange={(e, v) => v && setSlot(v)} size="small">
            <ToggleButton disabled={slot === 'hour'} value="hour">
              Hour
            </ToggleButton>
            <ToggleButton disabled={slot === 'day'} value="day">
              Day
            </ToggleButton>
            <ToggleButton disabled={slot === 'week'} value="week">
              Week
            </ToggleButton>
            <ToggleButton disabled={slot === 'month'} value="month">
              Month
            </ToggleButton>
          </ToggleButtonGroup>
          <CSVExport data={table.getRowModel().rows.map((d) => d.original)} headers={headers} filename="hourly.csv" />
        </Stack>
      </Stack>
      <ScrollX>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ whiteSpace: 'nowrap' }}>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableCell key={h.id} {...h.column.columnDef.meta}>
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} sx={{ border: '0.5px solid lightgrey' }} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} sx={{ border: '1px solid black' }}>
                    <EmptyTable msg="No Data" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              {table.getFooterGroups().map((fg) => (
                <TableRow key={fg.id}>
                  {fg.headers.map((f) => (
                    <TableCell key={f.id} {...f.column.columnDef.meta}>
                      {f.isPlaceholder ? null : flexRender(f.column.columnDef.header, f.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| REACT TABLE - Hourly ||============================== //
export default function HourlyTable() {
  // 1) fetch the table data
  const { data, error } = useHourlyStatus(23);
  const tableData = useMemo(() => data ?? [], [data]);

  // ─── moved columns hook *above* the returns ─────────────────────────────
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
      if (val === 'Reported') {
        return <Chip color="success" label="Reported" size="small" variant="light" />;
      }
      if (val === 'Pending') {
        return <Chip color="info" label="Pending" size="small" variant="light" />;
      }
      return <Chip color="error" label="No Data" size="small" variant="light" />;
    }
  }));
  const columns = useMemo(() => [nameColumn, ...hourColumns], [nameColumn, hourColumns]);

  // 2) loading / error states
  if (!data && !error) {
    return (
      <MainCard content={false}>
        <Typography>Loading hourly data…</Typography>
      </MainCard>
    );
  }
  if (error) {
    return (
      <MainCard content={false}>
        <Typography color="error">Failed to load hourly data</Typography>
      </MainCard>
    );
  }

  // 3) render the table with the live data
  return <ReactTable data={tableData} columns={columns} />;
}
