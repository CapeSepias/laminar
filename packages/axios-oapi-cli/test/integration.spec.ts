import {
  HttpError,
  laminar,
  start,
  stop,
  Laminar,
  jsonOk,
  jsonNoContent,
  jsonNotFound,
} from '@ovotech/laminar';
import axios from 'axios';
import { join } from 'path';
import { createOapi } from '@ovotech/laminar-oapi';
import { Config, Pet } from './__generated__/integration';
import { axiosOapi } from './__generated__/integration.types';

let server: Laminar;

interface AuthInfo {
  authInfo?: {
    user?: string;
  };
}

describe('Integration', () => {
  afterEach(() => stop(server));

  it('Should process response', async () => {
    const db: Pet[] = [
      { id: 111, name: 'Catty', tag: 'kitten' },
      { id: 222, name: 'Doggy' },
    ];

    const config: Config<AuthInfo> = {
      api: join(__dirname, 'integration.yaml'),
      security: {
        BearerAuth: ({ headers }) => {
          if (headers.authorization === 'Bearer 123') {
            return { user: 'dinkey' };
          } else {
            throw new HttpError(401, { message: 'Unathorized user' });
          }
        },
        BasicAuth: ({ headers }) => {
          if (headers.authorization !== 'Basic 123') {
            throw new HttpError(401, { message: 'Unathorized user' });
          }
        },
        ApiKeyAuth: ({ headers }) => {
          if (headers['x-api-key'] !== 'Me') {
            throw new HttpError(401, { message: 'Unathorized user' });
          }
        },
      },
      paths: {
        '/pets': {
          get: ({ query }) =>
            jsonOk(
              db.filter((pet) =>
                query.tags ? (pet.tag ? query.tags.includes(pet.tag) : false) : true,
              ),
            ),
          post: ({ body, authInfo }) => {
            const pet = { ...body, id: Math.max(...db.map((item) => item.id)) + 1 };
            db.push(pet);
            return jsonOk({ pet, user: authInfo && authInfo.user });
          },
        },
        '/pets/{id}': {
          get: ({ path }) => {
            const pet = db.find((item) => item.id === Number(path.id));
            return pet ? jsonOk(pet) : jsonNotFound({ code: 123, message: 'Not Found' });
          },
          delete: ({ path }) => {
            const index = db.findIndex((item) => item.id === Number(path.id));
            if (index !== -1) {
              db.splice(index, 1);
              return jsonNoContent({ status: 204 });
            } else {
              return jsonNotFound({ code: 12, message: 'Item not found' });
            }
          },
        },
      },
    };

    const app = await createOapi(config);
    server = laminar({ app, port: 8065 });
    await start(server);

    const api = axiosOapi(axios.create({ baseURL: 'http://localhost:8065' }));

    await expect(
      api.api.get('/unknown-url').catch((error) => error.response),
    ).resolves.toMatchObject({
      status: 404,
      data: {
        message:
          'Request for "GET /unknown-url" did not match any of the paths defined in the OpenApi Schema',
      },
    });

    await expect(api['GET /pets']()).resolves.toMatchObject({
      status: 200,
      data: [
        { id: 111, name: 'Catty', tag: 'kitten' },
        { id: 222, name: 'Doggy' },
      ],
    });

    await expect(
      api['POST /pets'](
        { name: 'New Puppy' },
        { headers: { Authorization: 'Bearer 000', 'x-trace-token': '123' } },
      ).catch((error) => error.response),
    ).resolves.toMatchObject({
      status: 401,
      data: { message: 'Unathorized user' },
    });

    await expect(
      api['POST /pets'](
        { name: 'New Puppy' },
        { headers: { Authorization: 'Bearer 123', 'x-trace-token': '123' } },
      ),
    ).resolves.toMatchObject({
      status: 200,
      data: { pet: { id: 223, name: 'New Puppy' }, user: 'dinkey' },
    });

    await expect(
      api['GET /pets/{id}']('111', { headers: { Authorization: 'Basic 123' } }),
    ).resolves.toMatchObject({
      status: 200,
      data: { id: 111, name: 'Catty', tag: 'kitten' },
    });

    await expect(
      api['GET /pets/{id}']('000', { headers: { Authorization: 'Basic 123' } }).catch(
        (error) => error.response,
      ),
    ).resolves.toMatchObject({
      status: 404,
      data: {
        code: 123,
        message: 'Not Found',
      },
    });

    await expect(
      api['GET /pets/{id}']('223', { headers: { Authorization: 'Basic 123' } }),
    ).resolves.toMatchObject({
      status: 200,
      data: { id: 223, name: 'New Puppy' },
    });

    await expect(api['GET /pets']()).resolves.toMatchObject({
      status: 200,
      data: [
        { id: 111, name: 'Catty', tag: 'kitten' },
        { id: 222, name: 'Doggy' },
        { id: 223, name: 'New Puppy' },
      ],
    });

    await expect(api['GET /pets']({ params: { tags: ['kitten'] } })).resolves.toMatchObject({
      status: 200,
      data: [{ id: 111, name: 'Catty', tag: 'kitten' }],
    });

    await expect(
      api['DELETE /pets/{id}']('228', { headers: { 'X-API-KEY': 'Me' } }).catch(
        (error) => error.response,
      ),
    ).resolves.toMatchObject({
      status: 404,
      data: {
        code: 12,
        message: 'Item not found',
      },
    });

    await expect(
      api['DELETE /pets/{id}']('222', { headers: { 'X-API-missing': 'Me' } }).catch(
        (error) => error.response,
      ),
    ).resolves.toMatchObject({
      status: 400,
      data: {
        errors: ['[request.headers] (required) is missing [x-api-key] keys'],
        message: 'Request for "DELETE /pets/222" does not match OpenApi Schema',
      },
    });

    await expect(
      api['DELETE /pets/{id}']('222', { headers: { 'X-API-KEY': 'Me' } }),
    ).resolves.toMatchObject({
      status: 204,
      data: {},
    });

    await expect(api['GET /pets']()).resolves.toMatchObject({
      status: 200,
      data: [
        { id: 111, name: 'Catty', tag: 'kitten' },
        { id: 223, name: 'New Puppy' },
      ],
    });
  });
});
