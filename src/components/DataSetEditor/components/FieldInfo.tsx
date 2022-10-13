import React from "react";
import {
  TextContainer,
  ButtonGroup,
  Button,
  Select,
  TextField,
} from "@shopify/polaris";
import { getTypeName } from "../../../utilities/generateMutations";
import { Kind } from "graphql";

const SelectMarkup = ({ options, value, onChange }) => {
  return (
    <Select
      value={value}
      label={"Choose value"}
      options={options}
      onChange={onChange}
    />
  );
};

const DecimalMarkup = ({ value, onChange }) => {
  return (
    <TextField
      label="Add decimal amount"
      type="number"
      value={value}
      onChange={onChange}
      autoComplete={"off"}
    />
  );
};

const StringMarkup = ({ value, onChange }) => {
  return (
    <TextField
      label="Add text"
      value={value}
      onChange={onChange}
      autoComplete={"off"}
      multiline={true}
    />
  );
};

export function FieldInfo({ field, nodeLookup, setNodeLookup, schema }) {
  const fieldTypeName = getTypeName(field.type);
  const fieldType = schema.getType(fieldTypeName);

  console.log({ fieldTypeName, fieldType, field });

  const setValueTrue = () => {
    const nextField = { ...field, value: true };
    setNodeLookup({ ...nodeLookup, [field.id]: nextField });
  };

  const setValueFalse = () => {
    const nextField = { ...field, value: false };
    setNodeLookup({ ...nodeLookup, [field.id]: nextField });
  };

  const handleSelectChange = (val) => {
    const nextField = { ...field, value: val };
    setNodeLookup({ ...nodeLookup, [field.id]: nextField });
  };

  const handleTextFieldChange = (val) => {
    const nextField = { ...field, value: val };
    setNodeLookup({ ...nodeLookup, [field.id]: nextField });
  };

  return (
    <TextContainer>
      <p>{field.description?.value}</p>
      {fieldTypeName === "Boolean" && (
        <ButtonGroup segmented>
          <Button primary={field?.value === true} onClick={setValueTrue}>
            True
          </Button>
          <Button primary={field?.value === false} onClick={setValueFalse}>
            False
          </Button>
        </ButtonGroup>
      )}
      {fieldType?.astNode?.kind === Kind.ENUM_TYPE_DEFINITION && (
        <SelectMarkup
          value={field.value ?? ""}
          onChange={handleSelectChange}
          options={fieldType.astNode.values.map((val) => ({
            label: val.description.value,
            value: val.name.value,
          }))}
        />
      )}
      {fieldTypeName === "Decimal" && (
        <DecimalMarkup
          value={field.value ?? ""}
          onChange={handleTextFieldChange}
        />
      )}
      {fieldTypeName === "String" && (
        <StringMarkup
          value={field.value ?? ""}
          onChange={handleTextFieldChange}
        />
      )}
    </TextContainer>
  );
}
