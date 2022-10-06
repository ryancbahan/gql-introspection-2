import { GraphQLSchema } from "graphql";
import React, { useState } from "react";
import { generateArgsMap } from "../../../../utilities/generateArgsMap";
import { Link } from "react-router-dom";

import {
  Stack,
  TextContainer,
  Select,
  Pagination,
  ResourceList,
  TextField,
  Filters,
  ResourceItem,
  Card,
  Button,
} from "@shopify/polaris";

export const Internal = ({ schema }) => {
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [queryValue, setQueryValue] = useState("");

  const { mutations: list } = generateArgsMap(schema);

  const onPrevious = () => {
    if (paginationIndex === 0 || !filteredItems.length) {
      setPaginationIndex(0);
      return;
    }
    setPaginationIndex(paginationIndex - 10);
  };

  const onNext = () => {
    if (!filteredItems.length) {
      setPaginationIndex(paginationIndex - 10);
      return;
    }
    setPaginationIndex(paginationIndex + 10);
  };

  const filteredItems = list
    // .filter((item) =>
    //     item?.mutationInfo?.name.toLowerCase().includes(queryValue.toLowerCase())
    // )
    .slice(paginationIndex, paginationIndex + 10);

  const resourceName = {
    singular: "available mutations",
    plural: "available mutations",
  };

  const filters = [
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={"taggedWith"}
          onChange={() => {}}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      onQueryChange={setQueryValue}
      onQueryClear={() => setQueryValue("")}
      onClearAll={() => setQueryValue("")}
    />
  );

  function renderItem(item: any) {
    return (
      <ResourceItem>
        <Card title={item.name}>
          <Card.Section>
            <p>{item.description}</p>
          </Card.Section>
          <Card.Section>
            <Link to={`/internal/${item.name}`}>
              <Button primary>View details</Button>
            </Link>
          </Card.Section>
        </Card>
      </ResourceItem>
    );
  }

  return (
    <>
      <TextContainer>
        <p></p>
      </TextContainer>
      <Stack distribution="center" alignment="center" spacing="loose">
        <Stack.Item>
          <TextContainer>
            <p></p>
            <Pagination
              hasPrevious={paginationIndex > 0}
              onPrevious={onPrevious}
              hasNext={filteredItems.length > 0}
              onNext={onNext}
            />
          </TextContainer>
        </Stack.Item>
      </Stack>
      <ResourceList
        resourceName={resourceName}
        items={filteredItems!}
        filterControl={filterControl}
        renderItem={renderItem}
      />
      <Stack distribution="center" alignment="center">
        <Pagination
          hasPrevious={paginationIndex > 0}
          onPrevious={onPrevious}
          hasNext={filteredItems.length > 0}
          onNext={onNext}
        />
      </Stack>
    </>
  );
};
