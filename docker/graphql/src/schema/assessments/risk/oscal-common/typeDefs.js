import gql from 'graphql-tag' ;

// contains common type definitions used across OSCAL objects
const typeDefs = gql`
  # declares the query entry-points for this type
  extend type Query {
    # OSCAL Location
    oscalLocation(id: String!): OscalLocation
    oscalLocationList(
      first: Int
      offset: Int
      orderedBy: OscalLocationsOrdering
      orderMode: OrderingMode
      filters: [OscalLocationsFiltering]
      filterMode: FilterMode
      search: String
    ): OscalLocationConnection
    # OSCAL Organization
    oscalOrganization(id: String!): OscalOrganization
    oscalOrganizationList(
      first: Int
      offset: Int
      orderedBy: OscalOrganizationsOrdering
      orderMode: OrderingMode
      filters: [OscalOrganizationsFiltering]
      filterMode: FilterMode
      search: String
    ): OscalOrganizationConnection
    # OSCAL Party
    oscalParty(id: String!): OscalParty
    oscalPartyList(
      first: Int
      offset: Int
      orderedBy: OscalPartiesOrdering
      orderMode: OrderingMode
      filters: [OscalPartiesFiltering]
      filterMode: FilterMode
      search: String
    ): OscalPartyConnection
    # OSCAL Relationship
    oscalRelationship(id: String!): OscalRelationship
    oscalRelationshipList(
      first: Int
      offset: Int
      orderedBy: OscalRelationshipsOrdering
      orderMode: OrderingMode
      filters: [OscalRelationshipsFiltering]
      filterMode: FilterMode
      search: String
    ): OscalRelationshipConnection
    # OSCAL Resource
    oscalResource(id: String!): OscalResource
    oscalResourceList(
      first: Int
      offset: Int
      orderedBy: OscalResourcesOrdering
      orderMode: OrderingMode
      filters: [OscalResourcesFiltering]
      filterMode: FilterMode
      search: String
    ): OscalResourceConnection
    # OSCAL Responsible Party
    oscalResponsibleParty(id: String!): OscalResponsibleParty
    oscalResponsiblePartyList(
      first: Int
      offset: Int
      orderedBy: OscalResponsiblePartiesOrdering
      orderMode: OrderingMode
      filters: [OscalResponsiblePartiesFiltering]
      filterMode: FilterMode
      search: String
    ): OscalResponsiblePartyConnection
    # OSCAL Role
    oscalRole(id: String!): OscalRole
    oscalRoleList(
      first: Int
      offset: Int
      orderedBy: OscalRolesOrdering
      orderMode: OrderingMode
      filters: [OscalRolesFiltering]
      filterMode: FilterMode
      search: String
    ): OscalRoleConnection
    # OSCAL User
    oscalUser(id: String!): OscalUser
    oscalUserList(
      first: Int
      offset: Int
      orderedBy: OscalUsersOrdering
      orderMode: OrderingMode
      filters: [OscalUsersFiltering]
      filterMode: FilterMode
      search: String
    ): OscalUserConnection
  }

  # declares the mutation entry-points for this type
  extend type Mutation {
    # Base64Content
    createBase64Content(input: Base64ContentAddInput): Base64Content
    deleteBase64Content(id: String!): String!
    editBase64Content( id: String!, input: [EditInput]!, commitMessage: String): Base64Content
    # Citation
    createCitation(input: CitationAddInput): Citation
    deleteCitation(id: String!): String!
    editCitation( id: String!, input: [EditInput]!, commitMessage: String): Citation
    # OSCAL Location
    createOscalLocation(input: OscalLocationAddInput): OscalLocation
    deleteOscalLocation(id: String!): String!
    editOscalLocation( id: String!, input: [EditInput]!, commitMessage: String): OscalLocation
    # OSCAL Organization
    createOscalOrganization(input: OscalOrganizationAddInput): OscalOrganization
    deleteOscalOrganization(id: String!): String!
    editOscalOrganization( id: String!, input: [EditInput]!, commitMessage: String): OscalOrganization
    # OSCAL Person
    createOscalPerson(input: OscalPersonAddInput): OscalPerson
    deleteOscalPerson(id: String!): String!
    editOscalPerson( id: String!, input: [EditInput]!, commitMessage: String): OscalPerson
    # OSCAL Relationship
    createOscalRelationship(input: OscalRelationshipAddInput): OscalRelationship
    deleteOscalRelationship(id: String!): String!
    editOscalRelationship( id: String!, input: [EditInput]!, commitMessage: String): OscalRelationship
    # OSCAL Resource
    createOscalResource(input: OscalResourceAddInput): OscalResource
    deleteOscalResource(id: String!): String!
    editOscalResource( id: String!, input: [EditInput]!, commitMessage: String): OscalResource
    # OSCAL Responsible Party
    createOscalResponsibleParty(input: OscalResponsiblePartyAddInput): OscalResponsibleParty
    deleteOscalResponsibleParty(id: String!): String!
    editOscalResponsibleParty( id: String!, input: [EditInput]!, commitMessage: String): OscalResponsibleParty
    # OSCAL Role
    createOscalRole(input: OscalRoleAddInput): OscalRole
    deleteOscalRole(id: String!): String!
    editOscalRole( id: String!, input: [EditInput]!, commitMessage: String): OscalRole
    # OSCAL User
    createOscalUser(input: OscalUserAddInput): OscalUser
    deleteOscalUser(id: String!): String!
    editOscalUser( id: String!, input: [EditInput]!, commitMessage: String): OscalUser
    
  }

  "Defines identifying information about a system privilege held by the user."
  type AuthorizedPrivilege {
    "Identifies a human readable name for the privilege."
    name: String!
    "Identifies a summary of the privilege's purpose within the system."
    description: String
    "Identifies one or more functions performed for a given authorized privilege by this user class."
    functions_performed: [String!]
  }

  input AuthorizedPrivilegeAddInput {
    "Identifies a human readable name for the privilege."
    name: String!
    "Identifies a summary of the privilege's purpose within the system."
    description: String
    "Identifies one or more functions performed for a given authorized privilege by this user class."
    functions_performed: [String!]
  }

  "Defines identifying information about Base64 Content"
  type Base64Content {
    "Identifies the name of the file before it was encoded as Base64 to be embedded in a resource. This is the name that will be assigned to the file when the file is decoded."
    filename: String
    "Identifies the media type as defined by the Internet Assigned Numbers Authority (IANA)."
    media_type: String
    "Identifies the content that is base64 encoded."
    value: String
  }

  input Base64ContentAddInput {
    filename: String
    media_type: String
    value: String
  }

  "Defines identifying information about a citation."
  type Citation {
    "Identifies a line of citation text."
    text: String!
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references( first: Int ): ExternalReferenceConnection
  }

  input CitationAddInput {
    "Identifies a line of citation text."
    text: String!
    "Identifies a list of ExternalReferences, each of which refers to information external to the data model. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems."
    external_references: [ExternalReferenceAddInput]
  }

  "Defines identifying information about an OSCAL Model."
  interface Model {
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
    # Metadata
    "Identifies the name given to the document."
    name: String!
    "Identifies the date and time the document was published."
    published: DateTime
    "Identifies the date and time the document as last modified."
    last_modified: DateTime!
    "Identifies the current version of the document."
    version: String!
    "Identifies the OSCAL model version the document was authored against."
    oscal_version: String!
    "Identifies a list of revisions to the containing document."
    revisions: [Revision]
    "Identifies references to previous versions of this document."
    document_ids: [ID]
    "Identifies one or more references to a function assumed or expected to be assumed by a party in a specific situation."
    roles( first: Int ): OscalRoleConnection
    "Identifies one or more references to a location."
    locations( first: Int ): OscalLocationConnection
    "Identifies one or more references to a responsible entity which is either a person or an organization."
    parties( first: Int ): OscalPartyConnection
    "Identifies one or more references to a set of organizations or persons that have responsibility for performing a referenced role in the context of the containing object."
    responsible_parties( first: Int ): OscalResponsiblePartyConnection
    # Back-matter
    resources( first: Int ): OscalResourceConnection
  }

  "Defines the identifying information about an OSCAL object."
  interface OscalObject {
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
  }

  "Defines identifying information about a location."
  type OscalLocation implements RootObject & CoreObject & OscalObject & Location {
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
    # Location
    "Identifies the name given to the location."
    name: String!
    "Identifies a brief description of the location."
    description: String
    # OscalLocation
    "Identifies the type of the location."
    location_type: LocationType
    "Identifies the purpose of the location."
    location_class: LocationClass
    "Identifies a postal addresses for the location."
    address: CivicAddress
    "Identifies one or more email addresses for the location."
    email_addresses: EmailAddress
    "Identifies one or more telephone numbers used to contact the the location."
    telephone_numbers: [TelephoneNumber]
    "Identifies one or more uniform resource locator (URL) for a web site or Internet presence associated with the location."
    urls: [URL]
  }

  input OscalLocationAddInput {
    labels: [String]
    # Location
    name: String!
    description: String
    # OscalLocation
    location_type: LocationType
    location_class: LocationClass
    address: [CivicAddressAddInput]
    email_addresses: EmailAddress
    telephone_numbers: [TelephoneNumberAddInput]
    urls: [URL]
  }

    # Pagination Types
    type OscalLocationConnection {
    pageInfo: PageInfo!
    edges: [OscalLocationEdge]
  }
  type OscalLocationEdge {
    cursor: String!
    node: OscalLocation!
  }

  # Filtering Types
  enum OscalLocationsOrdering {
    created
    modified
    labels
  }
  enum OscalLocationsFilter {
    created
    modified
    labels
  }
  input OscalLocationsFiltering {
    key: OscalLocationsFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  "Defines identifying information about an OSCAL Location"
  type OscalOrganization implements RootObject & CoreObject & OscalObject & Identity & OscalParty {
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
    # Identity
    "Identifies the name given to the party."
    name: String!
    "Identifies a brief description of the Party."
    description: String
    # OscalParty
    "Identifies the kind of party the object describes."
    party_type: PartyType!
    "Identifies a short common name, abbreviation, or acronym for the party."
    short_name: String
    "Identifies one or more external identifiers for a person or organization using a designated scheme. e.g. an Open Researcher and Contributor ID (ORCID)."
    external_ids( first: Int ): ExternalReferenceConnection
    "Identifies a postal addresses for the location."
    address: CivicAddress
    "Identifies one or more email addresses for the location."
    email_addresses: EmailAddress
    "Identifies one or more telephone numbers used to contact the the location."
    telephone_numbers: [TelephoneNumber]
    "Identifies one or more references to a location."
    locations: [OscalLocation]
    "Identifies that the party object is a member of the organization."
    member_of_organizations: [OscalOrganization]
    "Identifies a mail stop associated with the party."
    mail_stop: String
    "Identifies the name or number of the party's office."
    office: String
  }

  input OscalOrganizationAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # Identity
    "Identifies the name given to the party."
    name: String!
    "Identifies a brief description of the Party."
    description: String
    # OscalParty
    "Identifies the kind of party the object describes."
    party_type: PartyType!
    "Identifies a short common name, abbreviation, or acronym for the party."
    short_name: String
    "Identifies a postal addresses for the location."
    address: CivicAddressAddInput
    "Identifies one or more email addresses for the location."
    email_addresses: EmailAddress
    "Identifies one or more telephone numbers used to contact the the location."
    telephone_numbers: [TelephoneNumberAddInput]
    "Identifies a mail stop associated with the party."
    mail_stop: String
    "Identifies the name or number of the party's office."
    office: String
  }

  # Pagination Types
  type OscalOrganizationConnection {
    pageInfo: PageInfo!
    edges: [OscalOrganizationEdge]
  }
  type OscalOrganizationEdge {
    cursor: String!
    node: OscalOrganization!
  }

  # Filtering Types
  enum OscalOrganizationsOrdering {
    created
    modified
    labels
  }
  enum OscalOrganizationsFilter {
    created
    modified
    labels
  }
  input OscalOrganizationsFiltering {
    key: OscalOrganizationsFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  "Defines identifying information about a Party in OSCAL"
  interface OscalParty {
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
    # Identity
    "Identifies the name given to the party."
    name: String!
    "Identifies a brief description of the Party."
    description: String
    # OscalParty
    "Identifies the kind of party the object describes."
    party_type: PartyType!
    "Identifies a short common name, abbreviation, or acronym for the party."
    short_name: String
    "Identifies one or more external identifiers for a person or organization using a designated scheme. e.g. an Open Researcher and Contributor ID (ORCID)."
    external_ids( first: Int ): ExternalReferenceConnection
    "Identifies a postal addresses for the location."
    address: CivicAddress
    "Identifies one or more email addresses for the location."
    email_addresses: EmailAddress
    "Identifies one or more telephone numbers used to contact the the location."
    telephone_numbers: [TelephoneNumber]
    "Identifies one or more references to a location."
    locations: [OscalLocation]
    "Identifies that the party object is a member of the organization."
    member_of_organizations: [OscalOrganization]
    "Identifies a mail stop associated with the party."
    mail_stop: String
    "Identifies the  name or number of the party's office."
    office: String
  }

  # Pagination Types
  type OscalPartyConnection {
    pageInfo: PageInfo!
    edges: [OscalPartyEdge]
  }
  type OscalPartyEdge {
    cursor: String!
    node: OscalParty!
  }

  # Filtering Types
  enum OscalPartiesOrdering {
    created
    modified
    labels
  }
  enum OscalPartiesFilter {
    created
    modified
    labels
  }
  input OscalPartiesFiltering {
    key: OscalPartiesFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }

  "Defines identifying information about a Person in OSCAL"
  type OscalPerson implements RootObject & CoreObject & OscalObject & Identity & OscalParty {
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
    # Identity
    "Identifies the name given to the party."
    name: String!
    "Identifies a brief description of the Party."
    description: String
    # OscalParty
    "Identifies the kind of party the object describes."
    party_type: PartyType!
    "Identifies a short common name, abbreviation, or acronym for the party."
    short_name: String
    "Identifies one or more external identifiers for a person or organization using a designated scheme. e.g. an Open Researcher and Contributor ID (ORCID)."
    external_ids( first: Int ): ExternalReferenceConnection
    "Identifies a postal addresses for the location."
    address: CivicAddress
    "Identifies one or more email addresses for the location."
    email_addresses: EmailAddress
    "Identifies one or more telephone numbers used to contact the the location."
    telephone_numbers: [TelephoneNumber]
    "Identifies one or more references to a location."
    locations: [OscalLocation]
    "Identifies that the party object is a member of the organization."
    member_of_organizations: [OscalOrganization]
    "Identifies a mail stop associated with the party."
    mail_stop: String
    "Identifies the name or number of the party's office."
    office: String
    "Identifies the formal job title of a person."
    job_title: String
  }

  input OscalPersonAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # Identity
    "Identifies the name given to the party."
    name: String!
    "Identifies a brief description of the Party."
    description: String
    # OscalParty
    "Identifies the kind of party the object describes."
    party_type: PartyType!
    "Identifies a short common name, abbreviation, or acronym for the party."
    short_name: String
    "Identifies a postal addresses for the location."
    address: CivicAddressAddInput
    "Identifies one or more email addresses for the location."
    email_addresses: EmailAddress
    "Identifies one or more telephone numbers used to contact the the location."
    telephone_numbers: [TelephoneNumberAddInput]
    mail_stop: String
    "Identifies the name or number of the party's office."
    office: String
    "Identifies the formal job title of a person."
    job_title: String
  }

  # Pagination Types
  type OscalPersonConnection {
    pageInfo: PageInfo!
    edges: [OscalPersonEdge]
  }
  type OscalPersonEdge {
    cursor: String!
    node: OscalPerson!
  }

  # Filtering Types
  enum OscalPersonOrdering {
    created
    modified
    labels
  }
  enum OscalPersonsFilter {
    created
    modified
    labels
  }
  input OscalPersonsFiltering {
    key: OscalPersonsFilter!
    values: [String]!
    operator: String
    filterMode: FilterMode
  }
  

  "Defines identifying information about a relationship in OSCAL"
  type OscalRelationship {
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
    # OscalRelationship
    "Identifies the type of the relationship"
    relationship_type: String!
    "Identifies a human-readable description about the relationship"
    description: String
    "Identifies the source of the relationship"
    source: ID
    "Identifies the target of the relationship"
    target: ID
    "Indicates the time and date when the relationship was first established"
    valid_from: DateTime
    "Indicates the time and date when the relationship was terminated."
    valid_until: DateTime
    "Identifies the level of confidence in the assertion."
    confidence: PositiveInt
  }

  input OscalRelationshipAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OscalRelationship
    "Identifies the type of the relationship"
    relationship_type: String!
    "Identifies a human-readable description about the relationship"
    description: String
    "Identifies the source of the relationship"
    source: ID
    "Identifies the target of the relationship"
    target: ID
    "Indicates the time and date when the relationship was first established"
    valid_from: DateTime
    "Indicates the time and date when the relationship was terminated."
    valid_until: DateTime
    "Identifies the level of confidence in the assertion."
    confidence: PositiveInt
  }

  # Filtering
  input OscalRelationshipsFiltering {
    key: OscalRelationshipsFilter!
    values: [String]
    operator: String
    filterMode: FilterMode
  }

  enum OscalRelationshipsOrdering {
    relationship_type
    created
    modified
    confidence
    valid_from
    valid_until
  }
  enum OscalRelationshipsFilter {
    source
    target
    created
    modified
    confidence
  }

  # Pagination
  type OscalRelationshipConnection {
    pageInfo: PageInfo!
    edges: [OscalRelationshipEdge]
  }

  type OscalRelationshipEdge {
    cursor: String!
    node: OscalRelationship!
  }


  "Defines identifying information about a resource in OSCAL"
  type OscalResource implements RootObject & CoreObject & OscalObject {
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
    # Resource
    "Identifies the type of resource represented."
    resource_type: ResourceType!
    "Identifies the version number of a published document."
    version: String
    "Identifies the publication date of a published document."
    published: DateTime
    "Identifies the name given to the party."
    name: String!
    "Identifies a brief description of the Party."
    description: String
    "Identifies references to previous versions of this document."
    document_ids: [OscalObject]
    "Identifies a citation consisting of end note text and optional structured bibliographic data."
    citations: [Citation]
    "identifies one or more references to an external resource with an optional hash for verification and change detection."
    rlinks(first: Int): ExternalReferenceConnection
    "Identifies the base64 encoded content."
    base64: Base64Content
  }

  input OscalResourceAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # Resource
    "Identifies the type of resource represented."
    resource_type: ResourceType!
    "Identifies the version number of a published document."
    version: String
    "Identifies the publication date of a published document."
    published: DateTime
    "Identifies the name given to the party."
    name: String!
    "Identifies a brief description of the Party."
    description: String
    "Identifies references to previous versions of this document."
    document_ids: [ID]
    "Identifies a citation consisting of end note text and optional structured bibliographic data."
    citations: [CitationAddInput]
    "Identifies the base64 encoded content."
    base64: Base64ContentAddInput
  }

  # Filtering
  input OscalResourcesFiltering {
    key: OscalResourcesFilter!
    values: [String]
    operator: String
    filterMode: FilterMode
  }

  enum OscalResourcesOrdering {
    created
    modified
    resource_type
    version
    published
    name
  }
  enum OscalResourcesFilter {
    created
    modified
    resource_type
    version
    published
    name
  }

  # Pagination
  type OscalResourceConnection {
    pageInfo: PageInfo!
    edges: [OscalResourceEdge]
  }

  type OscalResourceEdge {
    cursor: String!
    node: OscalResource!
  }

  "Defines identifying information about a Responsible Party in OSCAL"
  type OscalResponsibleParty implements OscalObject {
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
    # ResponsibleParty
    "Identifies a reference to the role that the party is responsible for."
    role: OscalRole!
    "Identifies one or more references to the parties that are responsible for performing the associated role."
    parties: [OscalParty]
  }

  input OscalResponsiblePartyAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # ResponsibleParty
    "Identifies a reference to the role that the party is responsible for."
    role: OscalRoleAddInput!
    "Identifies one or more references to the parties that are responsible for performing the associated role."
    organization: [OscalOrganizationAddInput]
    person: [OscalPersonAddInput]
  }

  # Filtering
  input OscalResponsiblePartiesFiltering {
    key: OscalResponsiblePartiesFilter!
    values: [String]
    operator: String
    filterMode: FilterMode
  }

  enum OscalResponsiblePartiesOrdering {
    created
    modified
    labels
  }
  enum OscalResponsiblePartiesFilter {
    created
    modified
    labels
  }

  # Pagination
  type OscalResponsiblePartyConnection {
    pageInfo: PageInfo!
    edges: [OscalResponsiblePartyEdge]
  }

  type OscalResponsiblePartyEdge {
    cursor: String!
    node: OscalResponsibleParty!
  }

  "Defines identifying information about a function assumed or expected to be assumed by a party in a specific situation."
  type OscalRole implements RootObject & CoreObject & OscalObject {
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
    # OscalRole
    "Identifies the unique identifier for a specific role instance."
    role_identifier: RoleType!
    "Identifies the name given to the role."
    name: String!
    "Identifies a short common name, abbreviation, or acronym for the role."
    short_name: String
    "Identifies a summary of the role's purpose and associated responsibilities."
    description: String
  }

  input OscalRoleAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OscalRole
    "Identifies the unique identifier for a specific role instance."
    role_identifier: RoleType!
    "Identifies the name given to the role."
    name: String!
    "Identifies a short common name, abbreviation, or acronym for the role."
    short_name: String
    "Identifies a summary of the role's purpose and associated responsibilities."
    description: String
  }

  # Filtering
  input OscalRolesFiltering {
    key: OscalRolesFilter!
    values: [String]
    operator: String
    filterMode: FilterMode
  }

  enum OscalRolesOrdering {
    created
    modified
    labels
  }
  enum OscalRolesFilter {
    created
    modified
    labels
  }

  # Pagination
  type OscalRoleConnection {
    pageInfo: PageInfo!
    edges: [OscalRoleEdge]
  }

  type OscalRoleEdge {
    cursor: String!
    node: OscalRole!
  }

  "Defines identifying information about a type of user that interacts with the system based on an associated role."
  type OscalUser implements RootObject & CoreObject & OscalObject {
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
    # OSCAL System User
    "Identifies type of user, such as internal, external, or general-public."
    user_type: UserType
    "Identifies a name given to the user, which may be used by a tool for display and navigation."
    name: String
    "Identifies a short common name, abbreviation, or acronym for the user."
    short_name: String
    "Identifies a summary of the user's purpose within the system."
    description: String
    "Identifies one or more references to the roles served by the user."
    roles: [OscalRole]
    "Identifies a specific system privilege held by the user, along with an associated description and/or rationale for the privilege."
    authorized_privileges: [AuthorizedPrivilege!]
    "Identifies the user's privilege level within the system, such as privileged, non-privileged, no-logical-access."
    privilege_level: PrivilegeLevel!
  }

  input OscalUserAddInput {
    "Identifies a set of terms used to describe this object. The terms are user-defined or trust-group defined."
    labels: [String]
    # OSCAL User
    "Identifies type of user, such as internal, external, or general-public."
    user_type: UserType
    "Identifies a name given to the user, which may be used by a tool for display and navigation."
    name: String
    "Identifies a short common name, abbreviation, or acronym for the user."
    short_name: String
    "Identifies a summary of the user's purpose within the system."
    description: String
    "Identifies a specific system privilege held by the user, along with an associated description and/or rationale for the privilege."
    authorized_privileges: [AuthorizedPrivilegeAddInput]
    "Identifies the user's privilege level within the system, such as privileged, non-privileged, no-logical-access."
    privilege_level: PrivilegeLevel!
  }

  # Filtering
  input OscalUsersFiltering {
    key: OscalUsersFilter!
    values: [String]
    operator: String
    filterMode: FilterMode
  }

  enum OscalUsersOrdering {
    created
    modified
    labels
    user_type
    privilege_level
  }
  enum OscalUsersFilter {
    created
    modified
    labels
    user_type
    privilege_level
  }

  # Pagination
  type OscalUserConnection {
    pageInfo: PageInfo!
    edges: [OscalUserEdge]
  }

  type OscalUserEdge {
    cursor: String!
    node: OscalUser!
  }


  "Defines identifying information about a Revision"
  type Revision {
    "Identifies the name given to the document."
    name: String!
    "Identifies the date and time the document was published."
    published: DateTime
    "Identifies the date and time the document as last modified."
    last_modified: DateTime
    "Identifies the current version of the document."
    version: String
    "Identifies the OSCAL model version the document was authored against."
    oscal_version: String
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
  }

  input RevisionAddInput {
    "Identifies the name given to the document."
    name: String!
    "Identifies the date and time the document was published."
    published: DateTime
    "Identifies the date and time the document as last modified."
    last_modified: DateTime
    "Identifies the current version of the document."
    version: String
    "Identifies the OSCAL model version the document was authored against."
    oscal_version: String
  }

  "Characterizes the kind of location."
  enum LocationType {
    "A location that contains computing assets."
    data_center
  }

  "Characterizes the purpose of the location."
  enum LocationClass {
    "The location is a data-center used for normal operations."
    primary
    "The location is a data-center used for fail-over or backup operations."
    alternate
  }

  "Characterizes the type of the party."
  enum PartyType {
    "Indicates the party is a person"
    person
    "Indicates the party is an organization"
    organization
  }

  "Characterizes the type level of privileges"
  enum PrivilegeLevel {
    "This role has elevated access to the system, such as a group or system administrator."
    privileged
    "This role has typical user-level access to the system without elevated access."
    non_privileged
    "This role has no access to the system, such as a manager who approves access as part of a process."
    no_logical_access
  }

  "Characterizes the type of resource."
  enum ResourceType {
    "Indicates the resource is an organization's logo."
    logo
    "Indicates the resource represents an image."
    image
    "Indicates the resource represents an image of screen content."
    screen_shot
    "Indicates the resource represents an applicable law."
    law
    "Indicates the resource represents an applicable regulation."
    regulation
    "Indicates the resource represents an applicable standard."
    standard
    "Indicates the resource represents applicable guidance."
    external_guidance
    "Indicates the resource provides a list of relevant acronyms"
    acronyms
    "Indicates the resource cites relevant information"
    citation
    "Indicates the resource is a policy"
    policy
    "Indicates the resource is a procedure"
    procedure
    "Indicates the resource is guidance document related to the subject system of an SSP."
    system_guide
    "Indicates the resource is guidance document a user's guide or administrator's guide."
    users_guide
    "Indicates the resource is guidance document a administrator's guide."
    administrators_guide
    "Indicates the resource represents rules of behavior content"
    rules_of_behavior
    "Indicates the resource represents a plan"
    plan
    "Indicates the resource represents an artifact, such as may be reviewed by an assessor"
    artifact
    "Indicates the resource represents evidence, such as to support an assessment finding"
    evidence
    "Indicates the resource represents output from a tool"
    tool_output
    "Indicates the resource represents machine data, which may require a tool or analysis for interpretation or presentation"
    raw_data
    "Indicates the resource represents notes from an interview, such as may be collected during an assessment"
    interview_notes
    "Indicates the resource is a set of questions, possibly with responses"
    questionnaire
    "Indicates the resource is a report"
    report
    "Indicates the resource is a formal agreement between two or more parties"
    agreement
  }

  "Defines the identifier for a specific role."
  enum RoleType {
    "Accountable for ensuring the asset is managed in accordance with organizational policies and procedures."
    asset_owner
    "Responsible for administering a set of assets."
    asset_administrator
    "Responsible for the configuration management processes governing changes to the asset."
    configuration_management
    "Responsible for providing information and support to users."
    help_desk
    "Responsible for responding to an event that could lead to loss of, or disruption to, an organization's operations, services or functions."
    incident_response
    "Member of the network operations center (NOC)."
    network_operations
    "Member of the security operations center (SOC)."
    security_operations
    "Responsible for the creation and maintenance of a component."
    maintainer
    "Organization responsible for providing the component, if this is different from the 'maintainer' (e.g., a reseller)."
    provider
  }

  "Defines the set of types of users"
  enum UserType {
    "Identifies a user account for a person or entity that is part of the organization who owns or operates the system."
    internal
    "Identifies a user account for a person or entity that is not part of the organization who owns or operates the system."
    external
    "Identifies a user of the system considered to be outside."
    general_public
  }

`;

export default typeDefs ;