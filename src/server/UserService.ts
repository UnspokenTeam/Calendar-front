import axios from "axios";

const ApiUrl = `http://localhost:8080/api/user/`

interface User {
    id: string | undefined;
    username: string;
    email: string;
}

class UserService {
    async saveUser(user: User) {
        try {
            const res = await axios.post(ApiUrl, user)
            if (res.status % 100 > 3) return undefined
            return res.data as User;
        } catch (e) {
            console.log(e);
            return undefined
        }
    }
}
export default new UserService();