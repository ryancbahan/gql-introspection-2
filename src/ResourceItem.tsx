import React, { useState } from "react";
import {
    ResourceItem,
    Card,
    Stack,
    TextContainer,
    TextStyle,
    Heading,
    Button,
    Toast
} from '@shopify/polaris';
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

export const MutationResourceItem = ({ mutationInfo, mutationDocument, variableValues }) => {
    const [toastActive, setToastActive] = useState(false);

    const toggleToastActive = () => setToastActive(!toastActive)

    const toastMarkup = toastActive ? (
        <Toast content="Mutation run successfully" onDismiss={toggleToastActive} />
    ) : null;

    const [mutation] = useMutation(mutationDocument);

    const onButtonClick = async () => {
        const result = await mutation({ variables: variableValues })

        if (!result?.data[mutationInfo.name]?.userErrors?.length) {
            setToastActive(true)
        }
    }

    return (<ResourceItem id={mutationInfo.name} onClick={() => { }}>
        <Card title={mutationInfo.name}>
            <Card.Section>
                <Stack vertical>
                    <Stack.Item>
                        <TextContainer>
                            <p>{mutationInfo.description.value}</p>
                        </TextContainer>
                    </Stack.Item>
                </Stack>
            </Card.Section>
            <Card.Section>
                <Stack alignment='center'>
                    <Button primary onClick={onButtonClick}>Run once</Button>
                    <Link to={mutationInfo.name}>
                        <Button>More options</Button>
                    </Link>
                </Stack>
            </Card.Section>
        </Card>
        {toastMarkup}
    </ResourceItem>)
}
