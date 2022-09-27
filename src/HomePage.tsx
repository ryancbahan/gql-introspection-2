import React, {useState} from 'react'
import {
    Page,
    ResourceList,
    Stack,
    Filters,
    TextField,
    Frame,
    Pagination
  } from '@shopify/polaris';
  import { MutationResourceItem } from './ResourceItem';

export const HomePage = ({list}) => {
    const [paginationIndex, setPaginationIndex] = useState(0)
    const [queryValue, setQueryValue] = useState("");

    function renderItem(item: any) {
        const { mutationInfo, mutationDocument, variableValues } = item
        const { args } = mutationInfo

        return <MutationResourceItem {...item} />
      }

    const filters = [
        {
          key: "taggedWith",
          label: "Tagged with",
          filter: (
            <TextField
              label="Tagged with"
              value={"taggedWith"}
              onChange={() => { }}
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


      const onPrevious = () => {
        if (paginationIndex === 0 || !filteredItems.length) {
          setPaginationIndex(0)
          return
        }
        setPaginationIndex(paginationIndex - 10)
      }

      const onNext = () => {
        if (!filteredItems.length) {
          setPaginationIndex(paginationIndex - 10)
          return
        }
        setPaginationIndex(paginationIndex + 10)
      }

      const filteredItems = list
        .filter(item => item.mutationInfo.name.toLowerCase().includes(queryValue.toLowerCase()))
        .slice(paginationIndex, paginationIndex + 10)

    return (<Page title="Dev Portal">
        <Stack distribution='center' alignment='center'>
            <Pagination
                hasPrevious={paginationIndex > 0}
                onPrevious={onPrevious}
                hasNext={filteredItems.length > 0}
                onNext={onNext}
            />
        </Stack>
        <ResourceList
            resourceName={resourceName}
            items={filteredItems!}
            filterControl={filterControl}
            renderItem={renderItem}
        />
        <Stack distribution='center' alignment='center'>
            <Pagination
                hasPrevious={paginationIndex > 0}
                onPrevious={onPrevious}
                hasNext={filteredItems.length > 0}
                onNext={onNext}
            />
        </Stack>
    </Page>)
}
