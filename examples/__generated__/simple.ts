import { RequestOapi, OapiConfig, ResponseOapi } from "@ovotech/laminar-oapi";

import { Empty } from "@ovotech/laminar";

export interface Config<R extends Empty = Empty> extends OapiConfig<R> {
    paths: {
        "/user/{id}": {
            get: (req: RequestUserIdGet & R) => ResponseUserIdGet | Promise<ResponseUserIdGet>;
        };
    };
}

export interface UserResponse {
    id?: string;
    name?: string;
    [key: string]: unknown;
}

export type ResponseUserIdGet = ResponseOapi<UserResponse, 200, "application/json">;

export interface RequestUserIdGet extends RequestOapi {
    path: {
        id: string;
    };
}
