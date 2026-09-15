/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/outcom.json`.
 */
export type Outcom = {
  "address": "HiQwzXsHYbUPqmzXsNiTt9ZVGNAWW5HX879KTZwgBsRW",
  "metadata": {
    "name": "outcom",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initOapp",
      "discriminator": [
        220,
        237,
        94,
        65,
        27,
        73,
        156,
        203
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "oappConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  79,
                  65,
                  112,
                  112
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "endpointProgram",
          "type": "pubkey"
        },
        {
          "name": "admin",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "initializeTrial",
      "discriminator": [
        67,
        6,
        167,
        214,
        152,
        172,
        208,
        116
      ],
      "accounts": [
        {
          "name": "employer",
          "writable": true,
          "signer": true
        },
        {
          "name": "trialAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  114,
                  105,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "employer"
              },
              {
                "kind": "arg",
                "path": "trialId"
              }
            ]
          }
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "trialAccount"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "employerTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "trialId",
          "type": "string"
        },
        {
          "name": "candidateReward",
          "type": "u64"
        },
        {
          "name": "referralReward",
          "type": "u64"
        }
      ]
    },
    {
      "name": "lzReceive",
      "discriminator": [
        8,
        179,
        120,
        109,
        33,
        118,
        189,
        80
      ],
      "accounts": [
        {
          "name": "endpointProgram",
          "signer": true
        },
        {
          "name": "oappConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  79,
                  65,
                  112,
                  112
                ]
              }
            ]
          }
        },
        {
          "name": "peerConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  101,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "oappConfig"
              },
              {
                "kind": "arg",
                "path": "params.src_eid"
              }
            ]
          }
        },
        {
          "name": "trialAccount",
          "writable": true
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "trialAccount"
              }
            ]
          }
        },
        {
          "name": "candidateTokenAccount",
          "writable": true
        },
        {
          "name": "referrerTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "lzReceiveParams"
            }
          }
        }
      ]
    },
    {
      "name": "setPeer",
      "discriminator": [
        32,
        70,
        184,
        229,
        200,
        115,
        227,
        177
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "oappConfig"
        },
        {
          "name": "peerConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  101,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "oappConfig"
              },
              {
                "kind": "arg",
                "path": "srcEid"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "srcEid",
          "type": "u32"
        },
        {
          "name": "peerAddress",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "startTrial",
      "discriminator": [
        140,
        246,
        178,
        189,
        48,
        119,
        19,
        125
      ],
      "accounts": [
        {
          "name": "candidate",
          "writable": true,
          "signer": true
        },
        {
          "name": "trialAccount",
          "writable": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "oAppConfig",
      "discriminator": [
        93,
        56,
        102,
        151,
        135,
        221,
        46,
        250
      ]
    },
    {
      "name": "peerConfig",
      "discriminator": [
        181,
        157,
        86,
        198,
        33,
        193,
        94,
        203
      ]
    },
    {
      "name": "trialAccount",
      "discriminator": [
        202,
        241,
        246,
        201,
        17,
        7,
        232,
        214
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "trialIdTooLong",
      "msg": "Trial ID exceeds maximum length of 32 bytes."
    },
    {
      "code": 6001,
      "name": "trialNotOpen",
      "msg": "Trial is not open for applicants."
    },
    {
      "code": 6002,
      "name": "invalidStatus",
      "msg": "Trial is in an invalid state for this operation."
    },
    {
      "code": 6003,
      "name": "overflow",
      "msg": "Arithmetic overflow occurred."
    },
    {
      "code": 6004,
      "name": "unauthorizedEndpoint",
      "msg": "Unauthorized LayerZero Endpoint caller."
    },
    {
      "code": 6005,
      "name": "invalidSourceEid",
      "msg": "Invalid Source EID from LayerZero message."
    },
    {
      "code": 6006,
      "name": "invalidPeerSender",
      "msg": "Invalid Peer Sender from LayerZero message."
    },
    {
      "code": 6007,
      "name": "invalidPayloadLength",
      "msg": "Invalid payload length."
    },
    {
      "code": 6008,
      "name": "invalidPayload",
      "msg": "Invalid payload data."
    },
    {
      "code": 6009,
      "name": "trialIdMismatch",
      "msg": "Trial ID in payload does not match account."
    },
    {
      "code": 6010,
      "name": "invalidCandidateAccount",
      "msg": "Candidate token account does not match payload recipient."
    },
    {
      "code": 6011,
      "name": "invalidReferrerAccount",
      "msg": "Referrer token account does not match payload recipient."
    }
  ],
  "types": [
    {
      "name": "lzReceiveParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "srcEid",
            "type": "u32"
          },
          {
            "name": "sender",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "nonce",
            "type": "u64"
          },
          {
            "name": "guid",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "payload",
            "type": "bytes"
          },
          {
            "name": "extraData",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "oAppConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "endpointProgram",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "peerConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "srcEid",
            "type": "u32"
          },
          {
            "name": "address",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "trialAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "employer",
            "type": "pubkey"
          },
          {
            "name": "trialId",
            "type": "string"
          },
          {
            "name": "candidateReward",
            "type": "u64"
          },
          {
            "name": "referralReward",
            "type": "u64"
          },
          {
            "name": "totalLocked",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "trialStatus"
              }
            }
          },
          {
            "name": "selectedCandidate",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "trialStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "open"
          },
          {
            "name": "inProgress"
          },
          {
            "name": "readyToSubmit"
          },
          {
            "name": "underReview"
          },
          {
            "name": "verified"
          },
          {
            "name": "paid"
          },
          {
            "name": "rejected"
          }
        ]
      }
    }
  ]
};
