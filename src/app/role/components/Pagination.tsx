import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
const Pagination = ({ activePage, count, rowsPerPage, totalPages, setActivePage }: {
  activePage: number,
  count: number,
  rowsPerPage: number,
  totalPages: number,
  setActivePage: (page: number) => void
}) => {
  const beginning = activePage === 1 ? 1 : rowsPerPage * (activePage - 1) + 1;
  const end = activePage === totalPages ? count : beginning + rowsPerPage - 1;

  return (
    <>
      <div className="py-3 flex items-center justify-between m-2">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
          disabled={activePage === 1}
          onClick={() => setActivePage(activePage - 1)}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
        </button>
        <button
          disabled={activePage === totalPages}
          onClick={() => setActivePage(activePage + 1)}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        ></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex gap-x-2">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{activePage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <select >
              {[5, 10, 20].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">
              Row <span className="font-medium">{beginning === end ? (
                end
                ) : (
                <>{beginning} - {end}</>
                )}{" "}
                of {count}</span>
            </span>
          </div>
      
        <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
          disabled={activePage === 1}
          onClick={() => setActivePage(1)}
          className="rounded-l-md relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true"/>
        </button>
        <button
          disabled={activePage === 1}
          onClick={() => setActivePage(activePage - 1)}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
        </button>
        <button
          disabled={activePage === totalPages}
          onClick={() => setActivePage(activePage + 1)}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
         <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
        </button>
        <button
          disabled={activePage === totalPages}
          onClick={() => setActivePage(totalPages)}
          className="rounded-r-md relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
        <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true"/>
        </button>
            </nav>
        </div>
          </div>
      </div>
      


      
    </>
  );
};

export default Pagination;