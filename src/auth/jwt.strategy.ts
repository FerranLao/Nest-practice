import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,

    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'estoNoTendriaQueEstarAquiVisible',
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { userName } = payload;
        const user = await this.userModel.findOne({ userName });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

}
