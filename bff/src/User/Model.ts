import { IS_MOCK } from "../config";
import BadRequestError from "../Errors/bad-request-error";
import NotFoundError from "../Errors/not-found-error";

export interface IUser {
  id: string;
  phone: string;
  password: string;
  refreshTokens: string[]
}

export interface IAccount {
  id: string;
  name: string;
  sex: "male" | "female" | "not specified";
  email: string;
  createdAt: Date;
  userId: string;
  avatar: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  sex: "male" | "female" | "not specified";
  email: string;
  phone: string;
  avatar: string;
}

class UserDBMock {
  private users: IUser[] = [];
  private accounts: IAccount[] = [];

  constructor() {
    this.users = [
      {
        id: "1",
        phone: "1234567890",
        password: "password",
        refreshTokens: [],
      },
      {
        id: "2",
        phone: "0987654321",
        password: "password",
        refreshTokens: [],
      },
    ]
    this.accounts = [
      {
        id: "1",
        name: "John Doe",
        sex: "male",
        email: "john@doe.com",
        createdAt: new Date(),
        userId: "1",
        avatar: "https://picsum.photos/200",
      },
      {
        id: "2",
        name: "Jane Doe",
        sex: "female",
        email: "jane@doe.com",
        createdAt: new Date(),
        userId: "2",
        avatar: "https://picsum.photos/200",
      },
    ];
  }

  getUser(phone: string, password: string): Promise<IUserResponse> {
    const user = this.users.find((user) => user.phone === phone && user.password === password);
    if (!user)
      return Promise.reject(
        new BadRequestError("Неправильный логин или пароль")
      );
    const account = this.accounts.find((account) => account.userId === user.id);
    if (!account)
      return Promise.reject(new BadRequestError("Требуется регистрация"));
    return Promise.resolve({
      id: account.id,
      name: account.name,
      sex: account.sex,
      email: account.email,
      phone: user.phone,
      avatar: account.avatar,
    });
  }
  getAccount(userId: string): Promise<IAccount> {
    const account = this.accounts.find((account) => account.userId === userId);
    if (!account) return Promise.reject(new NotFoundError("Аккаунт не найден"));
    return Promise.resolve(account);
  }

  addAccount(account: IAccount): void {
    if(account)
    this.accounts.push(account);
  }

  addUser(phone: string, password: string): Promise<void> {
    if(this.users.find((user) => user.phone === phone)) {
      return Promise.reject(new BadRequestError("Пользователь с таким номером телефона уже существует"));
    }
    this.users.push({
      id: (this.users.length + 1).toString(),
      phone: phone,
      password: password,
      refreshTokens: [],
    });
    return Promise.resolve();
  }

  changeName(accountId: string, name: string): Promise<IUserResponse> {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      return Promise.reject(new NotFoundError("Аккаунт не найден"));
    }
    const user = this.users.find((user) => user.id === account.userId);
    if (!user) {
      return Promise.reject(new NotFoundError("Пользователь не найден"));
    }
    account.name = name;
    return Promise.resolve({
      id: account.userId,
      name: account.name,
      sex: account.sex,
      email: account.email,
      phone: user.phone,
      avatar: account.avatar,
    });
  }

  changeSex(
    accountId: string,
    sex: "male" | "female" | "not specified"
  ): Promise<IUserResponse> {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      return Promise.reject(new NotFoundError("Аккаунт не найден"));
    }
    const user = this.users.find((user) => user.id === account.userId);
    if (!user) {
      return Promise.reject(new NotFoundError("Пользователь не найден"));
    }
    account.sex = sex;
    return Promise.resolve({
      id: account.userId,
      name: account.name,
      sex: account.sex,
      email: account.email,
      phone: user.phone,
      avatar: account.avatar,
    });
  }

  changeEmail(accountId: string, email: string): Promise<IUserResponse> {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      return Promise.reject(new NotFoundError("Аккаунт не найден"));
    }
    const user = this.users.find((user) => user.id === account.userId);
    if (!user) {
      return Promise.reject(new NotFoundError("Пользователь не найден"));
    }
    account.email = email;
    return Promise.resolve({
      id: account.userId,
      name: account.name,
      sex: account.sex,
      email: account.email,
      phone: user.phone,
      avatar: account.avatar,
    });
  }

  addRefreshToken(accountId: string, token: string): Promise<void> {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      return Promise.reject(new NotFoundError("Аккаунт не найден"));
    }
    const user = this.users.find((user) => user.id === account.userId);
    if (!user) {
      return Promise.reject(new NotFoundError("Пользователь не найден"));
    }
    user.refreshTokens.push(token);
    return Promise.resolve();
  }

  removeRefreshToken(userId: string, token: string): Promise<void> {
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      return Promise.reject(new NotFoundError("Пользователь не найден"));
    }
    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
    return Promise.resolve();
  }
}

export const UserModel = new UserDBMock();