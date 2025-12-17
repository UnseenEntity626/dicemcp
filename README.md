# Dice MCP Server

A simple MCP server for rolling dice in TTRPG sessions.

## Features

- **xDy format dice rolling**: Roll any number of dice with any number of sides
- **Target number check**: Specify a target for success/failure determination
- **Modifier support**: Add modifiers to the total
- **Coin flip**: Simple heads or tails

## Installation

```bash
git clone https://github.com/yourusername/dicemcp.git
cd dicemcp
npm install
npm run build
```

## Usage

Add to your MCP client config:

### Gemini CLI (`~/.gemini/settings.json`)

```json
{
  "mcpServers": {
    "dicemcp": {
      "command": "node",
      "args": ["/path/to/dicemcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "dicemcp": {
      "command": "node",
      "args": ["/path/to/dicemcp/dist/index.js"]
    }
  }
}
```

## Tools

### roll_dice

Roll dice in xDy format. Optionally specify a target number for success/failure check.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| count | number | ✅ | Number of dice (1-100) |
| sides | number | ✅ | Number of sides per die (2-1000) |
| target | number | | Target number for success check |
| modifier | number | | Modifier to add to total |

**Examples:**

- Roll 2d6: `count: 2, sides: 6`
- Roll 1d20+5 vs DC 15: `count: 1, sides: 20, target: 15, modifier: 5`

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
