// // all field types

// 'ScalarTypeDefinitionNode | EnumTypeDefinitionNode | InputObjectTypeDefinitionNode | ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode | UnionTypeDefinitionNode'.

import * as graphqlData from './generated/graphql'

// // creating selection
// if (selectionNode.kind === Kind.FIELD) {
//     let fieldName = selectionNode.name.value
//     if (fieldName in aliasIndexes) {
//       cleanselections.push({
//         ...selectionNode,
//         ...{
//           alias: {
//             kind: Kind.NAME,
//             value: `${fieldName}${aliasIndexes[fieldName]++}`
//           }
//         }
//       })
//     } else {
//       aliasIndexes[fieldName] = 2
//       cleanselections.push(selectionNode)
//     }
//   }

//   //selection output

//   {
//     "kind": "Field",
//     "name": {
//         "kind": "Name",
//         "value": "hasStagedLineItemDiscount"
//     },
//     "arguments": []
// }

// // selection shape

// selections.push({
//     kind: Kind.FIELD,
//     name: getName(field.name.value),
//     selectionSet,
//     arguments: avs.args
//   })

//   // full selection set, unprocessed

//   {
//     "kind": "Field",
//     "name": {
//         "kind": "Name",
//         "value": "orderEditAddVariant"
//     },
//     "selectionSet": {
//         "kind": "SelectionSet",
//         "selections": [
//             {
//                 "kind": "Field",
//                 "name": {
//                     "kind": "Name",
//                     "value": "calculatedLineItem"
//                 },
//                 "selectionSet": {
//                     "kind": "SelectionSet",
//                     "selections": [
//                         {
//                             "kind": "Field",
//                             "name": {
//                                 "kind": "Name",
//                                 "value": "hasStagedLineItemDiscount"
//                             },
//                             "arguments": []
//                         },
//                         {
//                             "kind": "Field",
//                             "name": {
//                                 "kind": "Name",
//                                 "value": "id"
//                             },
//                             "arguments": []
//                         },
//                         {
//                             "kind": "Field",
//                             "name": {
//                                 "kind": "Name",
//                                 "value": "restocking"
//                             },
//                             "arguments": []
//                         },
//                         {
//                             "kind": "Field",
//                             "name": {
//                                 "kind": "Name",
//                                 "value": "sku"
//                             },
//                             "arguments": []
//                         },
//                         {
//                             "kind": "Field",
//                             "name": {
//                                 "kind": "Name",
//                                 "value": "variantTitle"
//                             },
//                             "arguments": []
//                         }
//                     ]
//                 },
//                 "arguments": []
//             }
//         ]
//     },
//     "arguments": [
//         {
//             "kind": "Argument",
//             "loc": {
//                 "start": 0,
//                 "end": 0,
//                 "startToken": null,
//                 "endToken": null,
//                 "source": null
//             },
//             "name": {
//                 "kind": "Name",
//                 "value": "id"
//             },
//             "value": {
//                 "kind": "Variable",
//                 "name": {
//                     "kind": "Name",
//                     "value": "Mutation__orderEditAddVariant__id"
//                 }
//             }
//         },
//         {
//             "kind": "Argument",
//             "loc": {
//                 "start": 0,
//                 "end": 0,
//                 "startToken": null,
//                 "endToken": null,
//                 "source": null
//             },
//             "name": {
//                 "kind": "Name",
//                 "value": "quantity"
//             },
//             "value": {
//                 "kind": "Variable",
//                 "name": {
//                     "kind": "Name",
//                     "value": "Mutation__orderEditAddVariant__quantity"
//                 }
//             }
//         },
//         {
//             "kind": "Argument",
//             "loc": {
//                 "start": 0,
//                 "end": 0,
//                 "startToken": null,
//                 "endToken": null,
//                 "source": null
//             },
//             "name": {
//                 "kind": "Name",
//                 "value": "variantId"
//             },
//             "value": {
//                 "kind": "Variable",
//                 "name": {
//                     "kind": "Name",
//                     "value": "Mutation__orderEditAddVariant__variantId"
//                 }
//             }
//         }
//     ]
// }

// // full selection set, processed

//   {
//     "kind": "SelectionSet",
//     "selections": [
//         {
//             "kind": "Field",
//             "name": {
//                 "kind": "Name",
//                 "value": "orderEditAddVariant"
//             },
//             "selectionSet": {
//                 "kind": "SelectionSet",
//                 "selections": [
//                     {
//                         "kind": "Field",
//                         "name": {
//                             "kind": "Name",
//                             "value": "calculatedLineItem"
//                         },
//                         "selectionSet": {
//                             "kind": "SelectionSet",
//                             "selections": [
//                                 {
//                                     "kind": "Field",
//                                     "name": {
//                                         "kind": "Name",
//                                         "value": "hasStagedLineItemDiscount"
//                                     },
//                                     "arguments": []
//                                 },
//                                 {
//                                     "kind": "Field",
//                                     "name": {
//                                         "kind": "Name",
//                                         "value": "id"
//                                     },
//                                     "arguments": []
//                                 },
//                                 {
//                                     "kind": "Field",
//                                     "name": {
//                                         "kind": "Name",
//                                         "value": "restocking"
//                                     },
//                                     "arguments": []
//                                 },
//                                 {
//                                     "kind": "Field",
//                                     "name": {
//                                         "kind": "Name",
//                                         "value": "sku"
//                                     },
//                                     "arguments": []
//                                 },
//                                 {
//                                     "kind": "Field",
//                                     "name": {
//                                         "kind": "Name",
//                                         "value": "variantTitle"
//                                     },
//                                     "arguments": []
//                                 }
//                             ]
//                         },
//                         "arguments": []
//                     }
//                 ]
//             },
//             "arguments": [
//                 {
//                     "kind": "Argument",
//                     "loc": {
//                         "start": 0,
//                         "end": 0,
//                         "startToken": null,
//                         "endToken": null,
//                         "source": null
//                     },
//                     "name": {
//                         "kind": "Name",
//                         "value": "id"
//                     },
//                     "value": {
//                         "kind": "Variable",
//                         "name": {
//                             "kind": "Name",
//                             "value": "Mutation__orderEditAddVariant__id"
//                         }
//                     }
//                 },
//                 {
//                     "kind": "Argument",
//                     "loc": {
//                         "start": 0,
//                         "end": 0,
//                         "startToken": null,
//                         "endToken": null,
//                         "source": null
//                     },
//                     "name": {
//                         "kind": "Name",
//                         "value": "quantity"
//                     },
//                     "value": {
//                         "kind": "Variable",
//                         "name": {
//                             "kind": "Name",
//                             "value": "Mutation__orderEditAddVariant__quantity"
//                         }
//                     }
//                 },
//                 {
//                     "kind": "Argument",
//                     "loc": {
//                         "start": 0,
//                         "end": 0,
//                         "startToken": null,
//                         "endToken": null,
//                         "source": null
//                     },
//                     "name": {
//                         "kind": "Name",
//                         "value": "variantId"
//                     },
//                     "value": {
//                         "kind": "Variable",
//                         "name": {
//                             "kind": "Name",
//                             "value": "Mutation__orderEditAddVariant__variantId"
//                         }
//                     }
//                 }
//             ]
//         }
//     ]
// }

