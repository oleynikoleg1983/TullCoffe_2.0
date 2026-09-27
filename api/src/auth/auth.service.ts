import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

export interface AuthUserResponse {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  private mapRole(roleId: number): AuthUserResponse['role'] {
    switch (roleId) {
      case 1:
        return 'admin';
      case 3:
        return 'manager';
      default:
        return 'user';
    }
  }

  async validateUser(login: string, password: string): Promise<UserEntity | null> {
    const normalizedLogin = String(login ?? '').trim();
    const normalizedPassword = String(password ?? '').trim();

    if (!normalizedLogin || !normalizedPassword) {
      return null;
    }

    const user = await this.userRepository.findOne({
      where: [{ email: normalizedLogin }, { name: normalizedLogin }],
    });
    if (!user || typeof user.password !== 'string' || !user.password) {
      return null;
    }
    try {
      const passwordMatches = await bcrypt.compare(normalizedPassword, user.password);
      console.log('Password matches:---', passwordMatches);
      if (!passwordMatches) {
        return null;
      }

      return user;
    } catch {
      return null;
    }
  }

  async login(login: string, password: string) {
    const user = await this.validateUser(login, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const role = this.mapRole(Number(user.roleId));
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    };
  }

  async getCurrentUser(userId: number): Promise<AuthUserResponse | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: this.mapRole(Number(user.roleId)),
    };
  }
}
