import gql from 'graphql-tag' ;

const typeDefs = gql`
  # declares the query entry-points for this type
  extend type Query {
    # Characterization
    characterization(id: String!): Characterization
    characterizationList( 
      first: Int
      offset: Int
      orderedBy: CharacterizationsOrdering
      orderMode: OrderingMode
      filters: [CharacterizationsFiltering]
      filterMode: FilterMode
      search: String
    ): CharacterizationConnection
    # Facet
    facet(id: String!): Facet
    facetList( 
      first: Int
      offset: Int
      orderedBy: FacetsOrdering
      orderMode: OrderingMode
      filters: [FacetsFiltering]
      filterMode: FilterMode
      search: String
    ): FacetConnection
    # Log Entry
    logEntry(id: String!): LogEntry
    logEntryList( 
      first: Int
      offset: Int
      orderedBy: LogEntriesOrdering
      orderMode: OrderingMode
      filters: [LogEntriesFiltering]
      filterMode: FilterMode
      search: String
    ): LogEntryConnection
    # Observation
    observation(id: String!): Observation
    observationList( 
      first: Int
      offset: Int
      orderedBy: ObservationsOrdering
      orderMode: OrderingMode
      filters: [ObservationsFiltering]
      filterMode: FilterMode
      search: String
    ): ObservationConnection
    # Origin
    origin(id: String!): Origin
    originList( 
      first: Int
      offset: Int
      orderedBy: OriginsOrdering
      orderMode: OrderingMode
      filters: [OriginsFiltering]
      filterMode: FilterMode
      search: String
    ): OriginConnection
    # Remediation Task
    remediationTask(id: String!): RemediationTask
    remediationTaskList( 
      first: Int
      offset: Int
      orderedBy: RemediationTasksOrdering
      orderMode: OrderingMode
      filters: [RemediationTasksFiltering]
      filterMode: FilterMode
      search: String
    ): RemediationTaskConnection
    # Required Asset
    requiredAsset(id: String!): RequiredAsset
    requiredAssetList( 
      first: Int
      offset: Int
      orderedBy: RequiredAssetsOrdering
      orderMode: OrderingMode
      filters: [RequiredAssetsFiltering]
      filterMode: FilterMode
      search: String
    ): RequiredAssetConnection
    # Risk 
    risk(id: String!): Risk
    riskList( 
      first: Int
      offset: Int
      orderedBy: RisksOrdering
      orderMode: OrderingMode
      filters: [RisksFiltering]
      filterMode: FilterMode
      search: String
    ): RiskConnection
    riskCharacterization(id: String!): RiskCharacterization
    riskCharacterizationList( 
      first: Int
      offset: Int
      orderedBy: RiskCharacterizationsOrdering
      orderMode: OrderingMode
      filters: [RiskCharacterizationsFiltering]
      filterMode: FilterMode
      search: String
    ): RiskCharacterizationConnection
    # Risk Response
    riskResponse(id: String!): RiskResponse
    riskResponseList( 
      first: Int
      offset: Int
      orderedBy: RiskResponsesOrdering
      orderMode: OrderingMode
      filters: [RiskResponsesFiltering]
      filterMode: FilterMode
      search: String
    ): RiskResponseConnection
    # Subject
    subject(id: String!): Subject
    subjectList( 
      first: Int
      offset: Int
      orderedBy: SubjectsOrdering
      orderMode: OrderingMode
      filters: [SubjectsFiltering]
      filterMode: FilterMode
      search: String
    ): SubjectConnection
  }

  # declares the mutation entry-points for this type
  extend type Mutation {
    # Facet
    createFacet(input: FacetAddInput): Facet
    deleteFacet(id: String!): String!
    editFacet(id: String!, input: [EditInput]!, commitMessage: String): Facet
    # Generic Characterization
    createGenericCharacterization(input: GenericCharacterizationAddInput): GenericCharacterization
    deleteGenericCharacterization(id: String!): String!
    editGenericCharacterization(id: String!, input: [EditInput]!, commitMessage: String): GenericCharacterization
    # Log Entry
    createLogEntry(input: LogEntryAddInput): LogEntry
    deleteLogEntry(id: String!): String!
    editLogEntry(id: String!, input: [EditInput]!, commitMessage: String): LogEntry
    # Remediation Task
    createRemediationTask(input: RemediationTaskAddInput): RemediationTask
    deleteRemediationTask(id: String!): String!
    editRemediation(id: String!, input: [EditInput]!, commitMessage: String): RemediationTask
    # Risk 
    createRisk(input: RiskAddInput): Risk
    deleteRisk(id: String!): String!
    editRisk(id: String!, input: [EditInput]!, commitMessage: String): Risk
    # Risk Characterization
    createRiskCharacterization(input: RiskCharacterizationAddInput): RiskCharacterization
    deleteRiskCharacterization(id: String!): String!
    editRiskCharacterization(id: String!, input: [EditInput]!, commitMessage: String): RiskCharacterization
    # Risk Response
    createRiskResponse(input: RiskResponseAddInput): RiskResponse
    deleteRiskResponse(id: String!): String!
    editRiskResponse(id: String!, input: [EditInput]!, commitMessage: String): RiskResponse
    # Subject
    createSubject(input: SubjectAddInput): Subject
    deleteSubject(id: String!): String!
    editSubject(id: String!, input: [EditInput]!, commitMessage: String): Subject
    # Vulnerability Characterization
    createVulnerabilityCharacterization(input: VulnerabilityCharacterizationAddInput): VulnerabilityCharacterization
    deleteVulnerabilityCharacterization(id: String!): String!
    editVulnerabilityCharacterization(id: String!, input: [EditInput]!, commitMessage: String): VulnerabilityCharacterization
  }

## Activity
#
  "Defines identifying information about an assessment or related process that can be performed. In the assessment plan, this is an intended activity which may be associated with an assessment task. In the assessment results, this an activity that was actually performed as part of an assessment."
  type Activity implements RootObject & CoreObject & OscalObject {
    # Root Object
    "Uniquely identifies this object."
    id: String!
    "Identifies the type of the Object."
    entity_type: String!
    # CoreObject
    "Indicates the date and time at which the object was originally created."
    created: DateTime!
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime!
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OscalObject
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
    "Identifies one or more relationships to other entities."
    relationships(
      first: Int
      offset: Int
      orderedBy: OscalRelationshipsOrdering
      orderMode: OrderingMode
      filters: [OscalRelationshipsFiltering]
      filterMode: FilterMode
      search: String 
    ): OscalRelationshipConnection
    # Activity
    "Identifies the name for the activity."
    name: String!
    "Identifies a human-readable description of the activity."
    description: String!
    # "Identifies one or more steps related to an activity."
    # steps: [Step]
    # "Identifies the optional set of controls and control objectives that are assessed or remediated by this activity."
    # related_controls: [ControlReview]
    "Identifies the person or organization responsible for performing a specific role related to the task."
    responsible_roles: [OscalResponsibleParty]
  }

## Actor
#
  "Defines identifying information about an actor that produces an observation, a finding, or a risk."
  type Actor {
    "Identifies a reference to the tool or person based on the associated type."
    actor: PartyOrComponent!
    "Identifies the kind of actor"
    actor_type: ActorType!
    "For a party, this can optionally be used to specify the role the actor was performing."
    role: OscalRole
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
  }

  # Pagination Types
  type ActorConnection {
    pageInfo: PageInfo!
    edges: [ActorEdge]
  }

  type ActorEdge {
    cursor: String!
    node: Actor!
  }

  # Filtering Types
  input ActorsFiltering {
    key: ActorsFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum ActorsOrdering {
    actor_type
  }

  enum ActorsFilter {
    actor_type
  }

## AssessmentSubject
#
  "Defines the identifying information about the system elements being assessed, such as components, inventory items, and locations. In the assessment plan, this identifies a planned assessment subject. In the assessment results this is an actual assessment subject, and reflects any changes from the plan. exactly what will be the focus of this assessment. Any subjects not identified in this way are out-of-scope."
  type AssessmentSubject {
    "Indicates the type of assessment subject, such as a component, inventory, item, location, or party represented by this selection statement."
    subject_type: SubjectType!
    "Identifies a human-readable description of the collection of subjects being included in this assessment."
    description: String
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
    "Indicates to include all subjects."
    include_all: Boolean!
    "Identifies a set of assessment subjects to include"
    include_subjects: SubjectConnection
    "Identifies a set of assessment subjects to exclude"
    exclude_subjects: SubjectConnection
  }

## AssociatedActivity
#
  "Defines identifying information about an activity to be performed as part of a task."
  type AssociatedActivity {
    "Identifies a references to an activity defined in the list of activities."
    activity: Activity
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies the person or organization responsible for performing a specific role related to the task."
    responsible_roles: [OscalResponsibleParty]
    "Identifies an include/exclude pair starts with processing the include, then removing matching entries in the exclude."
    subject: [AssessmentSubject]
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
  }

## Characterization
#
  "Defines identifying information about a characterization of risk."
  interface Characterization {
    "Uniquely identifies this object."
    id: String!
    "Indicates the date and time at which the object was originally created."
    created: DateTime
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime
    # Characterization
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies a reference to tool that performed the detection."
    origins(first: Int): OriginConnection
    "Identifies one or more individual characteristic that is part of a larger set produced by the same actor."
    facets(first: Int): FacetConnection
  }

  # Pagination Types
  type CharacterizationConnection {
    pageInfo: PageInfo!
    edges: [CharacterizationEdge]
  }

  type CharacterizationEdge {
    cursor: String!
    node: CharacterizationType!
  }

  # Filtering Types
  input CharacterizationsFiltering {
    key: CharacterizationsFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum CharacterizationsOrdering {
    created
    modified
  }

  enum CharacterizationsFilter {
    created
    modified
  }

## DateRangeTiming
#
  "Defines identifying information about an Event Timing that occurs within a date range."
  type DateRangeTiming {
    "Identifies the specified date that the task must occur on or after."
    start_date: DateTime!
    "identifies the specific date that the task must occur on or before."
    end_date: DateTime
  }

  input DateRangeTimingAddInput {
    "Identifies the specified date that the task must occur on or after."
    start_date: DateTime!
    "identifies the specific date that the task must occur on or before."
    end_date: DateTime
  }

## Evidence
#
  "Defines identifying information about evidence relevant to this observation."
  type Evidence {
    "Identifies a resolvable URL reference to the relevant evidence."
    href: URL
    "Identifies a human-readable description of the evidence."
    description: String
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
  }

## Facet
#
  "Defines identifying information about a facet."
  type Facet {
    "Uniquely identifies this object."
    id: String!
    "Indicates if the facet is 'initial' as first identified, or 'adjusted' indicating that the value has be changed after some adjustments have been made (e.g., to identify residual risk)."
    risk_state: RiskState!
    "Identifies the name of the risk metric within the specified system."
    name: String!
    "Specifies the naming system under which this risk metric is organized, which allows for the same names to be used in different systems controlled by different parties."
    source_system: URL!
    "Indicates the value of the facet."
    value: String!
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
  }

  input FacetAddInput {
    "Indicates if the facet is 'initial' as first identified, or 'adjusted' indicating that the value has be changed after some adjustments have been made (e.g., to identify residual risk)."
    risk_state: RiskState!
    "Identifies the name of the risk metric within the specified system."
    name: String!
    "Specifies the naming system under which this risk metric is organized, which allows for the same names to be used in different systems controlled by different parties."
    source_system: URL!
    "Indicates the value of the facet."
    value: String!    
  }

  # Pagination Types
  type FacetConnection {
    pageInfo: PageInfo!
    edges: [FacetEdge]
  }

  type FacetEdge {
    cursor: String!
    node: Facet!
  }

  # Filtering Types
  input FacetsFiltering {
    key: FacetsFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum FacetsOrdering {
    risk_state
    name
    source_system
  }

  enum FacetsFilter {
    risk_state
    name
    source_system
  }

## Finding Target
#
  "Defines identifying information about the target of a finding."
  type FindingTarget {
    # "Identifies the type of the finding target."
    # target_type: FindingTargetType!
    # "Identifies the specific target."
    # target: StatementOrObjective!
    "Identifies a name for this objective status."
    name: String
    "Identifies a human-readable description of the assessor's conclusions regarding the degree to which an objective is satisfied."
    description: String
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies whether the objective is satisfied or not within a given system."
    objective_status_state: ObjectiveStatusState!
    "Identifies the reason the objective was given it's status."
    objective_status_reason: ObjectiveStatusReason
    "Identifies an explanation as to why the objective was not satisfied."
    objective_status_explanation: String
    "Indicates the degree to which the given control was implemented."
    implementation_status: ImplementationStatus
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
  }

## Generic Characterization
#
  "Defines identifying information about a Generic characterization of risk."
  type GenericCharacterization implements Characterization {
    "Uniquely identifies this object."
    id: String!
    "Indicates the date and time at which the object was originally created."
    created: DateTime
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime
    # Characterization
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies a reference to tool that performed the detection."
    origins(first: Int): OriginConnection
    "Identifies one or more individual characteristic that is part of a larger set produced by the same actor."
    facets(first: Int): FacetConnection!
  }

  input GenericCharacterizationAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
  }

## Log Entry
#
  "Defines identifying information about a risk log entry of all risk-related tasks taken."
  type LogEntry implements RootObject & CoreObject & OscalObject {
    # Root Object
    "Uniquely identifies this object."
    id: String!
    "Identifies the type of the Object."
    entity_type: String!
    # CoreObject
    "Indicates the date and time at which the object was originally created."
    created: DateTime!
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime!
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OscalObject
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
    "Identifies one or more relationships to other entities."
    relationships(
      first: Int
      offset: Int
      orderedBy: OscalRelationshipsOrdering
      orderMode: OrderingMode
      filters: [OscalRelationshipsFiltering]
      filterMode: FilterMode
      search: String 
    ): OscalRelationshipConnection
    # Entry
    "Identifies the type of remediation tracking entry."
    entry_type: [EntryType!]!
    "Identifies the name for the risk log entry."
    name: String!
    "Identifies a human-readable description of of what was done regarding the risk."
    description: String!
    "Identifies the start date and time of the event."
    event_start: DateTime!
    "Identifies the end date and time of the event. If the event is a point in time, the start and end will be the same date and time."
    event_end: DateTime
    "Used to indicate who created a log entry in what role."
    logged_by: [PartyOrComponent]
    "Identifies a change in risk status made resulting from the task described by this risk log entry. This allows the risk's status history to be captured as a sequence of risk log entries."
    status_change: RiskStatus
    "Identifies an individual risk response that this log entry is for."
    related_responses(first: Int): RiskResponseConnection
  }

  "Defines identifying information about a risk log entry of all risk-related tasks taken."
  input LogEntryAddInput  {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # Entry
    "Identifies the type of remediation tracking entry."
    entry_type: [EntryType!]!
    "Identifies the name for the risk log entry."
    name: String!
    "Identifies a human-readable description of of what was done regarding the risk."
    description: String!
    "Identifies the start date and time of the event."
    event_start: DateTime!
    "Identifies the end date and time of the event. If the event is a point in time, the start and end will be the same date and time."
    event_end: DateTime
    "Used to indicate the person created a log entry in what role."
    logged_by_person: [OscalPersonAddInput]
    "Used to indicate the organization created a log entry in what role."
    logged_by_organization: [OscalOrganizationAddInput]
    "Identifies a change in risk status made resulting from the task described by this risk log entry. This allows the risk's status history to be captured as a sequence of risk log entries."
    status_change: RiskStatus
  }

  # Pagination Types
  type LogEntryConnection {
    pageInfo: PageInfo!
    edges: [LogEntryEdge]
  }

  type LogEntryEdge {
    cursor: String!
    node: LogEntry!
  }

  # Filtering Types
  input LogEntriesFiltering {
    key: LogEntriesFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum LogEntriesOrdering {
    event_start
    event_end
    labels
    entry_type
  }

  enum LogEntriesFilter {
    created
    modified
    labels
  }

## Mitigating Factor
#
  "Defines identifying information about a mitigation factor."
  type MitigatingFactor implements RootObject & CoreObject & OscalObject {
    # Root Object
    "Uniquely identifies this object."
    id: String!
    "Identifies the type of the Object."
    entity_type: String!
    # CoreObject
    "Indicates the date and time at which the object was originally created."
    created: DateTime!
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime!
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OscalObject
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
    "Identifies one or more relationships to other entities."
    relationships(
      first: Int
      offset: Int
      orderedBy: OscalRelationshipsOrdering
      orderMode: OrderingMode
      filters: [OscalRelationshipsFiltering]
      filterMode: FilterMode
      search: String 
    ): OscalRelationshipConnection
    # Mitigating Factor
    # "Identifies a reference to an implementation statement in the SSP."
    # implementation_statement: ImplementationStatement
    "Identifies a human-readable description of this mitigating factor."
    description: String
    "Identifies a reference to one or more subjects of the observations.  The subject indicates what was observed, who was interviewed, or what was tested or inspected."
    subjects: SubjectConnection
  }

## Observation
#
  "Defines identifying information about an observation."
  type Observation implements RootObject & CoreObject & OscalObject {
    # Root Object
    "Uniquely identifies this object."
    id: String!
    "Identifies the type of the Object."
    entity_type: String!
    # CoreObject
    "Indicates the date and time at which the object was originally created."
    created: DateTime!
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime!
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OscalObject
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
    "Identifies one or more relationships to other entities."
    relationships(
      first: Int
      offset: Int
      orderedBy: OscalRelationshipsOrdering
      orderMode: OrderingMode
      filters: [OscalRelationshipsFiltering]
      filterMode: FilterMode
      search: String 
    ): OscalRelationshipConnection
    # Observation
    "Identifies the name for the observation."
    name: String!
    "Identifies a human-readable description of the assessment observation."
    description: String!
    "Identifies how the observation was made."
    methods: MethodTypes!
    "Identifies the nature of the observation. More than one may be used to further qualify and enable filtering."
    observation_types: [ObservationType]
    "Identifies one or more sources of the finding, such as a tool, interviewed person, or activity."
    origins(first: Int): OriginConnection
    "Identifies a reference to one or more subjects of the observations.  The subject indicates what was observed, who was interviewed, or what was tested or inspected."
    subjects: SubjectConnection
    "Identifies relevant evidence collected as part of this observation."
    relevant_evidence: [Evidence]
    "Identifies a Date/time stamp identifying when the finding information was collected."
    collected: DateTime!
    "Identifies Date/time identifying when the finding information is out-of-date and no longer valid. Typically used with continuous assessment scenarios."
    expires: DateTime
  }

  # Pagination Types
  type ObservationConnection {
    pageInfo: PageInfo!
    edges: [ObservationEdge]
  }

  type ObservationEdge {
    cursor: String!
    node: Observation!
  }

  # Filtering Types
  input ObservationsFiltering {
    key: ObservationsFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum ObservationsOrdering {
    created
    modified
    labels
    name
    methods
    observation_types
    collected
    expires
  }

  enum ObservationsFilter {
    created
    modified
    labels
    method
    observation_types
    collected
    expires
  }

## OnDateTiming
#
  "Defines identifying information about an Event Timing that occur on a specific date."
  type OnDateTiming {
    "Identifies the date that the task must occur on."
    on_date: DateTime!
  }

  input OnDateTimingAddInput {
    on_date: DateTime!
  }

## Origin
#
  "Defines identifying information about the source of the finding, such as a tool, interviewed person, or activity."
  type Origin {
    "Uniquely identifies this object."
    id: String!
    "Identifies one or more actors that produces an observation, a finding, or a risk. One or more actor type can be used to specify a person that is using a tool."
    origin_actors: [Actor!]!
    "Identifies one or more task for which the containing object is a consequence of."
    related_tasks(first: Int): RemediationTaskConnection
  }

  input OriginAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
  }

  # Pagination Types
  type OriginConnection {
    pageInfo: PageInfo!
    edges: [OriginEdge]
  }

  type OriginEdge {
    cursor: String!
    node: Origin!
  }
  # Filtering Types
  input OriginsFiltering {
    key: OriginsFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum OriginsOrdering {
    created
    modified
    labels
    name
    methods
    observation_types
    collected
    expires
  }

  enum OriginsFilter {
    created
    modified
    labels
    method
    observation_types
    collected
    expires
  }

## Remediation Task
#
  "Defines identifying information about a scheduled event or milestone, which may be associated with a series of assessment actions."
  type RemediationTask implements RootObject & CoreObject & OscalObject {
    # Root Object
    "Uniquely identifies this object."
    id: String!
    "Identifies the type of the Object."
    entity_type: String!
    # CoreObject
    "Indicates the date and time at which the object was originally created."
    created: DateTime!
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime!
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OscalObject
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
    "Identifies one or more relationships to other entities."
    relationships(
      first: Int
      offset: Int
      orderedBy: OscalRelationshipsOrdering
      orderMode: OrderingMode
      filters: [OscalRelationshipsFiltering]
      filterMode: FilterMode
      search: String 
    ): OscalRelationshipConnection
    # RemediationTask
    "Identifies the type of task."
    task_type: TaskType!
    "Identifies the name for the task."
    name: String!
    "Identifies a human-readable description of the task."
    description: String!
    "Identifies the timing under which the task is intended to occur."
    timing: EventTiming
    "Identifies that the task is dependent on another task."
    task_dependencies(first: Int): RemediationTaskConnection
    # ""
    # tasks(first: Int): RemediationTaskConnector
    "Identifies an individual activity to be performed as part of a task."
    associated_activities: [AssociatedActivity]
    "Identifies a reference to one or more subjects that the task is performed against: component, inventory item, party, users"
    subjects: [AssessmentSubject]
    "Identifies the person or organization responsible for performing a specific role related to the task."
    responsible_roles: [OscalResponsibleParty]
  }

  input RemediationTaskAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # RemediationTask
    "Identifies the type of task."
    task_type: TaskType!
    "Identifies the name for the task."
    name: String!
    "Identifies a human-readable description of the task."
    description: String!
    "Identifies the date range under which the task is intended to occur."
    timing_date_range: DateRangeTimingAddInput
    "Identifies the date under which the task is intended to occur."
    timing_on_date: OnDateTimingAddInput
  }

  # Pagination Types
  type RemediationTaskConnection {
    pageInfo: PageInfo!
    edges: [RemediationTaskEdge]
  }

  type RemediationTaskEdge {
    cursor: String!
    node: RemediationTask!
  }

  # Filtering Types
  input RemediationTasksFiltering {
    key: RemediationTaskFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum RemediationTasksOrdering {
    created
    modified
    task_type
    name
  }

  enum RemediationTaskFilter {
    created
    modified
    task_type
    name
  }

## RequiredAsset
#
  "Defines identifying information about an asset required to achieve remediation."
  type RequiredAsset implements RootObject & CoreObject & OscalObject {
    # Root Object
    "Uniquely identifies this object."
    id: String!
    "Identifies the type of the Object."
    entity_type: String!
    # CoreObject
    "Indicates the date and time at which the object was originally created."
    created: DateTime!
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime!
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OscalObject
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
    "Identifies one or more relationships to other entities."
    relationships(
      first: Int
      offset: Int
      orderedBy: OscalRelationshipsOrdering
      orderMode: OrderingMode
      filters: [OscalRelationshipsFiltering]
      filterMode: FilterMode
      search: String 
    ): OscalRelationshipConnection
    # Required Asset
    "Identifies a reference to one or more subjects, in the form of a party or tool required to achieve the remediation."
    subjects: SubjectConnection
    "Identifies the name of the required asset."
    name: String!
    "Identifies a human-readable description of the required asset."
    description: String!
  }

  input RequiredAssetAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # Required Asset
    "Identifies the name of the required asset."
    name: String!
    "Identifies a human-readable description of the required asset."
    description: String!
  }

  # Pagination Types
  type RequiredAssetConnection {
    pageInfo: PageInfo!
    edges: [RequiredAssetEdge]
  }

  type RequiredAssetEdge {
    cursor: String!
    node: RequiredAsset!
  }

  # Filtering Types
  input RequiredAssetsFiltering {
    key: RequiredAssetFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum RequiredAssetsOrdering {
    created
    modified
    labels
    name
  }

  enum RequiredAssetFilter {
    created
    modified
    labels
    name
  }

  # "Defines identifying information about a Risk"
  type Risk implements RootObject & CoreObject & OscalObject {
    # Root Object
    "Uniquely identifies this object."
    id: String!
    "Identifies the type of the Object."
    entity_type: String!
    # CoreObject
    "Indicates the date and time at which the object was originally created."
    created: DateTime!
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime!
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OscalObject
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
    "Identifies one or more relationships to other entities."
    relationships(
      first: Int
      offset: Int
      orderedBy: OscalRelationshipsOrdering
      orderMode: OrderingMode
      filters: [OscalRelationshipsFiltering]
      filterMode: FilterMode
      search: String 
    ): OscalRelationshipConnection
    # Risk
    "Identifies the name for the risk."
    name: String!
    "Identifies a human-readable summary of the identified risk, to include a statement of how the risk impacts the system."
    description: String!
    "Identifies a summary of impact for how the risk affects the system."
    statement: String!
    "Identifies the status of the associated risk."
    risk_status: RiskStatus!
    "Identifies one or more sources of the finding, such as a tool, interviewed person, or activity."
    origins(first: Int): OriginConnection
    "Identifies a reference to one or more externally-defined threats."
    threats: [ThreatReference]
    "Identifies a collection of descriptive data about the containing object from a specific origin."
    characterizations(first: Int): CharacterizationConnection
    "Identifies one or more existing mitigating factors that may affect the overall determination of the risk, with an optional link to an implementation statement in the SSP."
    mitigating_factors: [MitigatingFactor]
    "Identifies the date/time by which the risk must be resolved."
    deadline: DateTime
    "Identifies either recommended or an actual plan for addressing the risk."
    remediations(first: Int): RiskResponseConnection
    "log of all risk-related tasks taken."
    risk_log(first: Int): LogEntryConnection
    "Relates the finding to a set of referenced observations that were used to determine the risk.  This would be the Component in which the risk exists and the InventoryItem(s) in which theComponent is installed"
    related_observations(first: Int): ObservationConnection
    "Identifies that the risk has been confirmed to be a false positive."
    false_positive: RiskAssertionState
    "Identifies that the risk cannot be remediated without impact to the system and must be accepted."
    accepted: RiskAssertionState
    "Identifies that mitigating factors were identified or implemented, reducing the likelihood or impact of the risk."
    risk_adjusted: RiskAssertionState
    "Identifies Assessor's recommended risk priority. Lower numbers are higher priority. One (1) is highest priority."
    priority: PositiveInt
    "Identifies that a vendor resolution is pending, but not yet available."
    vendor_dependency: RiskAssertionState
    "Identifies a control impacted by this risk."
    impacted_control_id: String
  }

  input RiskAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    "Identifies the name for the risk."
    name: String!
    "Identifies a human-readable summary of the identified risk, to include a statement of how the risk impacts the system."
    description: String!
    "Identifies a summary of impact for how the risk affects the system."
    statement: String!
    "Identifies the status of the associated risk."
    risk_status: RiskStatus!
    "Identifies the date/time by which the risk must be resolved."
    deadline: DateTime
    "Identifies that the risk has been confirmed to be a false positive."
    false_positive: RiskAssertionState
    "Identifies that the risk cannot be remediated without impact to the system and must be accepted."
    accepted: RiskAssertionState
    "Identifies that mitigating factors were identified or implemented, reducing the likelihood or impact of the risk."
    risk_adjusted: RiskAssertionState
    "Identifies Assessor's recommended risk priority. Lower numbers are higher priority. One (1) is highest priority."
    priority: PositiveInt
    "Identifies that a vendor resolution is pending, but not yet available."
    vendor_dependency: RiskAssertionState
    "Identifies a control impacted by this risk."
    impacted_control_id: String
  }

  # Pagination Types
  type RiskConnection {
    pageInfo: PageInfo!
    edges: [RiskEdge]
  }

  type RiskEdge {
    cursor: String!
    node: Risk!
  }

  # Filtering Types
  input RisksFiltering {
    key: RisksFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum RisksOrdering {
    created
    modified
    labels
    name
    risk_status
    deadline
  }

  enum RisksFilter {
    created
    modified
    labels
    risk_status
    deadline
  }

## Risk Characterization
#
  "Defines identifying information about a general characterization of the risk."
  type RiskCharacterization implements Characterization {
    "Uniquely identifies this object."
    id: String!
    "Indicates the date and time at which the object was originally created."
    created: DateTime
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies a reference to tool that performed the detection."
    origins(first: Int): OriginConnection
    "Identifies one or more individual characteristic that is part of a larger set produced by the same actor."
    facets( first: Int ): FacetConnection
    # RiskCharacterization based on the OSCAL Facet
    "Indicates the state of the risk."
    risk_state: RiskState!
    "Identifies level of the risk."
    risk: RiskLevel!
    "Identifies a rating for the likelihood the risk could successfully occur."
    likelihood: RiskLikelihood!
    "Identifies a rating that if the risk were be successfully exploit, the level of impact it would have."
    impact: RiskImpact!
  }

  input RiskCharacterizationAddInput {
    "Identifies level of the risk."
    risk: RiskLevel!
    "Identifies a rating for the likelihood the risk could successfully occur."
    likelihood: RiskLikelihood!
    "Identifies a rating that if the risk were be successfully exploit, the level of impact it would have."
    impact: RiskImpact!
    # RiskCharacterization
    "Indicates the state of the characterization."
    risk_state: RiskState
  }

  # Filtering Types
  input RiskCharacterizationsFiltering {
    key: RiskCharacterizationsFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum RiskCharacterizationsOrdering {
    created
    modified
    labels
    name
    risk_status
    deadline
  }

  enum RiskCharacterizationsFilter {
    created
    modified
    labels
    risk_status
    deadline
  }

  # Pagination Types
  type RiskCharacterizationConnection {
    pageInfo: PageInfo!
    edges: [RiskCharacterizationEdge]
  }

  type RiskCharacterizationEdge {
    cursor: String!
    node: RiskCharacterization!
  }

## Risk Response
#
  "Defines identifying information about a response to a risk."
  type RiskResponse implements RootObject & CoreObject & OscalObject {
    # Root Object
    "Uniquely identifies this object."
    id: String!
    "Identifies the type of the Object."
    entity_type: String!
    # CoreObject
    "Indicates the date and time at which the object was originally created."
    created: DateTime!
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime!
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OscalObject
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
    "Identifies one or more relationships to other entities."
    relationships(
      first: Int
      offset: Int
      orderedBy: OscalRelationshipsOrdering
      orderMode: OrderingMode
      filters: [OscalRelationshipsFiltering]
      filterMode: FilterMode
      search: String 
    ): OscalRelationshipConnection
    # Risk Response
    "Identifies the type of response to the risk"
    response_type: ResponseType!
    "Identifies whether this is a recommendation, such as from an assessor or tool, or an actual plan accepted by the system owner."
    lifecycle: RiskLifeCyclePhase!
    "Identifies the name for the response activity."
    name: String!
    "Identifies a human-readable description of the response plan."
    description: String!
    "Identifies one or more sources of individuals and/or tools that generated this recommended or planned response."
    origins(first: Int): OriginConnection
    "Identifies an asset required to achieve remediation."
    required_assets(first: Int): RequiredAssetConnection
    "Identifies one or more scheduled events or milestones, which may be associated with a series of assessment actions."
    tasks(first: Int): RemediationTaskConnection
  }

  input RiskResponseAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # Risk Response
    "Identifies the type of response to the risk"
    response_type: ResponseType!
    "Identifies whether this is a recommendation, such as from an assessor or tool, or an actual plan accepted by the system owner."
    lifecycle: RiskLifeCyclePhase!
    "Identifies the name for the response activity."
    name: String!
    "Identifies a human-readable description of the response plan."
    description: String!
  }

  # Filtering Types
  input RiskResponsesFiltering {
    key: RiskResponseFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum RiskResponsesOrdering {
    risk_state
    name
    source_system
  }

  enum RiskResponseFilter {
    risk_state
    name
    source_system
  }

    # Pagination Types
    type RiskResponseConnection {
    pageInfo: PageInfo!
    edges: [RiskResponseEdge]
  }

  type RiskResponseEdge {
    cursor: String!
    node: RiskResponse!
  }


## Subject
#
  "Defines the identifying information about a resource. Use type to indicate whether the identified resource is a component, inventory item, location, user, or something else."
  type Subject {
    "Uniquely identifies this object."
    id: String!
    "Indicates the type of subject"
    subject_type: SubjectType!
    "Identifies a reference to a component, inventory-item, location, party, user, or resource."
    subject: SubjectTarget
    "Identifies the name for the referenced subject."
    name: String!
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies one or more references to additional commentary on the Model."
    notes( first: Int ): NoteConnection
  }

  input SubjectAddInput {
    "Indicates the type of subject"
    subject_type: SubjectType!
    "Identifies the name for the referenced subject."
    name: String!
  }

  # Pagination Types
  type SubjectConnection {
    pageInfo: PageInfo!
    edges: [SubjectEdge]
  }

  type SubjectEdge {
    cursor: String!
    node: Subject!
  }

  # Filtering Types
  input SubjectsFiltering {
    key: SubjectFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  enum SubjectsOrdering {
    subject_type
    name
  }

  enum SubjectFilter {
    subject_type
    name
  }

## Threat Reference
#
  "Defines identifying information about a reference to a threat."
  type ThreatReference {
    "Identifies the source of the threat information."
    source_system: URL!
    "Identifies an optional location for the threat data, from which this ID originates."
    href: URL
    "Identifies the specific identifier associated with the threat."
    threat_identifier: URL
  }

## Vulnerability Characterization
#
  "Defines identifying information about a characterization of a vulnerability."
  type VulnerabilityCharacterization implements Characterization {
    "Uniquely identifies this object."
    id: String!
    "Indicates the date and time at which the object was originally created."
    created: DateTime
    "Indicates the date and time that this particular version of the object was last modified."
    modified: DateTime
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
    "Identifies a reference to tool that performed the detection."
    origins(first: Int): OriginConnection
    "Identifies one or more individual characteristic that is part of a larger set produced by the same actor."
    facets( first: Int ): FacetConnection
    #VulnerabilityCharacterization
    "Indicates the state of the characterization."
    risk_state: RiskState
    "Indicates the identifier assigned to the vulnerability"
    vulnerability_id: String!
    "Identifies whether there is a known exploit available."
    exploit_available: Boolean
    "Identifies the maturity of the exploit."
    exploitability: ExploitMaturity
    "Identifies a rating for the severity of the risk."
    severity: VulnerabilitySeverity
    "Indicates a text representation of a set of CVSS v2.0 metrics."
    cvss2_vector_string: String
    "Indicates the CVSS v2 Base Score"
    cvss2_base_score: Float
    "Indicates the CVSS v2 Temporal Score"
    cvss2_temporal_score: Float
    "Indicates the CVSS v2 Environmental Score"
    cvss2_environmental_score: Float
    "Indicates a text representation of a set of CVSS v3.* metrics."
    cvss3_vector_string: String
    "Indicates the CVSS v3.* Base Score"
    cvss3_base_score: Float
    "Indicates the CVSS v3.* Temporal Score"
    cvss3_temporal_score: Float
    "Indicates the CVSS v3.* Environmental Score"
    cvss3_environmental_score: Float
    "Indicates the rationale behind the score"
    score_rationale: String
  }

  input VulnerabilityCharacterizationAddInput {
    #VulnerabilityCharacterization
    "Indicates the state of the characterization."
    risk_state: RiskState
    "Indicates the identifier assigned to the vulnerability"
    vulnerability_id: String!
    "Identifies whether there is a known exploit available."
    exploit_available: Boolean
    "Identifies the maturity of the exploit."
    exploitability: ExploitMaturity
    "Identifies a rating for the severity of the risk."
    severity: VulnerabilitySeverity
    "Indicates a text representation of a set of CVSS v2.0 metrics."
    cvss2_vector_string: String
    "Indicates the CVSS v2 Base Score"
    cvss2_base_score: Float
    "Indicates the CVSS v2 Temporal Score"
    cvss2_temporal_score: Float
    "Indicates the CVSS v2 Environmental Score"
    cvss2_environmental_score: Float
    "Indicates a text representation of a set of CVSS v3.* metrics."
    cvss3_vector_string: String
    "Indicates the CVSS v3.* Base Score"
    cvss3_base_score: Float
    "Indicates the CVSS v3.* Temporal Score"
    cvss3_temporal_score: Float
    "Indicates the CVSS v3.* Environmental Score"
    cvss3_environmental_score: Float
    "Indicates the rationale behind the score"
    score_rationale: String
  }

## Unions
#
  union CharacterizationType = GenericCharacterization | RiskCharacterization | VulnerabilityCharacterization
  union EventTiming = DateRangeTiming | OnDateTiming
  union PartyTypes = OscalPerson | OscalOrganization
  # union StatementOrObjects = ControlStatement | ControlObjective
  union PartyOrComponent = OscalPerson | OscalOrganization 
          | HardwareComponent | NetworkComponent | ServiceComponent | SoftwareComponent | SystemComponent
  union SubjectTarget = HardwareComponent | NetworkComponent | ServiceComponent | SoftwareComponent | SystemComponent  
  #       | InventoryItem
          | OscalLocation | OscalPerson | OscalOrganization 
          | OscalUser | OscalResource

## Enumerations
#
  "Defines the types of actors"
  enum ActorType {
    "A reference to a tool component defined with the assessment assets."
    tool
    "A reference to an assessment-platform defined with the assessment assets."
    assessment_platform
    "A reference to an assessment-platform defined with the assessment assets."
    party
  }

  "Defines the type of remediation tracking entry. Can be multi-valued."
  enum EntryType {
    "Contacted vendor to determine the status of a pending fix to a known vulnerability."
    vendor_check_in
    "Information related to the current state of response to this risk."
    status_update
    "A significant step in the response plan has been achieved."
    milestone_complete
    "An activity was completed that reduces the likelihood or impact of this risk."
    mitigation
    "An activity was completed that eliminates the likelihood or impact of this risk."
    remediated
    "The risk is no longer applicable to the system."
    closed
    "A deviation request was made to the authorizing official."
    dr_submission
    "A previously submitted deviation request has been modified."
    dr_updated
    "The authorizing official approved the deviation."
    dr_approved
    "The authorizing official rejected the deviation."
    dr_rejected
  }

  "Defines the maturity levels of an exploit."
  enum ExploitMaturity {
    "No exploit code is available, or an exploit is theoretical."
    unproven
    "Proof-of-concept exploit code is available, or an attack demonstration is not practical for most systems."
    proof_of_concept
    "Functional exploit code is available. The code works in most situations where the vulnerability exists."
    functional
    "Functional autonomous code exists, or no exploit is required (manual trigger) and details are widely available."
    high
    "Insufficient information to definitely know."
    not_defined
  }

  "Defines the states of a risk identification"
  enum RiskState {
    "As first identified."
    initial
    "Indicates that residual risk remains after some adjustments have been made."
    adjusted
  }

  "Identifies the implementation status of the control or control objective."
  enum ImplementationStatus {
    "The control is fully implemented."
    implemented
    "The control is partially implemented."
    partial
    "There is a plan for implementing the control as explained in the remarks."
    planned
    "There is a plan for implementing the control as explained in the remarks."
    alternative
    "This control does not apply to this system as justified in the remarks."
    not_applicable
  }

  "Defined the types of methods for making an observation."
  enum MethodTypes {
    "An inspection was performed."
    EXAMINE
    "An interview was performed."
    INTERVIEW
    "A manual or automated test was performed."
    TEST
  }

  "Defines the reasons for the objective status"
  enum ObjectiveStatusReason {
    "The target system or system component satisfied all the conditions."
    pass
    "The target system or system component did not satisfy all the conditions."
    fail
    "The target system or system component did not satisfy all the conditions."
    other
  }

  "Defines the states of the objective status"
  enum ObjectiveStatusState {
    "The objective has been completely satisfied"
    satisfied
    "The objective has not been completely satisfied, but may be partially satisfied"
    not_satisfied
  }

  "Defines the types of observations"
  enum ObservationType {
    "Identifies the nature of the observation. More than one may be used to further qualify and enable filtering."
    ssp_statement_issue
    "An observation about the status of a the associated control objective."
    control_objective
    "A mitigating factor was identified."
    mitigation
    "An assessment finding. Used for observations made by tools, penetration testing, and other means."
    finding
    "An observation from a past assessment, which was converted to OSCAL at a later date."
    historic
  }

  "Defines the types of risk responses"
  enum ResponseType {
    "The risk will be eliminated."
    avoid
    "The risk will be reduced."
    mitigate
    "The risk will be transferred to another organization or entity."
    transfer
    "The risk will continue to exist without further efforts to address it. (Sometimes referred to as 'Operationally required')"
    accept
    "The risk will be partially transferred to another organization or entity."
    share
    "Plans will be made to address the risk impact if the risk occurs. (This is a form of mitigation.)"
    contingency
    "No response, such as when the identified risk is found to be a false positive."
    none
  }

  "Defines the states of a risk assertion"
  enum RiskAssertionState {
    "Investigating assertion"
    investigating
    "Pending assertion decision"
    pending
    "Assertion approved"
    approved
    "Assertion withdrawn"
    withdrawn
  }

  "Defines the set of phase of the risk lifecycle."
  enum RiskLifeCyclePhase {
    "Recommended Remediation"
    recommendation
    "The actions intended to resolve the risk."
    planned
    "This remediation activities were performed to address the risk."
    completed
  }

  "Defines the set of risk impact levels"
  enum RiskImpact {
    "Expected to have multiple severe or catastrophic adverse effects organizational operations, assets, or individuals."
    very_high
    "Expected to have severe or catastrophic adverse effects on organizational operations, assets, or individuals."
    high
    "Expected to have serious adverse effect on organizational operations, assets, or individuals."
    moderate
    "Expected to have limited adverse effect on organizational operations, assets, or individuals."
    low
    "Expected to have negligible adverse effect on organizational operations, assets, or individuals."
    very_low
  }

  "Defines the set of risk likelihood levels"
  enum RiskLikelihood {
    "Almost certain to occur."
    very_high
    "Highly likely to occur."
    high
    "somewhat likely to occur."
    moderate
    "unlikely to occur."
    low
    "highly unlikely to occur."
    very_low
  }

  "Defines the set of risk levels"
  enum RiskLevel {
    "Expected to have multiple severe or catastrophic adverse effects organizational operations, assets, or individuals."
    very_high
    "Expected to have severe or catastrophic adverse effects on organizational operations, assets, or individuals."
    high
    "Expected to have serious adverse effect on organizational operations, assets, or individuals."
    moderate
    "Expected to have limited adverse effect on organizational operations, assets, or individuals."
    low
    "Expected to have negligible adverse effect on organizational operations, assets, or individuals."
    very_low
  }

  "Defines the type of status for a risk"
  enum RiskStatus {
    "The risk has been identified."
    open
    "The identified risk is being investigated. (Open risk)"
    investigating
    "Remediation activities are underway, but are not yet complete. (Open risk)"
    remediating
    "A risk deviation, such as false positive, risk reduction, or operational requirement has been submitted for approval. (Open risk)"
    deviation_requested
    "A risk deviation, such as false positive, risk reduction, or operational requirement has been approved. (Open risk)"
    deviation_approved
    "The risk has been resolved."
    closed
  }

  "Defines the type of tasks"
  enum TaskType {
    "The task represents a planned milestone."
    milestone
    "The task represents a specific assessment action to be performed."
    action
  }

  "Defines types of subjects"
  enum SubjectType {
    "Component"
    component
    "Inventory Item"
    inventory_item
    "Location"
    location
    "Interview Party"
    party
    "User"
    user
    "Resource or Artifact"
    resource
  }

  "Defines the set of risk severity level"
  enum VulnerabilitySeverity {
    "Vulnerability is exposed and exploitable, and its exploitation could result in severe impacts."
    very_high
    "Vulnerability is of high concern, based on the exposure of the vulnerability and ease of exploitation and/or on the severity of impacts that could result from its exploitation."
    high
    "Vulnerability is of moderate concern, based on the exposure of the vulnerability and ease of exploitation and/or on the severity of impacts that could result from its exploitation."
    moderate
    "Vulnerability is of minor concern, but effectiveness of remediation could be improved."
    low
    "Vulnerability is not of concern."
    very_low
  }

`;

export default typeDefs ;
