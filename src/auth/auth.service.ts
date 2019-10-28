import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {

    private readonly bcryptSalt: number = 10;
    private logger = new Logger('AuthService');
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
        private jwtService: JwtService) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { userName, password } = authCredentialsDto;
        const found = await this.userModel.findOne({ userName });
        if (found) {
            throw new ConflictException('userName already exists');
        }
        const salt = await bcrypt.genSalt(this.bcryptSalt);
        authCredentialsDto.password = await this.hashPassword(password, salt);
        this.userModel.create({ ...authCredentialsDto, salt });
    }

    async signIn(authCredentialsDto): Promise<{ accessToken: string }> {
        const { password, userName } = authCredentialsDto;
        const found = await this.userModel.findOne({ userName });
        if (!found || found.password !== await this.hashPassword(password, found.salt)) {
            this.logger.verbose(`Failed atempt to sign in with :${JSON.stringify(authCredentialsDto)}`);
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload: JwtPayload = { userName };
        const accessToken: string = await this.jwtService.sign(payload);
        return { accessToken };
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hashSync(password, salt);
    }
}
