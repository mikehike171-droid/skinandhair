import { Strategy } from 'passport-jwt';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        id: any;
        user_id: any;
        userId: any;
        username: any;
        role_id: any;
        location_id: any;
    }>;
}
export {};
