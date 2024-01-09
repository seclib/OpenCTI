// region registration attributes, need to be imported before any other modules
import './attributes/basicObject-registrationAttributes';
import './attributes/stixObject-registrationAttributes';
import './attributes/stixCoreObject-registrationAttributes';
import './attributes/stixDomainObject-registrationAttributes';
import './attributes/internalObject-registrationAttributes';
import './attributes/basicRelationship-registrationAttributes';
import './attributes/internalRelationship-registrationAttributes';
import './attributes/stixRelationship-registrationAttributes';
import './attributes/stixCoreRelationship-registrationAttributes';
import './attributes/stixRefRelationship-registrationAttributes';
import './attributes/stixSightingRelationship-registrationAttributes';
import './attributes/stixCyberObservable-registrationAttributes';
import './attributes/stixMetaObject-registrationAttributes';
// endregion

// region registration ref, need to be imported before any other modules
import './relationsRef/stixCoreObject-registrationRef';
import './relationsRef/stixDomainObject-registrationRef';
import './relationsRef/stixRelationship-registrationRef';
import './relationsRef/internalRelationship-registrationRef';
import './relationsRef/internalObject-registrationRef';
import './relationsRef/stixMetaObject-registrationRef';
import './relationsRef/stixCyberObservable-registrationRef';
// endregion

// region registration modules, need to be imported before graphql code registration
import './channel/channel';
import './language/language';
import './event/event';
import './grouping/grouping';
import './narrative/narrative';
import './notification/notification';
import './dataComponent/dataComponent';
import './dataSource/dataSource';
import './vocabulary/vocabulary';
import './administrativeArea/administrativeArea';
import './task/task';
import './task/task-template/task-template';
import './case/case';
import './case/case-template/case-template';
import './case/case-incident/case-incident';
import './case/case-rfi/case-rfi';
import './case/case-rft/case-rft';
import './case/feedback/feedback';
import './entitySetting/entitySetting';
import './workspace/workspace';
import './malwareAnalysis/malwareAnalysis';
import './managerConfiguration/managerConfiguration';
import './notifier/notifier';
import './threatActorIndividual/threatActorIndividual';
import './playbook/playbook';
import './ingestion/ingestion-rss';
import './ingestion/ingestion-taxii';
import './ingestion/ingestion-csv';
import './indicator/indicator';
import './decayRule/decayRule';
import './organization/organization';
import './internal/csvMapper/csvMapper';
import './internal/document/document';
import './publicDashboard/publicDashboard';
// endregion

// region graphql registration
import './channel/channel-graphql';
import './language/language-graphql';
import './event/event-graphql';
import './grouping/grouping-graphql';
import './narrative/narrative-graphql';
import './notification/notification-graphql';
import './dataComponent/dataComponent-graphql';
import './dataSource/dataSource-graphql';
import './vocabulary/vocabulary-graphql';
import './administrativeArea/administrativeArea-graphql';
import './task/task-graphql';
import './task/task-template/task-template-graphql';
import './case/case-graphql';
import './case/case-template/case-template-graphql';
import './case/case-incident/case-incident-graphql';
import './case/case-rfi/case-rfi-graphql';
import './case/case-rft/case-rft-graphql';
import './case/feedback/feedback-graphql';
import './entitySetting/entitySetting-graphql';
import './workspace/workspace-graphql';
import './malwareAnalysis/malwareAnalysis-graphql';
import './managerConfiguration/managerConfiguration-graphql';
import './notifier/notifier-graphql';
import './threatActorIndividual/threatActorIndividual-graphql';
import './playbook/playbook-graphql';
import './ingestion/ingestion-rss-graphql';
import './ingestion/ingestion-taxii-graphql';
import './ingestion/ingestion-csv-graphql';
import './indicator/indicator-graphql';
import './decayRule/decayRule-graphql';
import './organization/organization-graphql';
import './internal/csvMapper/csvMapper-graphql';
import './publicDashboard/publicDashboard-graphql';
import './ai/ai-graphql';
// import './internal/document/document-graphql'; # Not needed as document is not fully registered
// endregion
