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
import { IArticleRepository } from "../core/interfaces/repositories/IArticleRepository";
import { ArticleRepository } from "../repositories/article.repository";
import { ICategoryRepository } from "../core/interfaces/repositories/ICategoryRepository";
import { CategoryRepository } from "../repositories/category.repository";
import { IArticleService } from "../core/interfaces/services/IArticleService";
import { ArticleService } from "../services/article.service";
import { IArticleController } from "../core/interfaces/controllers/IArticleController";
import { ArticleController } from "../controllers/article.controller";







const container=new Container()

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)
container.bind<IAuthService>(TYPES.AuthService).to(AuthService)

container.bind<IAuthController>(TYPES.AuthController).to(AuthController)
container.bind<IUserService>(TYPES.UserService).to(UserService)
container.bind<IUserController>(TYPES.UserController).to(UserController)

container.bind<IArticleRepository>(TYPES.ArticleRepository).to(ArticleRepository)
container.bind<ICategoryRepository>(TYPES.CategoryRepository).to(CategoryRepository)
container.bind<IArticleService>(TYPES.ArticleService).to(ArticleService)
container.bind<IArticleController>(TYPES.ArticleController).to(ArticleController)


export default container