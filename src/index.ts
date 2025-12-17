#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Dice roll parameter schema
const RollDiceSchema = z.object({
    count: z.number().int().min(1).max(100).describe("Number of dice (1-100)"),
    sides: z.number().int().min(2).max(1000).describe("Number of sides per die (2-1000)"),
    target: z.number().int().optional().describe("Target number for success/failure check"),
    modifier: z.number().int().optional().describe("Modifier to add to the total"),
});

type RollDiceParams = z.infer<typeof RollDiceSchema>;

// ダイスを振る関数
function rollDice(params: RollDiceParams) {
    const { count, sides, target, modifier = 0 } = params;

    // 各ダイスの出目を生成
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    // 合計を計算
    const rawTotal = rolls.reduce((sum, roll) => sum + roll, 0);
    const total = rawTotal + modifier;

    // 結果オブジェクトを構築
    const result: {
        notation: string;
        rolls: number[];
        rawTotal: number;
        modifier: number;
        total: number;
        target?: number;
        success?: boolean;
        margin?: number;
    } = {
        notation: `${count}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier.toString()) : ""}`,
        rolls,
        rawTotal,
        modifier,
        total,
    };

    // 目標値が指定された場合、成功判定を行う
    if (target !== undefined) {
        result.target = target;
        result.success = total >= target;
        result.margin = total - target;
    }

    return result;
}

// Coin flip function
function flipCoin(): { result: "heads" | "tails" } {
    const isHeads = Math.random() < 0.5;
    return {
        result: isHeads ? "heads" : "tails",
    };
}

// Format coin flip result
function formatCoinResult(result: ReturnType<typeof flipCoin>): string {
    const emoji = result.result === "heads" ? "🪙" : "⚫";
    return `${emoji} Coin flip: ${result.result}`;
}

// Format dice roll result
function formatResult(result: ReturnType<typeof rollDice>): string {
    let output = `🎲 Rolled ${result.notation}\n`;
    output += `━━━━━━━━━━━━━━━━━━━━\n`;
    output += `Dice: [${result.rolls.join(", ")}]\n`;

    if (result.modifier !== 0) {
        output += `Total: ${result.rawTotal} ${result.modifier > 0 ? "+" : ""}${result.modifier} = ${result.total}\n`;
    } else {
        output += `Total: ${result.total}\n`;
    }

    if (result.target !== undefined) {
        output += `━━━━━━━━━━━━━━━━━━━━\n`;
        output += `Target: ${result.target}\n`;
        if (result.success) {
            output += `✅ Success! (${result.margin! >= 0 ? "+" : ""}${result.margin})\n`;
        } else {
            output += `❌ Failure (${result.margin})\n`;
        }
    }

    return output;
}

// MCPサーバーを作成
const server = new Server(
    {
        name: "dicemcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// ツール一覧を返すハンドラー
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "roll_dice",
                description: "Roll dice in xDy format. Optionally specify a target number for success/failure check.",
                inputSchema: {
                    type: "object",
                    properties: {
                        count: {
                            type: "number",
                            description: "Number of dice (1-100)",
                        },
                        sides: {
                            type: "number",
                            description: "Number of sides per die (2-1000)",
                        },
                        target: {
                            type: "number",
                            description: "Target number for success/failure check",
                        },
                        modifier: {
                            type: "number",
                            description: "Modifier to add to the total",
                        },
                    },
                    required: ["count", "sides"],
                },
            },
            {
                name: "flip_coin",
                description: "Flip a coin and return heads or tails.",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: [],
                },
            },
        ],
    };
});

// ツール呼び出しハンドラー
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;

    if (toolName === "roll_dice") {
        const parseResult = RollDiceSchema.safeParse(request.params.arguments);
        if (!parseResult.success) {
            throw new Error(`Invalid arguments: ${parseResult.error.message}`);
        }

        const result = rollDice(parseResult.data);
        const formattedResult = formatResult(result);

        return {
            content: [
                {
                    type: "text",
                    text: formattedResult,
                },
            ],
        };
    }

    if (toolName === "flip_coin") {
        const result = flipCoin();
        const formattedResult = formatCoinResult(result);

        return {
            content: [
                {
                    type: "text",
                    text: formattedResult,
                },
            ],
        };
    }

    throw new Error(`Unknown tool: ${toolName}`);
});

// サーバーを起動
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Dice MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
