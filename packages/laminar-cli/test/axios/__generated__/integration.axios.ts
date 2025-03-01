import { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";

/**
 * Swagger Petstore
 *
 * Version: 1.0.0
 *
 * Description:
 * A sample API that uses a petstore as an example to demonstrate features in the OpenAPI 3.0 specification
 */
export const axiosOapi = (api: AxiosInstance): AxiosOapiInstance => ({
    /**
     * Returns all pets from the system that the user has access to
     * Nam sed condimentum est. Maecenas tempor sagittis sapien, nec rhoncus sem sagittis sit amet. Aenean at gravida augue, ac iaculis sem. Curabitur odio lorem, ornare eget elementum nec, cursus id lectus. Duis mi turpis, pulvinar ac eros ac, tincidunt varius justo. In hac habitasse platea dictumst. Integer at adipiscing ante, a sagittis ligula. Aenean pharetra tempor ante molestie imperdiet. Vivamus id aliquam diam. Cras quis velit non tortor eleifend sagittis. Praesent at enim pharetra urna volutpat venenatis eget eget mauris. In eleifend fermentum facilisis. Praesent enim enim, gravida ac sodales sed, placerat id erat. Suspendisse lacus dolor, consectetur non augue vel, vehicula interdum libero. Morbi euismod sagittis libero sed lacinia.
     *
     * Sed tempus felis lobortis leo pulvinar rutrum. Nam mattis velit nisl, eu condimentum ligula luctus nec. Phasellus semper velit eget aliquet faucibus. In a mattis elit. Phasellus vel urna viverra, condimentum lorem id, rhoncus nibh. Ut pellentesque posuere elementum. Sed a varius odio. Morbi rhoncus ligula libero, vel eleifend nunc tristique vitae. Fusce et sem dui. Aenean nec scelerisque tortor. Fusce malesuada accumsan magna vel tempus. Quisque mollis felis eu dolor tristique, sit amet auctor felis gravida. Sed libero lorem, molestie sed nisl in, accumsan tempor nisi. Fusce sollicitudin massa ut lacinia mattis. Sed vel eleifend lorem. Pellentesque vitae felis pretium, pulvinar elit eu, euismod sapien.
     *
     */
    "GET /pets": config => api.get<Pet[] | Error>(`/pets`, config),
    /**
     * Creates a new pet in the store.  Duplicates are allowed
     */
    "POST /pets": (data, config) => api.post<PetCreated | Error>(`/pets`, data, config),
    /**
     * Returns a user based on a single ID, if the user does not have access to the pet
     */
    "GET /pets/{id}": (id, config) => api.get<Pet | Error>(`/pets/${id}`, config),
    /**
     * deletes a single pet based on the ID supplied
     */
    "DELETE /pets/{id}": (id, config) => api.delete<Error>(`/pets/${id}`, config),
    /**
     * modify tags
     */
    "PATCH /pets/{id}": (id, data, config) => api.patch<Pet | Error>(`/pets/${id}`, data, config),
    api: api
});

export type Pet = NewPet & {
    id: number;
    [key: string]: unknown;
};

export interface NewPet {
    name: string;
    tag?: string;
    [key: string]: unknown;
}

export interface Error {
    code: number;
    message: string;
}

export interface GetPets {
    params?: {
        /**
         * tags to filter by
         */
        tags?: string[];
        /**
         * maximum number of results to return
         */
        limit?: number;
    };
}

export interface PetCreated {
    pet?: NewPet;
    user?: string;
    [key: string]: unknown;
}

export interface PostPets {
    headers?: {
        /**
         * a trace token to trace posts
         */
        "x-trace-token": string;
    };
}

export interface ChangeTag {
    tag: string;
    [key: string]: unknown;
}

export interface AxiosOapiInstance {
    /**
     * Returns all pets from the system that the user has access to
     * Nam sed condimentum est. Maecenas tempor sagittis sapien, nec rhoncus sem sagittis sit amet. Aenean at gravida augue, ac iaculis sem. Curabitur odio lorem, ornare eget elementum nec, cursus id lectus. Duis mi turpis, pulvinar ac eros ac, tincidunt varius justo. In hac habitasse platea dictumst. Integer at adipiscing ante, a sagittis ligula. Aenean pharetra tempor ante molestie imperdiet. Vivamus id aliquam diam. Cras quis velit non tortor eleifend sagittis. Praesent at enim pharetra urna volutpat venenatis eget eget mauris. In eleifend fermentum facilisis. Praesent enim enim, gravida ac sodales sed, placerat id erat. Suspendisse lacus dolor, consectetur non augue vel, vehicula interdum libero. Morbi euismod sagittis libero sed lacinia.
     *
     * Sed tempus felis lobortis leo pulvinar rutrum. Nam mattis velit nisl, eu condimentum ligula luctus nec. Phasellus semper velit eget aliquet faucibus. In a mattis elit. Phasellus vel urna viverra, condimentum lorem id, rhoncus nibh. Ut pellentesque posuere elementum. Sed a varius odio. Morbi rhoncus ligula libero, vel eleifend nunc tristique vitae. Fusce et sem dui. Aenean nec scelerisque tortor. Fusce malesuada accumsan magna vel tempus. Quisque mollis felis eu dolor tristique, sit amet auctor felis gravida. Sed libero lorem, molestie sed nisl in, accumsan tempor nisi. Fusce sollicitudin massa ut lacinia mattis. Sed vel eleifend lorem. Pellentesque vitae felis pretium, pulvinar elit eu, euismod sapien.
     *
     */
    "GET /pets": (config?: AxiosRequestConfig & GetPets) => Promise<AxiosResponse<Pet[] | Error>>;
    /**
     * Creates a new pet in the store.  Duplicates are allowed
     */
    "POST /pets": (data: NewPet, config?: AxiosRequestConfig & PostPets) => Promise<AxiosResponse<PetCreated | Error>>;
    /**
     * Returns a user based on a single ID, if the user does not have access to the pet
     */
    "GET /pets/{id}": (id: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<Pet | Error>>;
    /**
     * deletes a single pet based on the ID supplied
     */
    "DELETE /pets/{id}": (id: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<Error>>;
    /**
     * modify tags
     */
    "PATCH /pets/{id}": (id: number, data: ChangeTag, config?: AxiosRequestConfig) => Promise<AxiosResponse<Pet | Error>>;
    api: AxiosInstance;
}
