import React, { useState } from 'react'
import {
    Page,
    ResourceList,
    Stack,
    Filters,
    TextField,
    Pagination,
    Tabs,
    TextContainer,
    Card,
    Button,
    Layout
} from '@shopify/polaris';
import { MutationResourceItem } from './ResourceItem';

export const HomePage = ({ list }) => {
    const [paginationIndex, setPaginationIndex] = useState(0)
    const [queryValue, setQueryValue] = useState("");
    const [selectedTab, setSelectedTab] = useState(0);

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

    const tabs = [
        {
            id: 'quickstart',
            content: 'Quick start',
            accessibilityLabel: 'Quick start',
            panelID: 'quickstart',
            component: (
                <>
                    <Layout>
                        <Layout.Section>
                          <Stack spacing="loose">
                            <Stack.Item>
                                <TextContainer>
                                    <br />
                                    <p>Generate common entities for your dev store. For more detailed behaviors, browse all available mutations and modify the input arguments to meet your needs.</p>
                                    <br />
                                </TextContainer>
                            </Stack.Item>
                          </Stack>
                        </Layout.Section>
                    </Layout>
                    <Layout>
                        <Layout.Section oneThird>
                            <Card title="5 customers, products, and orders">
                                <Card.Section>
                                    <TextContainer>
                                        <p>Generate products, customers, and orders for your dev store.</p>
                                        <Button primary>Select</Button>
                                    </TextContainer>
                                </Card.Section>
                            </Card>
                            <Card title="Generate storefront token">
                                <Card.Section>
                                    <TextContainer>
                                        <p>Generate a storefront access token to use the Storefront API.</p>
                                        <Button primary>Select</Button>
                                    </TextContainer>
                                </Card.Section>
                            </Card>
                        </Layout.Section>
                        <Layout.Section oneThird>
                            <Card title="Generate events">
                                <Card.Section>
                                    <TextContainer>
                                        <p>Generate events for Amazon Eventbridge, Google Pub/Sub, and Flow.</p>
                                        <Button primary>Select</Button>
                                    </TextContainer>
                                </Card.Section>
                            </Card>
                        </Layout.Section>
                        <Layout.Section oneThird>
                            <Card title="Generate discounts">
                                <Card.Section>
                                    <TextContainer>
                                        <p>Generate an automatic discount.</p>
                                        <Button primary>Select</Button>
                                    </TextContainer>
                                </Card.Section>
                            </Card>
                        </Layout.Section>
                    </Layout>
                </>
            )
        },
        {
            id: 'browse',
            content: 'Browse',
            panelID: 'browse',
            component: (<><Stack distribution='center' alignment='center' spacing="loose">
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
                <Stack distribution='center' alignment='center'>
                    <Pagination
                        hasPrevious={paginationIndex > 0}
                        onPrevious={onPrevious}
                        hasNext={filteredItems.length > 0}
                        onNext={onNext}
                    />
                </Stack></>)
        },
        {
            id: "favorites",
            content: "Favorites",
            panelID: "favorites",
            component: <div>hello world</div>
        },
        {
            id: "custom",
            content: "Custom",
            panelID: "custom",
            component: <div>hello world</div>
        },
        {
            id: "settings",
            content: "Store settings",
            panelID: "settings",
            component: <div>hello world</div>
        },
    ];

    return (
        <Page title="Dev Portal">
            <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
                {tabs[selectedTab].component}
            </Tabs>
        </Page>
    )
}
