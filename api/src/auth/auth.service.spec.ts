import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';

describe('AuthService', () => {
  it('should issue a token and return the current user for valid credentials', async () => {
    const passwordHash = await bcrypt.hash('admin123', 10);
    const users = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        password: passwordHash,
        roleId: 1,
        siteId: 1,
      },
    ];

    const repo = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const login = String(where[0]?.email ?? where[1]?.name ?? '').toLowerCase();
        return Promise.resolve(
          users.find(
            (user) =>
              user.email.toLowerCase() === login || user.name.toLowerCase() === login,
          ) ?? null,
        );
      }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: repo,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('signed-token'),
          },
        },
      ],
    }).compile();

    const service = moduleRef.get(AuthService);
    const result = await service.login('admin@example.com', 'admin123');

    expect(result.accessToken).toBe('signed-token');
    expect(result.user.email).toBe('admin@example.com');
    expect(result.user.role).toBe('admin');
  });

  it('should reject invalid credentials without throwing a 500', async () => {
    const repo = {
      findOne: jest.fn().mockResolvedValue({
        id: 2,
        name: 'Bad User',
        email: 'bad@example.com',
        password: 'not-a-bcrypt-hash',
        roleId: 2,
        siteId: 1,
      }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: repo,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    const service = moduleRef.get(AuthService);

    await expect(service.login('bad@example.com', 'wrong-password')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
