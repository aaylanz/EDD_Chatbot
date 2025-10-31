# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a sample application for the NICE CXone Chat Web SDK (`@nice-devone/nice-cxone-chat-web-sdk`). It demonstrates multiple chat interface variants for customer service interactions, built with React 17, TypeScript, Vite, and Material-UI.

## Development Commands

### Starting the Application

- **Default (HTTPS)**: `npm start`
- **Messenger variant**: `npm run start:messenger`
- **Livechat variant**: `npm run start:livechat`
- **Multithread variant**: `npm run start:multithread`
- **Third-party OAuth variant**: `npm run start:thirdpartyoauth`
- **Secured session variant**: `npm run start:securedsession`

Alternatively, set `REACT_APP_VARIANT` in `.env` file to one of: `MESSENGER`, `LIVECHAT`, `MULTITHREAD`, `THIRD_PARTY_OAUTH`, or `SECURED_SESSION`.

### Build and Testing

- **Type check**: `npm run tsc` (TypeScript compilation check without emit)
- **Lint**: `npm test` (runs ESLint with TypeScript rules)
- **Build**: `npm run build` (TypeScript compilation + Vite build to `build/` directory)
- **Preview build**: `npm run preview`

## Architecture

### Variant-Based Routing

The application uses a variant pattern where `src/Root.tsx` acts as the entry point router, selecting which chat interface to render based on `REACT_APP_VARIANT` environment variable:

- **Livechat** (`src/Livechat/`): Real-time synchronous chat sessions
- **Messenger** (`src/Messenger/`): Asynchronous messaging
- **MultiThreadMessenger** (`src/MultiThreadMessenger/`): Multiple concurrent chat threads
- **ThirdPartyOauth** (`src/ThirdPartyOauth/`): OAuth-authenticated chat
- **SecuredSession** (`src/SecuredSession/`): Secured session chat

Each variant initializes the Chat SDK with variant-specific options (particularly `isLivechat` flag).

### SDK Initialization Pattern

Each variant follows this pattern:
1. Define `ChatSDKOptions` with environment variables (brand ID, channel ID, customer ID, environment)
2. Create SDK instance using `useRef` to maintain single instance across renders
3. Connect to SDK in `useEffect`
4. Manage thread lifecycle (create/load from localStorage)
5. Render variant-specific window component once SDK is ready

Customer IDs and thread IDs are persisted in localStorage for session continuity.

### Shared Components

`src/Chat/` contains reusable chat UI components used across variants:

- **ChatWindow.tsx**: Main chat interface container
- **MessagesBoard/**: Message display with load-more functionality
- **MessageItem/**: Individual message rendering with attachments and rich content
- **SendMessageForm/**: Message input with file upload support
- **MessageRichContent/**: Rich message types (QuickReplies, ListPicker, RichLink, AdaptiveCards)
- **Agent/**: Agent typing indicators and name display
- **Customer/**: Customer identification UI
- **SystemMessage/**: System notifications (queue assignment, agent changes)
- **QueueCounting/**: Queue position display

### Environment Configuration

Required environment variables in `.env` file:
- `REACT_APP_BRAND_ID`: NICE CXone brand identifier
- `REACT_APP_CHANNEL_ID`: Channel identifier
- `REACT_APP_ENVIRONMENT`: Environment name (e.g., `NA1`, `EU1`, `custom`)
- `REACT_APP_VARIANT`: Chat interface variant
- For custom environments: `REACT_APP_CUSTOM_ENVIRONMENT_*` variables
- For OAuth: `REACT_APP_OAUTH_*` variables

Environment types are defined in `src/env.d.ts` for TypeScript intellisense.

### State Management

State is managed locally using React hooks. No global state management library is used. Thread and customer data persistence uses localStorage with keys defined in `src/constants.ts`.

### SDK Integration

The app wraps the NICE CXone Chat Web SDK. Key SDK concepts:
- **ChatSdk**: Main SDK instance
- **Thread**: Represents a chat conversation (base class)
- **LivechatThread**: Specific thread type for livechat sessions
- Thread types determine available operations (e.g., livechat threads can be explicitly ended)

## Key Files

- `src/Root.tsx`: Variant router
- `src/index.tsx`: Application entry point with MUI theme setup
- `src/constants.ts`: localStorage key constants
- `src/env.d.ts`: TypeScript environment variable definitions
- `vite.config.js`: Vite configuration with `REACT_APP` prefix for env vars
- `.eslintrc`: ESLint configuration with TypeScript and React rules

## Official Documentation

Refer to the [Official SDK Documentation](https://help.nice-incontact.com/content/acd/digital/chatsdk/getstartedchatwebsdk.htm) for SDK setup and channel configuration details.
