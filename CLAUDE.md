# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript sample application for the NICE CXone Chat Web SDK. It demonstrates multiple chat interface variants (Livechat, Messenger, Multithread, OAuth, Secured Session) built on top of `@nice-devone/nice-cxone-chat-web-sdk` version 2.2.0.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (uses HTTPS by default)
npm start

# Start specific variants (without HTTPS)
npm run start:messenger      # Messenger variant
npm run start:multithread    # Multi-thread messenger
npm run start:livechat       # Livechat variant
npm run start:thirdpartyoauth # Third-party OAuth variant
npm run start:securedsession  # Secured session variant

# Type checking
npm run tsc                  # TypeScript check without emitting files
tsc --noEmit                 # Alternative direct command

# Linting
npm test                     # Runs ESLint with TypeScript

# Build for production
npm run build                # Standard production build
npm run build:gh-pages       # Build for GitHub Pages deployment

# Preview production build
npm run preview
```

## Architecture

### Application Entry Point

- **src/index.tsx**: Main entry point that renders the app with Material-UI theme
- **src/Root.tsx**: Root component that routes to different variants based on `REACT_APP_VARIANT` environment variable

### Variant Architecture

The application uses a **variant pattern** where the `REACT_APP_VARIANT` environment variable determines which chat interface to render:

- `LIVECHAT` → `src/Livechat/Livechat.tsx`
- `MESSENGER` → `src/Messenger/Messenger.tsx`
- `MULTITHREAD` → `src/MultiThreadMessenger/MultiThreadMessenger.tsx`
- `THIRD_PARTY_OAUTH` → `src/ThirdPartyOauth/ThirdPartyOauth.tsx`
- `SECURED_SESSION` → `src/SecuredSession/SecuredSession.tsx`

Each variant:
1. Initializes `ChatSdk` with appropriate `ChatSDKOptions`
2. Manages SDK connection lifecycle
3. Renders variant-specific UI using shared components from `src/Chat/`

### Key Architectural Patterns

**SDK Initialization Pattern**: Each variant component initializes the SDK with `useRef` to maintain a stable reference across renders:

```typescript
const sdkRef = useRef<ChatSdk>(new ChatSdk(chatSdkOptions));
const sdk = sdkRef.current;
```

**Thread Management**:
- Thread IDs are persisted in localStorage using channel-specific keys (see `src/Chat/utils/getThreadIdStorageKey.ts`)
- Customer IDs are stored in localStorage under `STORAGE_CHAT_CUSTOMER_ID`
- Livechat uses `LivechatThread`, while Messenger/Multithread use standard `Thread`

**Message State Management**:
- Messages are stored in a `Map<string, Message>` for efficient lookups
- `src/state/messages/mergeMessages.ts` provides deduplication logic when merging new messages

### Shared Components

**src/Chat/** contains reusable chat UI components:
- `Chat.tsx` - Container with toggle visibility (chat bubble pattern)
- `ChatWindow.tsx` - Main chat interface with header, messages board, and input
- `MessagesBoard/` - Message list with scroll management and "load more" functionality
- `MessageItem/` - Individual message rendering with attachments and text
- `MessageRichContent/` - Rich message types (Adaptive Cards, Quick Replies, List Picker, Rich Link)
- `SendMessageForm/` - Message input with file upload support
- `Agent/` - Agent typing indicators
- `SystemMessage/` - System notifications (agent assignment, queue changes)

### Environment Configuration

Required environment variables in `.env`:
- `REACT_APP_VARIANT` - Which variant to run
- `REACT_APP_ENVIRONMENT` - CXone environment (e.g., NA1, EU1, or "custom")
- `REACT_APP_BRAND_ID` - CXone Brand ID
- `REACT_APP_CHANNEL_ID` - CXone Channel ID

Optional for custom environments:
- `REACT_APP_CUSTOM_ENVIRONMENT_AUTHORIZE`
- `REACT_APP_CUSTOM_ENVIRONMENT_CHAT`
- `REACT_APP_CUSTOM_ENVIRONMENT_GATEWAY`
- `REACT_APP_CUSTOM_ENVIRONMENT_NAME`

Optional for OAuth:
- `REACT_APP_OAUTH_ENABLED`
- `REACT_APP_OAUTH_PROVIDER_URL`
- `REACT_APP_OAUTH_REDIRECT_URI`
- `REACT_APP_OAUTH_CLIENT_ID`

### Build System

- **Vite** (v5) with React SWC plugin for fast builds and HMR
- TypeScript strict mode enabled
- ESLint configured for TypeScript and React hooks
- Environment variables must be prefixed with `REACT_APP` (see `vite.config.js`)
- Build output directory: `build/` (not standard `dist/`)
- GitHub Pages deployment configured with base path `/EDD_Chatbot/`

### Important Implementation Details

**Livechat vs Messenger**: The key difference is the `isLivechat` flag in `ChatSDKOptions`:
- Livechat: `isLivechat: true` - synchronous, session-based
- Messenger: `isLivechat: false` - asynchronous, persistent threads

**Rich Content Support**: The app supports multiple message types via Adaptive Cards:
- Native Adaptive Cards (`MessageType.ADAPTIVE_CARD`)
- Quick Replies
- List Picker
- Rich Link
- Plugin messages (not implemented, logs warning)

**File Upload**: Handled in `src/Chat/FileUpload/` with `composeAttachmentsMessageData` utility

**Thread Metadata**: Multi-thread variant loads thread metadata asynchronously for displaying thread previews
