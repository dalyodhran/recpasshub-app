import { ENDPOINT } from '../../enums/endpoints.enum';
import { GenericAxiosService, AXIOS_METHOD } from '../../services/GenericAxiosService';
import type { User } from '../../models/user';

export async function registerUser(token: string): Promise<User> {
    return await GenericAxiosService<User>({
        url: ENDPOINT.USER_REGISTER,
        method: AXIOS_METHOD.POST,
        token: token,
    });
}
