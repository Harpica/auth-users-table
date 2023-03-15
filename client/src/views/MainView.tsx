import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { api } from '../utils/Api';
import { MainVM } from '../viewModels/Main.VM';
import { useEffect, useState } from 'react';
import { UserData } from '../utils/types';
import { IndeterminateCheckbox } from '../components/IndeterminateCheckbox';

const columnHelper = createColumnHelper<UserData>();
const columns: ColumnDef<UserData, any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  },
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'E-mail',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Sign up date',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastVisit', {
    header: 'Last visit',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
];

interface MainViewProps {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: UserData;
}

const MainView: React.FC<MainViewProps> = ({ setIsAuth, currentUser }) => {
  const [users, setUsers] = useState<Array<UserData>>([
    {
      id: 0,
      name: 'default',
      email: 'default@email.com',
      createdAt: Date.now().toString(),
      lastVisit: Date.now().toString(),
      status: 'active',
    },
  ]);
  const [rowSelection, setRowSelection] = useState({});

  const vm = new MainVM(
    setIsAuth,
    setUsers,
    users,
    currentUser,
    api,
    rowSelection
  );

  useEffect(() => {
    if (users[0].name === 'default') {
      vm.getAllUsers();
    }
  }, []);

  const table = useReactTable<UserData>({
    data: users,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='w-full flex justify-center bg-gradient-to-r from-sky-500 to-indigo-500'>
      <div className='h-screen w-full 2xl:max-w-screen-2xl flex flex-col sm:p-7 gap-5 box-border'>
        <nav className='self-end'>
          <a
            href='/sign-in'
            className=' pr-3  pt-3  text-white underline'
            onClick={() => {
              vm.logOut();
            }}
          >
            Log out
          </a>
        </nav>
        <div className='flex gap-3 pl-3 self-start text-white'>
          <button
            onClick={() => {
              vm.changeUsersStatus('blocked');
            }}
          >
            Block
          </button>
          <button
            onClick={() => {
              vm.changeUsersStatus('active');
            }}
          >
            Unblock
          </button>
          <button
            onClick={() => {
              vm.deleteUsers();
            }}
          >
            Delete
          </button>
        </div>
        <div className='overflow-auto h-full bg-white shadow-md rounded flex flex-col justify-between p-3 sm:p-7'>
          <table className='table-auto w-full box-border text-left'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
              {/* <tr>
                <th className='w-7'>
                  <input
                    type='checkbox'
                    id='select-all'
                    name='select-all'
                    aria-label='select all'
                  />
                </th>
                <th className='w-7'>ID</th>
                <th className=''>Name</th>
                <th className=''>E-mail</th>
                <th className=''>Sign-up date</th>
                <th className=''>Last visit</th>
                <th className='w-20'>Status</th>
              </tr> */}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {/* <tr>
                <td>
                  <input type='checkbox'></input>
                </td>
                <td>1</td>
                <td>Some Name</td>
                <td className='max-w-xs break-words'>
                  snaaaaaaaaail.any@gmail.com
                </td>
                <td>14.03.23 21:00</td>
                <td>14.03.23 21:00</td>
                <td>Active</td>
              </tr> */}
            </tbody>
          </table>
          <div>
            {Object.keys(rowSelection).length} of{' '}
            {table.getPreFilteredRowModel().rows.length} Total Rows Selected
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainView;
