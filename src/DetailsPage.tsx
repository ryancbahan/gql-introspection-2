import React from 'react'
import { Page, Layout, Card, Heading, TextContainer, Stack, TextStyle } from '@shopify/polaris';
import synthwave84 from 'prism-react-renderer/themes/synthwave84';
import Highlight, { defaultProps } from "prism-react-renderer";
import { useParams } from 'react-router-dom'
import { print, graphql } from "graphql";

export const DetailsPage = ({ list, mockSchema }) => {
    const { mutation } = useParams()

    const { mutationInfo, mutationDocument, variableValues } = list.find(item => item.mutationInfo.name === mutation)

    graphql({
        schema: mockSchema,
        source: print(mutationDocument),
        variableValues
      }).then(result => console.log('Got result', result))

    function renderArg(arg: any) {
        const { name, description } = arg

        return (
            <span key={Math.random()}>
                <Stack.Item>
                    <TextContainer>
                        <p>
                            <b>{name?.value}</b>: {description?.value}
                        </p>
                    </TextContainer>
                </Stack.Item>
            </span>
        );
    }

    return (<Page breadcrumbs={[{content: 'Back', onAction: () => window.history.back()}]} fullWidth>
        <Layout>
            <Layout.Section oneHalf>
                <Card title={mutationInfo.name} sectioned>
                    <Card.Section title="Description">
                        <p>
                            {mutationInfo.description.value}
                        </p>
                    </Card.Section>
                    <Card.Section title="Arguments">
                        <Stack vertical>
                            {mutationInfo?.args.map((arg: any) => renderArg(arg))}
                        </Stack>
                    </Card.Section>
                </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
                <Card title="GraphQL" sectioned>
                        <TextContainer>
                            <Heading>Example</Heading>
                            <p><TextStyle variation='strong'>Mutation</TextStyle></p>
                            <Highlight {...defaultProps} theme={synthwave84} code={print(mutationDocument)} language="graphql">
                                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                    <pre suppressContentEditableWarning={true} contentEditable className={className} style={style}>
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
                                    <pre suppressContentEditableWarning={true} contentEditable className={className} style={style}>
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
                </Card>
            </Layout.Section>
        </Layout>
    </Page>)
}
