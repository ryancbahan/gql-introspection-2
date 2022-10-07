import React, { useState, useEffect } from "react";
import {
  Stack,
  TextContainer,
  Pagination,
  ResourceList,
  TextField,
  Filters,
  Select,
} from "@shopify/polaris";
import { MutationResourceItem } from "../ResourceItem";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../../../../utilities/fetch";

export const OperationBrowser = ({ list: adminList, sfList }) => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const [queryValue, setQueryValue] = useState("");
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [selected, setSelected] = useState("admin");

  fetch("/admin-api/mutations");

  const list = selected === "admin" ? adminList : sfList;

  const options = [
    { label: "Admin API", value: "admin" },
    { label: "Storefront API", value: "storefront" },
  ];

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

  const resourceName = {
    singular: "available mutations",
    plural: "available mutations",
  };

  const filteredItems = list
    .filter((item) =>
      item.mutationInfo.name.toLowerCase().includes(queryValue.toLowerCase())
    )
    .slice(paginationIndex, paginationIndex + 10);

  function renderItem(item: any) {
    const { mutationInfo, mutationDocument, variableValues } = item;
    const { args } = mutationInfo;

    return <MutationResourceItem {...item} />;
  }

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

  return (
    <>
      <TextContainer>
        <p></p>
        <Select
          label="Choose schema"
          options={options}
          onChange={(val) => setSelected(val)}
          value={selected}
        />
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
