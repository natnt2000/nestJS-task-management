import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { compare, genSalt, hash } from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    try {
      const { username, password } = authCredentialsDto;

      const user = new User();
      user.username = username;
      user.salt = await genSalt();
      user.password = await this.hassPassword(password, user.salt);
      await user.save();
    } catch (error) {
      // Duplicate username
      if (error.code === '23505')
        throw new ConflictException('Username already exists');

      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username });

    if (user && (await compare(password, user.password))) return username;

    return null;
  }

  private async hassPassword(password: string, salt: string): Promise<string> {
    return hash(password, salt);
  }
}
