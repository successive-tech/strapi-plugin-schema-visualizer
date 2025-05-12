import { darkTheme } from '@strapi/design-system';
import React from 'react';

// In Strapi v5, field icons are now in the symbols export
import {
  TextField,
  EmailField,
  PasswordField,
  NumberField,
  EnumerationField,
  DateField,
  MediaField,
  BooleanField,
  JsonField,
  BlocksField,
  RelationField,
  UidField,
} from '@strapi/icons/symbols';
import {
  OneToMany,
  OneToOne,
  ManyToMany,
  ManyToOne,
  OneWay,
  ManyWays,
} from '@strapi/icons';

type AttributeType = string;

export function getBackgroundColor(variant: string, theme: any): string {
  switch (variant) {
    case 'cross':
      return theme.colors.neutral200;
    case 'dots':
      return theme.colors.neutral300;
    case 'lines':
      return theme.colors.neutral150;
    case 'none':
      return theme.colors.neutral100;
    default:
      return '#ffffff';
  }
}

export function getIcon(attrType: AttributeType): React.ReactNode {
  switch (attrType.toLowerCase()) {
    case 'string':
    case 'text':
      return <TextField />;
    case 'email':
      return <EmailField />;
    case 'enumeration':
      return <EnumerationField />;
    case 'password':
      return <PasswordField />;
    case 'boolean':
      return <BooleanField />;
    case 'relation':
      return <RelationField />;
    case 'datetime':
    case 'date':
    case 'time':
      return <DateField />;
    case 'integer':
    case 'decimal':
    case 'biginteger':
    case 'float':
      return <NumberField />;
    case 'json':
      return <JsonField />;
    case 'uid':
      return <UidField />;
    case 'richtext':
      return <TextField />;
    case 'media':
      return <MediaField />;
    case 'blocks':
      return <BlocksField />;

    case 'onetomany': //
      return <OneToMany />;
    case 'oneway':
      return <OneWay />;
    case 'onetoone': //
      return <OneToOne />;
    case 'manytomany': //
      return <ManyToMany />;
    case 'manytoone': //
      return <ManyToOne />;
    case 'manyways':
    // Not sure
    case 'morphtomany':
      return <ManyWays />;
    default:
      return null;
  }
}
