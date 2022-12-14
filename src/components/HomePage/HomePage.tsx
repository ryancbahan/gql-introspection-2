import React, { useState, useEffect } from "react";
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
  Layout,
} from "@shopify/polaris";
import {
  StoreSettings,
  OperationBrowser,
  QuickStart,
  Internal,
} from "./components";

export const HomePage = ({ list, sfList, schema }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      id: "quickstart",
      content: "Quick start",
      accessibilityLabel: "Quick start",
      panelID: "quickstart",
      component: <QuickStart />,
    },
    {
      id: "browse",
      content: "Browse",
      panelID: "browse",
      component: <OperationBrowser list={list} sfList={sfList} />,
    },
    {
      id: "favorites",
      content: "Favorites",
      panelID: "favorites",
      component: <div>hello world</div>,
    },
    {
      id: "custom",
      content: "Custom",
      panelID: "custom",
      component: <div>hello world</div>,
    },
    {
      id: "settings",
      content: "Store settings",
      panelID: "settings",
      component: <StoreSettings />,
    },
    {
      id: "internal",
      content: "Internal",
      panelID: "internal",
      component: <Internal schema={schema} />,
    },
  ];

  return (
    <Page title="Dev Console">
      <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
        {tabs[selectedTab].component}
      </Tabs>
    </Page>
  );
};
