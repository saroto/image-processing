import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
  const mockUser = {
    id: 1,
    email: 'test@gmail.com',
    username: 'testuser',
    password: 'hashedpassword',
    token: 'testtoken',
    isRevoked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  describe('registerUser', () => {
    it('should register a new user', async () => {
      expect(await userService.create(mockUser)).toEqual('This action adds a new user');
    })
  })
  describe('getOneUser', () => {
    it('should return a user', async () => {
      const userId = 1;

      const actualUser = await userService.findOne(userId);
      expect(actualUser).toEqual(`This action returns a #${userId} user`);
    })
  })

});