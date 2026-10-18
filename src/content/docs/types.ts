export type TypeKind = "class" | "interface" | "enum" | "record" | "struct" | "delegate";

export interface Param {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
}

export interface MethodDoc {
  name: string;
  signature: string;
  summary: string;
  parameters?: Param[];
  returns?: string;
  exceptions?: { type: string; when: string }[];
  isStatic?: boolean;
  isAsync?: boolean;
  isVirtual?: boolean;
}

export interface PropertyDoc {
  name: string;
  type: string;
  access: "get" | "get; set" | "get; init" | "get; protected set" | "get; private set";
  summary: string;
}

export interface FieldDoc {
  name: string;
  type: string;
  summary: string;
  value?: string;
}

export interface EventDoc {
  name: string;
  type: string;
  summary: string;
}

export interface EnumValueDoc {
  name: string;
  value: number;
  summary: string;
}

export interface TypeParamDoc {
  name: string;
  constraint?: string;
  description: string;
}

export interface TypeDoc {
  slug: string;
  name: string;
  displayName: string;
  kind: TypeKind;
  namespace: string;
  summary: string;
  remarks?: string;
  signature: string;
  inherits?: string;
  implements?: string[];
  typeParameters?: TypeParamDoc[];
  constructors?: MethodDoc[];
  properties?: PropertyDoc[];
  methods?: MethodDoc[];
  fields?: FieldDoc[];
  events?: EventDoc[];
  enumValues?: EnumValueDoc[];
  example?: { title: string; code: string };
  seeAlso?: string[];
}

export interface NamespaceDoc {
  name: string;
  summary: string;
  types: TypeDoc[];
}

export interface LibraryDoc {
  slug: string;
  name: string;
  version: string;
  targetFrameworks: string[];
  tagline: string;
  description: string;
  repository: string;
  namespaces: NamespaceDoc[];
}

export const kindLabels: Record<TypeKind, string> = {
  class: "Class",
  interface: "Interface",
  enum: "Enum",
  record: "Record",
  struct: "Struct",
  delegate: "Delegate",
};

