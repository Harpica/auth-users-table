import { useNavigate } from 'react-router-dom';
import { AuthVM } from '../viewModels/Auth.VM';
import AuthForm from '../components/AuthForm';
import { api } from '../utils/Api';
import { UserData } from '../utils/types';

interface AuthViewProps {
  type: 'Login' | 'Register';
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData>>;
}

const AuthView: React.FC<AuthViewProps> = ({
  type,
  setIsAuth,
  setCurrentUser,
}) => {
  const navigate = useNavigate();
  const vm = new AuthVM(setIsAuth, setCurrentUser, api, navigate);
  return (
    <section className='App h-screen w-full flex justify-center items-center bg-gradient-to-r from-sky-500 to-indigo-500'>
      <div className='w-full max-w-md bg-gray-800'>
        <AuthForm type={type} vm={vm} />
      </div>
    </section>
  );
};

export default AuthView;
