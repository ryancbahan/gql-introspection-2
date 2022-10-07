import React, { useState, useRef, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  Heading,
  TextContainer,
  Stack,
  Checkbox,
  Button,
  Collapsible,
} from "@shopify/polaris";
import { useParams } from "react-router-dom";
import { print, graphql } from "graphql";
import { Uri, editor, KeyMod, KeyCode, languages } from "monaco-editor";
import { initializeMode } from "monaco-graphql/esm/initializeMode";
import { gql, useMutation } from "@apollo/client";

export const DetailsPage = () => {
  const { schema, mutation } = useParams();
  console.log({ schema, mutation });
  // const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  // const [checked, setChecked] = useState(false);

  // const opsRef = useRef(null);
  // const varsRef = useRef(null);
  // const resultsRef = useRef(null);

  // const { mutationInfo, mutationDocument, variableValues } = list.find(
  //   (item) => item.mutationInfo.name === mutation
  // );

  // const defaultOperations = print(mutationDocument);

  // const defaultVariables = JSON.stringify(variableValues);

  // const createEditor = (
  //   ref: React.MutableRefObject<null>,
  //   options: editor.IStandaloneEditorConstructionOptions
  // ) => editor.create(ref.current as unknown as HTMLElement, options);

  // const getOrCreateModel = (uri: string, value: string) => {
  //   return (
  //     editor.getModel(Uri.file(uri)) ??
  //     editor.createModel(value, uri.split(".").pop(), Uri.file(uri))
  //   );
  // };

  // const queryModel = getOrCreateModel(
  //   `${mutationInfo.name}.graphql`,
  //   defaultOperations
  // );
  // const variablesModel = getOrCreateModel(
  //   `${mutationInfo.name}-variables.json`,
  //   defaultVariables
  // );
  // const resultsModel = getOrCreateModel(
  //   `${mutationInfo.name}-results.json`,
  //   "{}"
  // );

  // useEffect(() => {
  //   initializeMode({
  //     // diagnosticSettings: {
  //     //     validateVariablesJSON: {
  //     //         [Uri.file('operation.graphql').toString()]: [
  //     //             Uri.file('variables.json').toString(),
  //     //         ],
  //     //     },
  //     //     jsonDiagnosticSettings: {
  //     //         validate: true,
  //     //         schemaValidation: 'error',
  //     //         // set these again, because we are entirely re-setting them here
  //     //         allowComments: true,
  //     //         trailingCommas: 'ignore',
  //     //     },
  //     // },
  //     schemas: [
  //       {
  //         introspectionJSON: schema,
  //         uri: "myschema.graphql",
  //       },
  //     ],
  //   });

  //   createEditor(opsRef, {
  //     theme: "vs-dark",
  //     model: queryModel,
  //     language: "graphql",
  //     automaticLayout: true,
  //   });

  //   createEditor(varsRef, {
  //     theme: "vs-dark",
  //     model: variablesModel,
  //     automaticLayout: true,
  //   });

  //   createEditor(resultsRef, {
  //     theme: "vs-dark",
  //     model: resultsModel,
  //     readOnly: true,
  //     smoothScrolling: true,
  //     automaticLayout: true,
  //   });
  // }, []);

  // function renderArg(arg: any) {
  //   const { name, description } = arg;

  //   return (
  //     <span key={Math.random()}>
  //       <Stack.Item>
  //         <TextContainer>
  //           <p>
  //             <b>{name?.value}</b>: {description?.value}
  //           </p>
  //         </TextContainer>
  //       </Stack.Item>
  //     </span>
  //   );
  // }

  // const [mutate] = useMutation(gql(queryModel.getValue()));

  // const onButtonClick = () => {
  //   const query = queryModel.getValue();
  //   const vars = variablesModel.getValue();

  //   if (checked) {
  //     graphql({
  //       schema: mockSchema,
  //       source: query,
  //       variableValues,
  //     }).then((result) => {
  //       resultsModel?.setValue(JSON.stringify(result, null, 2));
  //     });
  //   } else {
  //     mutate(variableValues).then((res) => console.log({ res }));
  //   }
  // };

  return (
    <Page
      breadcrumbs={[{ content: "Back", onAction: () => window.history.back() }]}
      fullWidth
    >
      {/* <Layout>
        <Layout.Section>
          <Card title={mutationInfo.name} sectioned>
            <Card.Section>
              <Button onClick={() => setCollapsibleOpen(!collapsibleOpen)}>
                Show details
              </Button>
            </Card.Section>
            <Collapsible open={collapsibleOpen} id={mutationInfo.name}>
              <Card.Section title="Description">
                <p>{mutationInfo.description.value}</p>
              </Card.Section>
              <Card.Section title="Arguments">
                <Stack vertical>
                  {mutationInfo?.args.map((arg: any) => renderArg(arg))}
                </Stack>
              </Card.Section>
            </Collapsible>
            <Card.Section>
              <Checkbox
                checked={checked}
                onChange={() => setChecked(!checked)}
                label="Mock responses"
              />
              <div style={{ display: "flex", margin: "0.5rem 0" }}>
                <div style={{ height: "100vh", width: "75%" }}>
                  <div ref={opsRef} style={{ height: "75%" }} />
                  <div ref={varsRef} style={{ height: "25%" }} />
                </div>
                <div style={{ height: "100vh", width: "25%" }}>
                  <div
                    ref={resultsRef}
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
              </div>
              <Button primary onClick={onButtonClick}>
                Run mutation
              </Button>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout> */}
    </Page>
  );
};
