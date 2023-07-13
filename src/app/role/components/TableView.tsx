import { useState, useMemo } from 'react';
import { useQueryClient,useMutation } from 'react-query';
import { sortRows, filterRows, paginateRows } from './Helpers';
import Pagination from './Pagination';
import { FaEdit, FaTrash,FaSort, FaSortUp,FaSortDown } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";

import RoleService from "@/api/services/role.service";
import Role from '@/api/models/role';

interface Sort {
  order: 'asc' | 'desc';
  orderBy: string;
}

const Table = ({ roles }: { roles: Role[] }) => {
    const queryClient = useQueryClient();
  let roleService = new RoleService();
  const deleteRole = async (id: number) => {
    await roleService.delete(id);
  };
  const { mutate: deleteRoleMutation } = useMutation(deleteRole, {
    onSuccess: () => {
      queryClient.invalidateQueries('roles');
       toast.success("Role deleted successfully");
    },
  });

    const columns: any[] = [
  { 
    accessor: "slno", label: "#",
    sortable: false,
    searchable:false,
  },
  { accessor: "name", label: "Name" },
  { accessor: "description", label: "Description" },
  {
    accessor: "status",
    label: "Status",
    format: (value: any) => (value ? "Active" : "Inactive"),
  },
  {
    accessor: "id",
    label: "Action",
    sortable: false,
    searchable:false,
    Cell: (id:number) => (
      <>
        <button
              className="text-blue-500 hover:text-blue-700 p-2"
              onClick={() => handleEdit(id)}
            >
              <FaEdit />
            </button>
        <button
              className="text-red-500 hover:text-red-700 p-2"
              onClick={() => handleDelete(id)}
            >
              <FaTrash />
            </button>
      </>
    ),
  },
];
const handleEdit=async(id:number) => {
    try {
        const role = await roleService.retrieve(id);
        queryClient.setQueryData(['editRole'], role.data);
    } catch (error) {
        // Handle error
    }
}
const handleDelete=(id:number) => {
    deleteRoleMutation(id);
}
  const [activePage, setActivePage] = useState(1);
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [sort, setSort] = useState<Sort>({ order: 'desc', orderBy: 'id' });
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
    <ToastContainer />
      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
             

             <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => {
              const sortIcon = () => {
                if(column.sortable===false){
                    return ''
                }
                if (column.accessor === sort.orderBy) {
                  if (sort.order === 'asc') {
                    return <FaSortUp/>;
                  }
                  return <FaSortDown/>;
                } else {
                  return <FaSort/>;
                }
                
              };
              return (
                <th key={column.accessor}  scope="col"
                          className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className='flex items-center cursor-pointer '
                    onClick={() => column.sortable===false?null: handleSort(column.accessor)}
                  >
                    <span className="mr-2">{column.label}</span>
                     {sortIcon()}
                  </span>
                  {/* <button
                    
                    className="ml-2 focus:outline-none"
                  >
                    {sortIcon()}
                  </button> */}
                </th>
              );
            })}
          </tr>
          <tr>
            {columns.map((column) => {
             if (column.searchable===false) {
                    return (
                         <th key={`${column.accessor}-search`}>
                         </th>
                    );
                  }

                  
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
              <tr key={row.id} className='hover:bg-gray-50'>
                {columns.map((column) => {
                  if (column.format) {
                    return (
                      <td key={column.accessor}  className="px-6 py-4 whitespace-nowrap">
                        {column.format(row[column.accessor])}
                      </td>
                    );
                  }
                  if (column.Cell) {
                    return (
                      <td key={column.accessor}  className="px-6 py-4 whitespace-nowrap">
                        {column.Cell(row[column.accessor])}
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
