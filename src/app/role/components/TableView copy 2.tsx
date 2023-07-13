import { useState, useMemo } from 'react';
import { sortRows, filterRows, paginateRows } from './Helpers';
import Pagination from './Pagination';

import Role from '@/api/models/role';

interface Sort {
  order: 'asc' | 'desc';
  orderBy: string;
}


// const rows: any[] = [
//   {
//     id: 1,
//     name: "Liz Lemon",
//     age: 36,
//     is_manager: true,
//     start_date: "02-28-1999",
    
//   },
//   {
//     id: 2,
//     name: "Jack Donaghy",
//     age: 40,
//     is_manager: true,
//     start_date: "03-05-1997",
//   },
//   {
//     id: 3,
//     name: "Tracy Morgan",
//     age: 39,
//     is_manager: false,
//     start_date: "07-12-2002",
//   },
//   {
//     id: 4,
//     name: "Jenna Maroney",
//     age: 40,
//     is_manager: false,
//     start_date: "02-28-1999",
//   },
//   {
//     id: 5,
//     name: "Kenneth Parcell",
//     age: Infinity,
//     is_manager: false,
//     start_date: "01-01-1970",
//   },
//   {
//     id: 6,
//     name: "Pete Hornberger",
//     age: null,
//     is_manager: true,
//     start_date: "04-01-2000",
//   },
//   {
//     id: 7,
//     name: "Frank Rossitano",
//     age: 36,
//     is_manager: false,
//     start_date: null,
//   },
//   { id: 8, name: null, age: null, is_manager: null, start_date: null },
// ];

const columns: any[] = [
  { accessor: "name", label: "Name" },
  { accessor: "age", label: "Age" },
  {
    accessor: "is_manager",
    label: "Manager",
    format: (value: any) => (value ? "✔️" : "✖️"),
  },
  { accessor: "start_date", label: "Start Date" },
  { accessor: "action", label: "Action" },
];

const Table = ({ roles }: { roles: Role[] }) => {
  const [activePage, setActivePage] = useState(1);
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [sort, setSort] = useState<Sort>({ order: 'asc', orderBy: 'id' });
  const rowsPerPage = 5;

  const filteredRows = useMemo(() => filterRows(roles, filters), [roles,filters]);
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
      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
             

             <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
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
                <th key={column.accessor}  scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
        <tbody className="bg-white divide-y divide-gray-200">
          {calculatedRows.map((row) => {
            return (
              <tr key={row.id}>
                {columns.map((column) => {
                  if (column.format) {
                    return (
                      <td key={column.accessor}  className="px-6 py-4 whitespace-nowrap">
                        {column.format(row[column.accessor])}
                      </td>
                    );
                  }
                  return (
                    <td key={column.accessor}  className="px-6 py-4 whitespace-nowrap">
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
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear all
          </button>
        </p>
      </div>



            </div>
          </div>
        </div>
      </div>






      
    </>
  );
};

export default Table;
