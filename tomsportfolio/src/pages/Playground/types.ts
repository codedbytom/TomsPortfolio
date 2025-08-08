export type BaseField = {
  name: string;
  label: string;
  required: boolean;
};

export type TextField = BaseField & {
  type: 'text' | 'email';
};

export type SelectField = BaseField & {
  type: 'select';
  options: string[];
};

export type CheckBoxField = BaseField & {
  type: 'checkbox';
};

export type FormField = TextField | SelectField | CheckBoxField;
