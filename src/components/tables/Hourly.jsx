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
import makeData from 'data/react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, DebouncedInput, EmptyTable } from 'components/third-party/react-table';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

export const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0;

  // only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(rowA.columnFiltersMeta[columnId], rowB.columnFiltersMeta[columnId]);
  }

  // provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter
  });

  let headers = [];
  table.getAllColumns().map((columns) =>
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      // @ts-ignore
      key: columns.columnDef.accessorKey
    })
  );

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 2 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} sensors...`}
        />
        <CSVExport {...{ data: table.getRowModel().rows.map((d) => d.original), headers, filename: 'filtering.csv' }} />
      </Stack>

      <ScrollX>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ minWidth: 120, whiteSpace: 'nowrap' }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell
                        sx={{
                          border: '0.5px solid lightgrey'
                        }}
                        key={cell.id}
                        {...cell.column.columnDef.meta}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    sx={{
                      border: '1px solid black'
                    }}
                    colSpan={table.getAllColumns().length}
                  >
                    <EmptyTable msg="No Data" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((footer) => (
                    <TableCell key={footer.id} {...footer.column.columnDef.meta}>
                      {footer.isPlaceholder ? null : flexRender(footer.column.columnDef.header, footer.getContext())}
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

// ==============================|| REACT TABLE - FILTERING ||============================== //

import { hours12amTo12pm } from '../../utils/tables/hours';
import { mockHourlyData } from '../../data/mockHourlyData';

export default function HourlyTable() {
  const data = useMemo(() => mockHourlyData, []);

  // ──► build Name column
  const nameColumn = {
    header: 'Name',
    footer: 'Name',
    accessorKey: 'name',
    meta: {
      style: {
        position: 'sticky',
        left: 0, // pin to the viewport’s left
        zIndex: 100, // be above scrolling cells (body)
        minWidth: 140,
        background: '#F8F8F8' /* inherit lets MUI use the default table colours */
      }
    }
  };

  // ──► build 12 AM --> 12 PM hour columns
  const hourColumns = hours12amTo12pm.map((label, idx) => ({
    header: label,
    footer: label,
    accessorKey: `h${idx.toString().padStart(2, '0')}`,
    meta: { style: { minWidth: 100 } },
    cell: ({ getValue }) => {
      const val = getValue();
      return val === 'Reported' ? (
        <Chip color="success" label="Reported" size="small" variant="light" />
      ) : (
        <Chip color="error" label="No Data" size="small" variant="light" />
      );
    }
  }));

  const columns = useMemo(() => [nameColumn, ...hourColumns], []);
  return <ReactTable {...{ data, columns }} />;
}

ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array };
