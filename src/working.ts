{
    "kind": "SelectionSet",
    "selections": [
        {
            "kind": "Field",
            "name": {
                "kind": "Name",
                "value": "orderEditSetQuantity"
            },
            "selectionSet": {
                "kind": "SelectionSet",
                "selections": [
                    {
                        "kind": "Field",
                        "name": {
                            "kind": "Name",
                            "value": "calculatedOrder"
                        },
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "committed"
                                    },
                                    "arguments": []
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "id"
                                    },
                                    "arguments": []
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "notificationPreviewHtml"
                                    },
                                    "arguments": []
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "notificationPreviewTitle"
                                    },
                                    "arguments": []
                                }
                            ]
                        },
                        "arguments": []
                    }
                ]
            },
            "arguments": [
                {
                    "kind": "Argument",
                    "loc": {
                        "start": 0,
                        "end": 0,
                        "startToken": null,
                        "endToken": null,
                        "source": null
                    },
                    "name": {
                        "kind": "Name",
                        "value": "id"
                    },
                    "value": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "Mutation__orderEditSetQuantity__id"
                        }
                    }
                },
                {
                    "kind": "Argument",
                    "loc": {
                        "start": 0,
                        "end": 0,
                        "startToken": null,
                        "endToken": null,
                        "source": null
                    },
                    "name": {
                        "kind": "Name",
                        "value": "lineItemId"
                    },
                    "value": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "Mutation__orderEditSetQuantity__lineItemId"
                        }
                    }
                },
                {
                    "kind": "Argument",
                    "loc": {
                        "start": 0,
                        "end": 0,
                        "startToken": null,
                        "endToken": null,
                        "source": null
                    },
                    "name": {
                        "kind": "Name",
                        "value": "quantity"
                    },
                    "value": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "Mutation__orderEditSetQuantity__quantity"
                        }
                    }
                }
            ]
        }
    ]
}

// definiitons map

{
    "Mutation__orderEditSetQuantity__id": {
        "kind": "VariableDefinition",
        "type": {
            "kind": "NonNullType",
            "type": {
                "kind": "NamedType",
                "name": {
                    "kind": "Name",
                    "value": "ID",
                    "loc": {
                        "start": 513529,
                        "end": 513531
                    }
                },
                "loc": {
                    "start": 513529,
                    "end": 513531
                }
            },
            "loc": {
                "start": 513529,
                "end": 513532
            }
        },
        "variable": {
            "kind": "Variable",
            "name": {
                "kind": "Name",
                "value": "Mutation__orderEditSetQuantity__id"
            }
        }
    },
    "Mutation__orderEditSetQuantity__lineItemId": {
        "kind": "VariableDefinition",
        "type": {
            "kind": "NonNullType",
            "type": {
                "kind": "NamedType",
                "name": {
                    "kind": "Name",
                    "value": "ID",
                    "loc": {
                        "start": 513593,
                        "end": 513595
                    }
                },
                "loc": {
                    "start": 513593,
                    "end": 513595
                }
            },
            "loc": {
                "start": 513593,
                "end": 513596
            }
        },
        "variable": {
            "kind": "Variable",
            "name": {
                "kind": "Name",
                "value": "Mutation__orderEditSetQuantity__lineItemId"
            }
        }
    },
    "Mutation__orderEditSetQuantity__quantity": {
        "kind": "VariableDefinition",
        "type": {
            "kind": "NonNullType",
            "type": {
                "kind": "NamedType",
                "name": {
                    "kind": "Name",
                    "value": "Int",
                    "loc": {
                        "start": 513927,
                        "end": 513930
                    }
                },
                "loc": {
                    "start": 513927,
                    "end": 513930
                }
            },
            "loc": {
                "start": 513927,
                "end": 513931
            }
        },
        "variable": {
            "kind": "Variable",
            "name": {
                "kind": "Name",
                "value": "Mutation__orderEditSetQuantity__quantity"
            }
        }
    }
}

// variable values

{
    "Mutation__orderEditSetQuantity__id": "PLACEHOLDER",
    "Mutation__orderEditSetQuantity__lineItemId": "PLACEHOLDER",
    "Mutation__orderEditSetQuantity__quantity": 10
}
