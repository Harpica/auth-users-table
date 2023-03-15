import { useEffect, useState } from 'react';
import { MainVM } from '../viewModels/Main.VM';
import Table from '../components/Table';
import { UserData } from '../utils/types';
import { api } from '../utils/Api';
import { DEFAULT_USER } from '../utils/constants';

interface MainViewProps {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: UserData;
}

const MainView: React.FC<MainViewProps> = ({ setIsAuth, currentUser }) => {
  const [users, setUsers] = useState<Array<UserData>>([DEFAULT_USER]);
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

  return (
    <div className='w-full flex justify-center bg-gradient-to-r from-sky-500 to-indigo-500'>
      <div className='h-screen w-full 2xl:max-w-screen-2xl flex flex-col sm:p-7 gap-5 box-border'>
        <nav className='self-end'>
          <a
            href='/sign-in'
            className=' pr-3  pt-3 flex flex-row gap-2 text-white underline hover:opacity-60'
            onClick={() => {
              vm.logOut();
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6'
            >
              <path
                fillRule='evenodd'
                d='M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z'
                clipRule='evenodd'
              />
            </svg>
            <p>Log out</p>
          </a>
        </nav>
        <div className='flex gap-3 pl-3 self-start text-white'>
          <button
            className='hover:opacity-60'
            name='block user'
            aria-label='block user'
            onClick={() => {
              vm.changeUsersStatus('blocked');
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6'
            >
              <path
                fillRule='evenodd'
                d='M6.72 5.66l11.62 11.62A8.25 8.25 0 006.72 5.66zm10.56 12.68L5.66 6.72a8.25 8.25 0 0011.62 11.62zM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788z'
                clipRule='evenodd'
              />
            </svg>
          </button>
          <button
            className='hover:opacity-60'
            name='unblock user'
            aria-label='unblock user'
            onClick={() => {
              vm.changeUsersStatus('active');
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6'
            >
              <path d='M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z' />
            </svg>
          </button>
          <button
            className='hover:opacity-60'
            name='delete user'
            aria-label='deletek user'
            onClick={() => {
              vm.deleteUsers();
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6'
            >
              <path
                fillRule='evenodd'
                d='M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
        <div className='overflow-auto h-full bg-white shadow-md rounded flex flex-col justify-between p-3 sm:p-7'>
          <Table
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            users={users}
          />
        </div>
      </div>
    </div>
  );
};

export default MainView;
