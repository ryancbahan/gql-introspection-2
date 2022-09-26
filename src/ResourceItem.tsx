import React, {useState} from "react";
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
import synthwave84 from 'prism-react-renderer/themes/synthwave84';
import Highlight, { defaultProps } from "prism-react-renderer";
import { useMutation } from "@apollo/client";
import { print } from "graphql";

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

    function renderArg(arg: any) {
        const { name, description } = arg

        return (
            <span key={description}>
                <Stack.Item>
                    <TextContainer spacing="tight">
                        <p>
                            <b>{name?.value}</b>: {description?.value}
                        </p>
                    </TextContainer>
                </Stack.Item>
            </span>
        );
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
                    {/* <Stack.Item>
            <Heading element='h3'>
              Arguments
            </Heading>
          </Stack.Item>
          {args.map((arg: any) => renderArg(arg))} */}
                    <Stack.Item>
                        <TextContainer>
                            <Heading>Example</Heading>
                            <p><TextStyle variation='strong'>Mutation</TextStyle></p>
                            <Highlight {...defaultProps} theme={synthwave84} code={print(mutationDocument)} language="graphql">
                                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                    <pre className={className} style={style}>
                                        {tokens.map((line, i) => (
                                            <div {...getLineProps({ line, key: i })}>
                                                {line.map((token, key) => (
                                                    <span {...getTokenProps({ token, key })} />
                                                ))}
                                            </div>
                                        ))}
                                    </pre>
                                )}
                            </Highlight>
                            <p><TextStyle variation='strong'>Variables</TextStyle></p>
                            <Highlight {...defaultProps} theme={synthwave84} code={JSON.stringify(variableValues, null, '\t')} language="jsx">
                                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                    <pre className={className} style={style}>
                                        {tokens.map((line, i) => (
                                            <div {...getLineProps({ line, key: i })}>
                                                {line.map((token, key) => (
                                                    <span {...getTokenProps({ token, key })} />
                                                ))}
                                            </div>
                                        ))}
                                    </pre>
                                )}
                            </Highlight>
                        </TextContainer>
                    </Stack.Item>
                </Stack>
            </Card.Section>
            <Card.Section>
                <Stack alignment='center'>
                    <Button primary onClick={onButtonClick}>Run once</Button>
                    <Button>Run five times</Button>
                </Stack>
            </Card.Section>
        </Card>
        {toastMarkup}
    </ResourceItem>)
}
