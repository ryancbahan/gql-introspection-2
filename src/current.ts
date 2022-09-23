{
    "kind": "SelectionSet",
    "selections": [
        {
            "kind": "Field",
            "name": {
                "kind": "Name",
                "value": "appCreditCreate"
            },
            "selectionSet": {
                "kind": "SelectionSet",
                "selections": [
                    {
                        "kind": "Field",
                        "name": {
                            "kind": "Name",
                            "value": "appCredit"
                        },
                        "arguments": [],
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "amount"
                                    },
                                    "arguments": []
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "createdAt"
                                    },
                                    "arguments": []
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "description"
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
                                        "value": "test"
                                    },
                                    "arguments": []
                                }
                            ]
                        }
                    },
                    {
                        "kind": "Field",
                        "name": {
                            "kind": "Name",
                            "value": "userErrors"
                        },
                        "arguments": [],
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "field"
                                    },
                                    "arguments": []
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "message"
                                    },
                                    "arguments": []
                                }
                            ]
                        }
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
                        "value": "amount"
                    },
                    "value": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "amount"
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
                        "value": "description"
                    },
                    "value": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "description"
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
                        "value": "test"
                    },
                    "value": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "test"
                        }
                    }
                }
            ]
        }
    ]
}

// variable definiitons

{
    "amount": {
        "kind": "VariableDefinition",
        "type": {
            "kind": "NonNullType",
            "type": {
                "kind": "NamedType",
                "name": {
                    "kind": "Name",
                    "value": "MoneyInput",
                    "loc": {
                        "start": 465583,
                        "end": 465593
                    }
                },
                "loc": {
                    "start": 465583,
                    "end": 465593
                }
            },
            "loc": {
                "start": 465583,
                "end": 465594
            }
        },
        "variable": {
            "kind": "Variable",
            "name": {
                "kind": "Name",
                "value": "amount"
            }
        }
    },
    "description": {
        "kind": "VariableDefinition",
        "type": {
            "kind": "NonNullType",
            "type": {
                "kind": "NamedType",
                "name": {
                    "kind": "Name",
                    "value": "String",
                    "loc": {
                        "start": 465658,
                        "end": 465664
                    }
                },
                "loc": {
                    "start": 465658,
                    "end": 465664
                }
            },
            "loc": {
                "start": 465658,
                "end": 465665
            }
        },
        "variable": {
            "kind": "Variable",
            "name": {
                "kind": "Name",
                "value": "description"
            }
        }
    },
    "test": {
        "kind": "VariableDefinition",
        "type": {
            "kind": "NamedType",
            "name": {
                "kind": "Name",
                "value": "Boolean",
                "loc": {
                    "start": 465743,
                    "end": 465750
                }
            },
            "loc": {
                "start": 465743,
                "end": 465750
            }
        },
        "variable": {
            "kind": "Variable",
            "name": {
                "kind": "Name",
                "value": "test"
            }
        }
    }
}

// variables

{
    "amount": {
        "amount": "10.00",
        "currencyCode": "USD"
    },
    "description": "Placeholder",
    "test": true
}
