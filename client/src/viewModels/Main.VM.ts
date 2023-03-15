import { Api } from '../utils/Api';
import { Status, UserData } from '../utils/types';

export class MainVM {
  private setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  private setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
  private api: Api;
  public users: Array<UserData>;
  private currentUser: UserData;
  private rowSelection: {};

  constructor(
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
    setUsers: React.Dispatch<React.SetStateAction<UserData[]>>,
    users: Array<UserData>,
    currentUser: UserData,
    api: Api,
    rowSelection: {}
  ) {
    this.setIsAuth = setIsAuth;
    this.setUsers = setUsers;
    this.users = users;
    this.currentUser = currentUser;
    this.api = api;
    this.rowSelection = rowSelection;
  }

  getAllUsers() {
    this.api
      .getUsers()
      .then((users) => {
        const newUsers = users.data.users.map((user: UserData) => {
          return {
            ...user,
            createdAt: new Date(user.createdAt).toLocaleString(),
            lastVisit: new Date(user.lastVisit).toLocaleString(),
          };
        });
        this.setUsers(newUsers);
      })
      .catch((err) => console.log(err));
  }

  changeUsersStatus(status: Status) {
    const ids = this.getIds();
    this.api
      .changeUsersStatus(ids, status)
      .then(() => {
        if (ids.includes(this.currentUser.id) && status === 'blocked') {
          this.setIsAuth(false);
        } else if (this.users) {
          this.setUsers(
            this.users.map((user) => {
              if (ids.includes(user.id)) {
                return { ...user, status: status };
              } else {
                return user;
              }
            })
          );
        }
      })
      .catch((err) => console.log(err));
  }

  deleteUsers() {
    const ids = this.getIds();
    this.api
      .deleteUsers(ids)
      .then(() => {
        if (ids.includes(this.currentUser.id)) {
          this.setIsAuth(false);
        } else if (this.users) {
          this.setUsers(this.users.filter((user) => !ids.includes(user.id)));
        }
      })
      .catch((err) => console.log(err));
  }

  logOut() {
    this.setIsAuth(false);
  }
  private getIds() {
    const ids = Object.keys(this.rowSelection).map((key) => {
      return this.users[parseInt(key)].id;
    });
    console.log(ids);
    return ids;
  }
}
