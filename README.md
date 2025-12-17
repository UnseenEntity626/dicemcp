# Dice MCP Server

A simple MCP server for rolling dice.

## Features

- **xDy format dice rolling**: Roll any number of dice with any number of sides
- **Target number check**: Specify a target for success/failure determination
- **Modifier support**: Add modifiers to the total

## Installation

```bash
npm install
npm run build
```

## Usage

### With npx (Recommended)

Add to your MCP client config (e.g., `settings.json` for Gemini CLI):

```json
{
  "mcpServers": {
    "dicemcp": {
      "command": "npx",
      "args": ["-y", "github:yourusername/dicemcp"]
    }
  }
}
```

### Local Installation

```json
{
  "mcpServers": {
    "dicemcp": {
      "command": "node",
      "args": ["D:/iCloudDrive/Game/dicemcp/dist/index.js"]
    }
  }
}
```

## Tools

### roll_dice

Roll dice in xDy format.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| count | number | ✅ | Number of dice (1-100) |
| sides | number | ✅ | Number of sides per die (2-1000) |
| target | number | | Target number for success check |
| modifier | number | | Modifier to add to total |

#### Examples

**Roll 2d6:**
```
count: 2, sides: 6
```

**Roll 1d20+5 with target 15:**
```
count: 1, sides: 20, target: 15, modifier: 5
```

---

### flip_coin

Flip a coin and return heads or tails. No parameters required.

## Output Examples

```
🎲 Rolled 2d6+3
━━━━━━━━━━━━━━━━━━━━
Dice: [4, 5]
Total: 9 +3 = 12
━━━━━━━━━━━━━━━━━━━━
Target: 10
✅ Success! (+2)
```

```
🪙 Coin flip: heads
```

## License

ISC

