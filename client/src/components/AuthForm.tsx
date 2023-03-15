import { AuthVM } from '../viewModels/Auth.VM';
import { Link } from 'react-router-dom';

interface AuthFormProps {
  type: 'Login' | 'Register';
  vm: AuthVM;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, vm }) => {
  return (
    <form
      action=''
      className=' bg-white shadow-md rounded px-8 py-8 pt-8 flex flex-col gap-4'
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        vm.handleSubmitForm(e, type);
      }}
    >
      {type === 'Register' && (
        <div className=''>
          <label
            htmlFor='name'
            className='text-sm block font-bold  pb-2 uppercase'
          >
            Name
          </label>
          <input
            type='text'
            name='name'
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 '
            placeholder='Your name'
          />
        </div>
      )}

      <div className=''>
        <label
          htmlFor='email'
          className='text-sm block font-bold  pb-2 uppercase'
        >
          email address
        </label>
        <input
          type='email'
          name='email'
          required
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 '
          placeholder='Johnbull@example.com'
        />
      </div>
      <div className=''>
        <label
          htmlFor='password'
          className='text-sm block font-bold pb-2 uppercase'
        >
          password
        </label>
        <input
          type='password'
          name='password'
          required
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300'
          placeholder='Enter your password'
        />
      </div>
      <div className='pt-7 flex flex-col gap-3'>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='submit'
        >
          {type === 'Register' && 'Sign up'}
          {type === 'Login' && 'Sign in'}
        </button>
        {type === 'Register' && (
          <Link
            to={'/sign-in'}
            className='self-center underline hover:opacity-60'
          >
            {'Sign in'}
          </Link>
        )}
        {type === 'Login' && (
          <Link
            to={'/sign-up'}
            className='self-center underline hover:opacity-60'
          >
            {'Sign up'}
          </Link>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
