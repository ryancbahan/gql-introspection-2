import {
  Page,
  Layout,
  Card,
  Button,
  Modal,
  Stack,
  TextField,
  Badge,
} from "@shopify/polaris";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Editor from "@monaco-editor/react";
import { Canvas, Edge, ElkRoot, Node, Port, PortProps } from "reaflow";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../../utilities/fetch";
import { Heading } from "@shopify/polaris";
import { TextContainer } from "@shopify/polaris";
import { Checkbox } from "@shopify/polaris";
import { generateSchema } from "../../../server/generateSchema";
import adminApiIntrospection from "../../../graphql.schema.json";
import { getTypeName } from "../../utilities/generateMutations";
import { formatMutation } from "./formatMutation";
import { getNodesAndEdges } from "./getNodesAndEdges";

const OptionRow = ({ option, checked, handleChange }) => {
  const handleClick = () => {
    handleChange(option);
  };

  return (
    <Stack alignment="center">
      <Checkbox
        checked={checked}
        onChange={handleClick}
        label={option.name.value}
      />
      {option.type.kind === "NonNullType" && <Badge>Required</Badge>}
      {checked && <TextField value={option.name.value} />}
    </Stack>
  );
};

export const DataSetEditor = () => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const { schema, mutation, id } = useParams();

  const [dataset, setDataset] = useState();
  const [mutationData, setMutationData] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalParent, setModalParent] = useState();
  const [modalData, setModalData] = useState();
  const [modalSelections, setModalSelections] = useState([]);

  const [nodeSelection, setNodeSelection] = useState([]);
  const [edgeSelection, setEdgeSelection] = useState([]);

  const editorRef = useRef(null);

  const validSchema = generateSchema(adminApiIntrospection);

  useEffect(() => {
    fetch(`/${schema}/mutations/${mutation}/datasets/${id}`)
      .then((res) => res?.json())
      .then((json) => {
        setDataset(json.data);
        setMutationData(json.mutationData);
      });
  }, []);

  if (!dataset || !mutationData) return <div>loading...</div>;

  const mutationTree = formatMutation(mutationData, validSchema);
  const { nodes, edges } = getNodesAndEdges(mutationTree);

  console.log({ nodes, edges });

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  // const { node } = formatToNode(mutationData);

  // if (!nodeSelection.length) {
  //   setNodeSelection([node])
  // }

  // const initialEditorValue = JSON.stringify(dataset.data, null, 2);

  // const handleNodeClick = (_, node) => {
  //   setModalOpen(true)

  //   if (node.data.arguments) {
  //     const options = []

  //     node.data.arguments.forEach(arg => options.push(arg))

  //     setModalData(options)
  //     setModalParent(node.data)
  //   } else {
  //     const typeName = getTypeName(node.data.type)
  //     const fieldTyping = validSchema.getType(typeName)

  //     if (fieldTyping.getFields) {
  //       const fields = Object.values(fieldTyping.getFields()).map(f => f.astNode)
  //       setModalData(fields)
  //       setModalParent(node.data)
  //     }
  //   }
  // }

  // const setChecked = (option) => {
  //   const hasOption = modalSelections.find(s => {
  //     if (option.loc.start, s.loc.start === option.loc.start) return s
  //   })

  //   return Boolean(hasOption)
  // }

  // const handleCheckboxUpdate = (option) => {
  //   if (modalSelections?.find(selection => selection.loc.start === option.loc.start)) {
  //     setModalSelections(modalSelections.filter(selection => selection.loc.start !== option.loc.start))
  //   } else {
  //     setModalSelections([...modalSelections, option])
  //   }
  // }

  // const onModalClose = () => {
  //   setModalData(undefined)
  //   setModalOpen(false)
  //   setModalParent(undefined)
  //   setModalSelections([])
  // }

  // const handleModalConfirm = () => {
  //   const nextSelections = []
  //   const nextEdges = []

  //   modalSelections?.forEach(selection => {
  //     const { node, edge } = formatToNode(selection, modalParent)
  //     nextSelections.push(node)
  //     nextEdges.push(edge)
  //   })

  //   setNodeSelection([...nodeSelection, ...nextSelections])
  //   setEdgeSelection([...edgeSelection, ...nextEdges])
  //   onModalClose()
  // }

  return (
    <>
      <Allotment>
        <Allotment.Pane minSize={200}>
          <Card>
            <Card.Section>foo</Card.Section>
          </Card>
          {/* <Editor
            defaultLanguage="json"
            defaultValue={initialEditorValue}
            onMount={handleEditorDidMount}
            options={{
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                vertical: "hidden",
              },
              minimap: { enabled: false },
              overviewRulerBorder: false,
            }}
          /> */}
        </Allotment.Pane>
        <Allotment.Pane snap>
          <Canvas
            // node={<Node selectable onClick={handleNodeClick} />}
            nodes={nodes}
            edges={edges}
          />
          {/* <Modal
            title="Add data"
            onClose={onModalClose}
            primaryAction={{
              content: 'Confirm',
              onAction: handleModalConfirm,
            }}
            secondaryActions={[
              {
                content: 'Close',
                onAction: onModalClose,
              },
            ]}
            open={modalOpen}>
            <Modal.Section>
              <TextContainer>
                <Heading>Add options</Heading>
                {modalData?.map(option => (
                  <div key={Math.random()}>
                    <OptionRow
                      checked={setChecked(option)}
                      handleChange={handleCheckboxUpdate}
                      option={option} />
                  </div>
                ))}
              </TextContainer>
            </Modal.Section>
          </Modal> */}
        </Allotment.Pane>
      </Allotment>
    </>
  );
};
