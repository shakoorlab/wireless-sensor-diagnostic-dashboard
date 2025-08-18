// components/TableFrame.jsx
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
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
import Box from '@mui/material/Box';

// react-table
import {
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  flexRender,
  useReactTable
} from '@tanstack/react-table';
import { compareItems, rankItem } from '@tanstack/match-sorter-utils';

// project imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, DebouncedInput, EmptyTable } from 'components/third-party/react-table';

// ==============================|| shared fuzzy filter/sort ||============================== //
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
  // fallback to alphanumeric
  return dir === 0 ? (String(rowA.getValue(columnId)) ?? '').localeCompare(String(rowB.getValue(columnId)) ?? '') : dir;
};

// ==============================|| INTERNAL: Reusable Table Scaffold ||============================== //
// This component contains ALL table logic, toolbar (search/select/CSV), and markup.
// Views (Hourly/Weekly/Monthly) only need to pass {columns, data, loading, error}.
function TableScaffold({
  columns,
  data,
  loading,
  error,
  quantityOptions,
  extraToolbar, // e.g., the Hourly/Weekly/Monthly ToggleButtonGroup from TableFrame
  filename = 'table',
  title //  title to display in the center of the toolbar
}) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [quantity, setQuantity] = useState(quantityOptions?.[0]?.value ?? '');

  const safeColumns = useMemo(() => columns ?? [], [columns]);
  const safeData = useMemo(() => data ?? [], [data]);

  const table = useReactTable({
    data: safeData,
    columns: safeColumns,
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

  const headers = table.getAllColumns().map((col) => ({
    label: typeof col.columnDef.header === 'string' ? col.columnDef.header : '#',
    key: col.columnDef.accessorKey
  }));

  if (loading) {
    return (
      <MainCard content={false}>
        <Typography sx={{ p: 2 }}>Loading data…</Typography>
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard content={false}>
        <Typography sx={{ p: 2 }} color="error">
          Failed to load data
        </Typography>
      </MainCard>
    );
  }

  return (
    <MainCard content={false}>
      {/* Toolbar: Left (search) | Center (title) | Right (controls) */}
      <Stack direction="row" alignItems="center" sx={{ p: 2, gap: 2 }}>
        {/* Left */}
        <Box sx={{ flex: 1, minWidth: 260 }}>
          <DebouncedInput
            value={globalFilter}
            onFilterChange={(v) => setGlobalFilter(String(v))}
            placeholder={`Search ${safeData.length} items…`}
          />
        </Box>
        {/* Center */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          {title ? (
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          ) : null}
        </Box>
        {/* Right */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, justifyContent: 'flex-end' }}>
          {quantityOptions && quantityOptions.length > 0 && (
            <Select value={quantity} onChange={(e) => setQuantity(e.target.value)} size="small" sx={{ minWidth: 140 }}>
              {quantityOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          )}
          {extraToolbar}
          <CSVExport data={table.getRowModel().rows.map((d) => d.original)} headers={headers} filename={`${filename}.csv`} />
        </Stack>
      </Stack>
      {/* Table */}
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

TableScaffold.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.any,
  extraToolbar: PropTypes.node,
  filename: PropTypes.string,
  title: PropTypes.node,
  quantityOptions: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired }))
};

// ==============================|| TABLE FRAME (public) ||============================== //
// `views` is a map of slots -> Component. Each Component receives a prop `Table` and must render:
//   <Table columns={...} data={...} loading={...} error={...} filename="hourly" />
export default function TableFrame({
  views,
  defaultView = 'hour'
  // uncomment code below too if you want to use the dropdown menu again
  //   quantityOptions = [
  //     { value: 'head', label: 'Sensor Head' },
  //     { value: 'probes', label: 'Soil Probes' }
  //   ]
}) {
  const [slot, setSlot] = useState(defaultView);
  const ViewComponent = views?.[slot];

  const toggleButtons = (
    <ToggleButtonGroup exclusive value={slot} onChange={(e, v) => v && setSlot(v)} size="small">
      <ToggleButton value="hour">Daily</ToggleButton>
      <ToggleButton value="week">Weekly</ToggleButton>
      <ToggleButton value="month">Monthly</ToggleButton>
    </ToggleButtonGroup>
  );

  if (!ViewComponent) {
    return (
      <MainCard content={false}>
        <Typography sx={{ p: 2 }}>No view registered for “{slot}”.</Typography>
      </MainCard>
    );
  }

  // Pass the scaffold as a prop for the view to use
  return <ViewComponent Table={(props) => <TableScaffold {...props} extraToolbar={toggleButtons} />} />;
  //   uncomment the code below if you want to use the dropdown menu again
  //   return <ViewComponent Table={(props) => <TableScaffold {...props} extraToolbar={toggleButtons} quantityOptions={quantityOptions} />} />;
}

TableFrame.propTypes = {
  views: PropTypes.object.isRequired,
  defaultView: PropTypes.oneOf(['hour', 'week', 'month']),
  quantityOptions: PropTypes.array
};
