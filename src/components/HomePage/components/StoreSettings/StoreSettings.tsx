import React, { useState, useEffect } from "react";
import { userLoggedInFetch } from "../../../../App";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Select, Button, Stack, Card, Toast } from "@shopify/polaris";

export const StoreSettings = () => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const [themes, setThemes] = useState([]);
  const [selected, setSelected] = useState();
  const [toastActive, setToastActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const toastMarkup = toastActive ? (
    <Toast content="Theme changed" onDismiss={() => setToastActive(false)} />
  ) : null;

  useEffect(() => {
    if (!themes.length) {
      fetch("/themes")
        .then((res) => res?.json())
        .then((json) => {
          setThemes(json);
          setSelected(json[0].name);
        });
    }
  }, []);

  const options = themes.map((theme) => ({
    label: theme.name,
    value: theme.name,
  }));

  const onThemeChange = () => {
    const theme = themes.find((theme) => theme?.name === selected);

    setLoading(true);

    fetch("/theme-switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: theme.id }),
    }).then((res) => {
      setLoading(false);
      setToastActive(true);
    });
  };

  return (
    <div>
      <Card>
        <Card.Section>
          <Stack vertical>
            <Select
              label="Theme selector"
              options={options}
              onChange={(val) => setSelected(val)}
              value={selected}
            />
            <Button loading={loading} onClick={onThemeChange}>
              Switch theme
            </Button>
          </Stack>
        </Card.Section>
      </Card>
      {toastMarkup}
    </div>
  );
};
