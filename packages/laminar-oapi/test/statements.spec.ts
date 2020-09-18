import { laminar, stop, start, Laminar, jsonOk } from '@ovotech/laminar';
import axios from 'axios';
import { join } from 'path';
import { OapiConfig, createOapi } from '../src';

let server: Laminar;

describe('Statements', () => {
  afterEach(() => stop(server));

  it('Should process response', async () => {
    const config: OapiConfig = {
      api: join(__dirname, 'statements.yaml'),
      paths: {
        '/accounts/{accountId}/meters': {
          get: () =>
            jsonOk([
              {
                meterType: 'gas',
                mpxn: '111111111',
                plan: 'PA_G_WM_R_25',
                tariffName: 'SMART PAYG (all online)',
                startDate: '2019-01-04',
                endDate: '2019-06-02',
                msn: 'G4111111',
                ldz: 'WM',
                address: '87, TEST AVENUE, TEST TOWN',
                postCode: 'TT123EE',
              },
              {
                meterType: 'elec',
                mpxn: '14111111',
                plan: 'PA_E_14_R_1_25',
                tariffName: 'SMART PAYG (all online)',
                startDate: '2019-01-04',
                endDate: '2019-06-02',
                msn: '222222222',
                profileClassId: '01',
                meterTimeswitchCode: '801',
                lineLossFactorClassId: '1',
                address: '87, TEST AVENUE, LOW HILL, TEST TOWN, WEST MIDLANDS',
                postCode: 'TT123EE',
              },
            ]),
        },
      },
    };

    const app = await createOapi(config);
    server = laminar({ app, port: 8064 });
    await start(server);

    const api = axios.create({ baseURL: 'http://localhost:8064' });
    const { data } = await api.get('/accounts/123/meters');

    expect(data).toMatchSnapshot();
  });
});
