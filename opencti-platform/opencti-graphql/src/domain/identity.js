import { assoc, dissoc } from 'ramda';
import { createEntity, listEntities, loadEntityById } from '../database/grakn';
import { BUS_TOPICS } from '../config/conf';
import { notify } from '../database/redis';

export const findById = identityId => {
  return loadEntityById(identityId);
};
export const findAll = args => {
  const typedArgs = assoc('types', ['User', 'Organization', 'Region', 'Country', 'City'], args);
  return listEntities(['name', 'alias'], typedArgs);
};

export const addIdentity = async (user, identity) => {
  const innerType = identity.type;
  const identityToCreate = dissoc('type', identity);
  const created = await createEntity(identityToCreate, innerType);
  return notify(BUS_TOPICS.StixDomainEntity.ADDED_TOPIC, created, user);
};
