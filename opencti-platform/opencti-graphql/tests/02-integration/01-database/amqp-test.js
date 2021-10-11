import { v4 as uuid } from 'uuid';
import {
  getAMQPVersion,
  metrics,
  pushToConnector,
  registerConnectorQueues,
  unregisterConnector,
} from '../../../src/database/amqp';
import { CONNECTOR_INTERNAL_IMPORT_FILE } from '../../../src/schema/general';

describe('AMQP basic and utils', () => {
  it('should amqp in correct version', async () => {
    // Just wait one second to let redis client initialize
    const amqpVersion = await getAMQPVersion();
    expect(amqpVersion).toEqual(expect.stringMatching(/^3.9\./g));
  });

  it('should amqp metrics accurate', async () => {
    // Just wait one second to let redis client initialize
    const data = await metrics();
    expect(data).not.toBeNull();
    expect(data.consumers).toEqual(0);
    expect(data.overview.management_version).toEqual(expect.stringMatching(/^3.9\./g));
  });
});

describe('AMQP connector management', () => {
  const connectorId = uuid();
  const connectorName = 'MY STIX IMPORTER';
  const connectorType = CONNECTOR_INTERNAL_IMPORT_FILE;
  const connectorScope = 'application/json';
  it('should register the connector', async () => {
    const config = await registerConnectorQueues(connectorId, connectorName, connectorType, connectorScope);
    expect(config.uri).not.toBeNull();
    expect(config.push).toEqual(`push_${connectorId}`);
    expect(config.push_exchange).toEqual('amqp.worker.exchange');
    expect(config.listen).toEqual(`listen_${connectorId}`);
    expect(config.listen_exchange).toEqual('amqp.connector.exchange');
  });
  it('should connector queues available', async () => {
    // Just wait one second to let redis client initialize
    const data = await metrics();
    expect(data).not.toBeNull();
    expect(data.queues.length).toEqual(2);
    const aggregationMap = new Map(data.queues.map((q) => [q.name, q]));
    expect(aggregationMap.get(`listen_${connectorId}`)).not.toBeUndefined();
    expect(aggregationMap.get(`push_${connectorId}`)).not.toBeUndefined();
  });
  it('should push message to connector', async () => {
    const connector = { internal_id: connectorId };
    await pushToConnector(connector, { id: uuid() });
  });
  it('should delete connector', async () => {
    const unregister = await unregisterConnector(connectorId);
    expect(unregister.listen).not.toBeNull();
    expect(unregister.listen.messageCount).toEqual(1);
    expect(unregister.push).not.toBeNull();
    expect(unregister.push.messageCount).toEqual(0);
    const data = await metrics();
    const aggregationMap = new Map(data.queues.map((q) => [q.name, q]));
    expect(aggregationMap.get(`listen_${connectorId}`)).toBeUndefined();
    expect(aggregationMap.get(`push_${connectorId}`)).toBeUndefined();
  });
});
