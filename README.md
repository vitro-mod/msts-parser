# msts-parser

TypeScript parser for Microsoft Train Simulator (MSTS) file formats.

## Features

- ✅ Parse MSTS Shape files (.s)
- ✅ Parse MSTS Texture files (.ace)
- ⚠️ Parse MSTS World files (.w)
- ⚠️ Parse MSTS Tile files (.t)
- ✅ Full TypeScript support
- ✅ Works in Node.js and browsers

## Installation

```bash
npm install msts-parser
# or
yarn add msts-parser
```

## Quick Start

```typescript
import { MstsParser } from 'msts-parser';
import type { MstsShape } from 'msts-parser';

const parser = new MstsParser();

// Fetch and parse a shape file
const response = await fetch('path/to/model.s');
const arrayBuffer = await response.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

const shape = await parser.parse<MstsShape>(buffer, 'model.s');
console.log(shape.points.length);

// Or using Node.js fs module
import { readFileSync } from 'fs';
const fileBuffer = readFileSync('path/to/texture.ace');
const texture = await parser.parse(fileBuffer, 'texture.ace');
```
