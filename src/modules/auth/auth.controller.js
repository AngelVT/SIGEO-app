import * as authService from './auth.service.js';
import { requestHandler } from '../../utils/request.utils.js';

const COOKIE_EXP = 43200000;

export const login = requestHandler(async (req, res) => {
    const { username, password } = req.body;

    const response = await authService.requestLogin(username, password);

    const { user } = response;

    res.cookie("access_token", response.token, {
        httpOnly: true,
        //secure: true,
        signed: true,
        sameSite: 'strict',
        maxAge: COOKIE_EXP
    });

    res.cookie("session_info", JSON.stringify({
        ...user
    }), {
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: COOKIE_EXP
    })

    res.status(200).json({ msg: "Access granted" });

    console.log("Get request completed, single user requested");
});