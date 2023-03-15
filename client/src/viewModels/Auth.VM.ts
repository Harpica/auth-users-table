import { Api } from '../utils/Api';
import { NavigateFunction } from 'react-router-dom';
import { UserData } from '../utils/types';

export class AuthVM {
  private setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  private setCurrentUser: React.Dispatch<React.SetStateAction<UserData>>;
  private api: Api;
  private navigate: NavigateFunction;

  constructor(
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentUser: React.Dispatch<React.SetStateAction<UserData>>,
    api: Api,
    navigate: NavigateFunction
  ) {
    this.setIsAuth = setIsAuth;
    this.setCurrentUser = setCurrentUser;
    this.api = api;
    this.navigate = navigate;
  }

  handleSubmitForm(e: React.FormEvent<HTMLFormElement>, type: string) {
    e.preventDefault();
    const email = (
      e.currentTarget.elements.namedItem('email') as HTMLInputElement
    ).value;
    const password = (
      e.currentTarget.elements.namedItem('password') as HTMLInputElement
    ).value;
    if (type === 'Login') {
      this.loginUser(email, password);
    } else if (type === 'Register') {
      const name = (
        e.currentTarget.elements.namedItem('name') as HTMLInputElement
      ).value;
      this.registerUser(name, email, password);
    }
  }

  private loginUser(email: string, password: string) {
    this.api
      .loginUser(email, password)
      .then((res) => {
        const user = res.data.user as UserData;
        this.setCurrentUser(user);
        this.setIsAuth(true);
        this.navigate('/', { replace: true });
      })
      .catch((err) => console.log(err));
  }

  private registerUser(name: string, email: string, password: string) {
    this.api
      .createUser(name, email, password)
      .then(() => {
        this.navigate('/sign-in', { replace: true });
      })
      .catch((err) => console.log(err));
  }
}
