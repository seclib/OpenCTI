import React, { ReactNode, createContext, useMemo, useState } from 'react';
import { FilterGroup, emptyFilterGroup } from 'src/utils/filters/filtersUtils';
import { handleFilterHelpers } from 'src/utils/hooks/useLocalStorage';

interface CreateRelationshipContextStateType {
  relationshipTypes?: string[];
  stixCoreObjectTypes?: string[];
  connectionKey?: string;
  filters?: FilterGroup;
  reversed?: boolean;
  helpers?: handleFilterHelpers;
  paginationOptions?: unknown;
  onCreate?: () => void;
}

export interface CreateRelationshipContextType {
  state: CreateRelationshipContextStateType;
  setState: (state: CreateRelationshipContextStateType) => void;
}

const defaultContext: CreateRelationshipContextType = {
  state: {
    relationshipTypes: [],
    stixCoreObjectTypes: [],
    connectionKey: 'Pagination_stixCoreObjects',
    filters: emptyFilterGroup,
    reversed: false,
  },
  setState: () => {},
};

export const CreateRelationshipContext = createContext<CreateRelationshipContextType>(defaultContext);

const CreateRelationshipContextProvider = ({ children }: { children: ReactNode }) => {
  const [relationshipTypes, setRelationshipTypes] = useState<string[]>([]);
  const [stixCoreObjectTypes, setStixCoreObjectTypes] = useState<string[]>([]);
  const [connectionKey, setConnectionKey] = useState<string>('Pagination_stixCoreObjects');
  const [filters, setFilters] = useState<FilterGroup>(emptyFilterGroup);
  const [reversed, setReversed] = useState<boolean>(false);
  const [helpers, setHelpers] = useState<handleFilterHelpers>();
  const [paginationOptions, setPaginationOptions] = useState<unknown>();
  const [onCreate, setOnCreate] = useState<() => void>();
  const state = {
    relationshipTypes,
    stixCoreObjectTypes,
    connectionKey,
    filters,
    reversed,
    helpers,
    paginationOptions,
    onCreate,
  };
  const setState = ({
    relationshipTypes,
    stixCoreObjectTypes,
    connectionKey,
    filters,
    reversed,
    helpers,
    paginationOptions,
    onCreate,
  }: CreateRelationshipContextStateType) => {
    if (relationshipTypes) setRelationshipTypes(relationshipTypes);
    if (stixCoreObjectTypes) setStixCoreObjectTypes(stixCoreObjectTypes);
    if (connectionKey) setConnectionKey(connectionKey);
    if (filters) setFilters(filters);
    if (reversed) setReversed(reversed);
    if (helpers) setHelpers(helpers);
    if (paginationOptions) setPaginationOptions(paginationOptions);
    if (onCreate) setOnCreate(onCreate);
  };
  const values = useMemo<CreateRelationshipContextType>(() => ({
    state,
    setState,
  }), [...Object.values(state)]);
  return <CreateRelationshipContext.Provider value={values}>
    {children}
  </CreateRelationshipContext.Provider>;
};

export default CreateRelationshipContextProvider;