// // arg

// {
//     "kind": "Argument",
//     "loc": {
//         "start": 0,
//         "end": 0,
//         "startToken": null,
//         "endToken": null,
//         "source": null
//     },
//     "name": {
//         "kind": "Name",
//         "value": "id"
//     },
//     "value": {
//         "kind": "Variable",
//         "name": {
//             "kind": "Name",
//             "value": "Product__inCollection__id"
//         }
//     }
// }

// // selection processing
// {
// selectionSet:
// cleanselections.length > 0
//   ? {
//       kind: Kind.SELECTION_SET,
//       selections: cleanselections
//     }
//   : undefined,
// variableDefinitionsMap,
// variableValues
// }


// function getVariableDefinition(
//     name: string,
//     type: TypeNode
//   ): VariableDefinitionNode {
//     return {
//       kind: Kind.VARIABLE_DEFINITION,
//       type: type,
//       variable: {
//         kind: Kind.VARIABLE,
//         name: getName(name)
//       }
//     }
//   }

//   function getVariable(argName: string, varName: string): ArgumentNode {
//     return {
//       kind: Kind.ARGUMENT,
//       loc,
//       name: getName(argName),
//       value: {
//         kind: Kind.VARIABLE,
//         name: getName(varName)
//       }
//     }
//   }

//   // variable definitions map shape

//   {
//     "variableDefinitionsMap": {
//         "Mutation__fulfillmentServiceUpdate__id": {
//             "kind": "VariableDefinition",
//             "type": {
//                 "kind": "NonNullType",
//                 "type": {
//                     "kind": "NamedType",
//                     "name": {
//                         "kind": "Name",
//                         "value": "ID",
//                         "loc": {
//                             "start": 499662,
//                             "end": 499664
//                         }
//                     },
//                     "loc": {
//                         "start": 499662,
//                         "end": 499664
//                     }
//                 },
//                 "loc": {
//                     "start": 499662,
//                     "end": 499665
//                 }
//             },
//             "variable": {
//                 "kind": "Variable",
//                 "name": {
//                     "kind": "Name",
//                     "value": "Mutation__fulfillmentServiceUpdate__id"
//                 }
//             }
//         }
//     }
// }

// {
//     "variableDefinitionsMap": {
//         "Mutation__productVariantDetachMedia__productId": {
//             "kind": "VariableDefinition",
//             "type": {
//                 "kind": "NonNullType",
//                 "type": {
//                     "kind": "NamedType",
//                     "name": {
//                         "kind": "Name",
//                         "value": "ID",
//                         "loc": {
//                             "start": 526764,
//                             "end": 526766
//                         }
//                     },
//                     "loc": {
//                         "start": 526764,
//                         "end": 526766
//                     }
//                 },
//                 "loc": {
//                     "start": 526764,
//                     "end": 526767
//                 }
//             },
//             "variable": {
//                 "kind": "Variable",
//                 "name": {
//                     "kind": "Name",
//                     "value": "Mutation__productVariantDetachMedia__productId"
//                 }
//             }
//         },
//         "Mutation__productVariantDetachMedia__variantMedia": {
//             "kind": "VariableDefinition",
//             "type": {
//                 "kind": "NonNullType",
//                 "type": {
//                     "kind": "ListType",
//                     "type": {
//                         "kind": "NonNullType",
//                         "type": {
//                             "kind": "NamedType",
//                             "name": {
//                                 "kind": "Name",
//                                 "value": "ProductVariantDetachMediaInput",
//                                 "loc": {
//                                     "start": 526869,
//                                     "end": 526899
//                                 }
//                             },
//                             "loc": {
//                                 "start": 526869,
//                                 "end": 526899
//                             }
//                         },
//                         "loc": {
//                             "start": 526869,
//                             "end": 526900
//                         }
//                     },
//                     "loc": {
//                         "start": 526868,
//                         "end": 526901
//                     }
//                 },
//                 "loc": {
//                     "start": 526868,
//                     "end": 526902
//                 }
//             },
//             "variable": {
//                 "kind": "Variable",
//                 "name": {
//                     "kind": "Name",
//                     "value": "Mutation__productVariantDetachMedia__variantMedia"
//                 }
//             }
//         }
//     }
// }


