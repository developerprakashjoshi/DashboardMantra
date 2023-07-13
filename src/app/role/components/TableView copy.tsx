import { useState, useMemo } from 'react';
import { sortRows, filterRows, paginateRows } from './Helpers';
import Pagination from './Pagination';



interface Sort {
  order: 'asc' | 'desc';
  orderBy: string;
}


const rows: any[] = [
  {
    id: 1,
    name: "Liz Lemon",
    age: 36,
    is_manager: true,
    start_date: "02-28-1999",
  },
  {
    id: 2,
    name: "Jack Donaghy",
    age: 40,
    is_manager: true,
    start_date: "03-05-1997",
  },
  {
    id: 3,
    name: "Tracy Morgan",
    age: 39,
    is_manager: false,
    start_date: "07-12-2002",
  },
  {
    id: 4,
    name: "Jenna Maroney",
    age: 40,
    is_manager: false,
    start_date: "02-28-1999",
  },
  {
    id: 5,
    name: "Kenneth Parcell",
    age: Infinity,
    is_manager: false,
    start_date: "01-01-1970",
  },
  {
    id: 6,
    name: "Pete Hornberger",
    age: null,
    is_manager: true,
    start_date: "04-01-2000",
  },
  {
    id: 7,
    name: "Frank Rossitano",
    age: 36,
    is_manager: false,
    start_date: null,
  },
  { id: 8, name: null, age: null, is_manager: null, start_date: null },
];

const columns: any[] = [
  { accessor: "name", label: "Name" },
  { accessor: "age", label: "Age" },
  {
    accessor: "is_manager",
    label: "Manager",
    format: (value: any) => (value ? "✔️" : "✖️"),
  },
  { accessor: "start_date", label: "Start Date" },
];

const Table = () => {
  const [activePage, setActivePage] = useState(1);
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [sort, setSort] = useState<Sort>({ order: 'asc', orderBy: 'id' });
  const rowsPerPage = 3;

  const filteredRows = useMemo(() => filterRows(rows, filters), [filters]);
  const sortedRows = useMemo(() => sortRows(filteredRows, sort), [filteredRows, sort]);
  const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage);

  const count = filteredRows.length;
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleSearch = (value: any, accessor: string) => {
    setActivePage(1);

    if (value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [accessor]: value,
      }));
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        delete updatedFilters[accessor];

        return updatedFilters;
      });
    }
  };

  const handleSort = (accessor: string) => {
    setActivePage(1);
    setSort((prevSort) => ({
      order: prevSort.order === 'asc' && prevSort.orderBy === accessor ? 'desc' : 'asc',
      orderBy: accessor,
    }));
  };

  const clearAll = () => {
    setSort({ order: 'asc', orderBy: 'id' });
    setActivePage(1);
    setFilters({});
  };

  return (
   <>
      <table className="w-full bg-white border border-gray-200 table-auto">
        <thead>
          <tr>
            {columns.map((column) => {
              const sortIcon = () => {
                if (column.accessor === sort.orderBy) {
                  if (sort.order === 'asc') {
                    return '⬆️';
                  }
                  return '⬇️';
                } else {
                  return '️↕️';
                }
              };
              return (
                <th key={column.accessor} className="px-4 py-2">
                  <span>{column.label}</span>
                  <button
                    onClick={() => handleSort(column.accessor)}
                    className="ml-2 focus:outline-none"
                  >
                    {sortIcon()}
                  </button>
                </th>
              );
            })}
          </tr>
          <tr>
            {columns.map((column) => {
              return (
                <th key={`${column.accessor}-search`} className="px-4 py-2">
                  <input
                    key={`${column.accessor}-search`}
                    type="search"
                    placeholder={`Search ${column.label}`}
                    value={filters[column.accessor] || ''}
                    onChange={(event) => handleSearch(event.target.value, column.accessor)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {calculatedRows.map((row) => {
            return (
              <tr key={row.id}>
                {columns.map((column) => {
                  if (column.format) {
                    return (
                      <td key={column.accessor} className="px-4 py-2">
                        {column.format(row[column.accessor])}
                      </td>
                    );
                  }
                  return (
                    <td key={column.accessor} className="px-4 py-2">
                      {row[column.accessor]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {count > 0 ? (
        <Pagination
          activePage={activePage}
          count={count}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          setActivePage={setActivePage}
        />
      ) : (
        <p className="mt-4">No data found</p>
      )}

      <div className="mt-4">
        <p>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Clear all
          </button>
        </p>
      </div>
    </>
  );
};

export default Table;
