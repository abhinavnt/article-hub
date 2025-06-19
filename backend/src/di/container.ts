import { Container } from "inversify";
import { TYPES } from "./types";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { UserRepository } from "../repositories/user.repository";
import { IAuthService } from "../core/interfaces/services/IAuthService";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { IAuthController } from "../core/interfaces/controllers/IAuthController";
import { IUserService } from "../core/interfaces/services/IUserService";
import { UserService } from "../services/user.service";
import { IUserController } from "../core/interfaces/controllers/IUserController";
import { UserController } from "../controllers/user.controller";







const container=new Container()

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)
container.bind<IAuthService>(TYPES.AuthService).to(AuthService)

container.bind<IAuthController>(TYPES.AuthController).to(AuthController)
container.bind<IUserService>(TYPES.UserService).to(UserService)
container.bind<IUserController>(TYPES.UserController).to(UserController)


export default container