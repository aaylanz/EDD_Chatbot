# Studio Configuration for Chat Routing

## Quick Studio Setup

Your chat options are configured to send specific messages. Here's how to configure your Studio script to route them to the correct skills.

## Your Skills in CXone

| Message Sent | CXone Skill Name | Skill ID |
|--------------|------------------|----------|
| Windows Unlock | DEV_Windows_Unlock_Chat | 35606166 |
| Windows Password Reset | Windows_Password_Reset | 35665540 |
| Mainframe Account Revoked | Mainframe_Account_Revoked | 35665541 |
| MFA Support | MFA_Support | 35665543 |
| Report Outage | Report_Outage | 35665544 |
| (Default) | DEV_Default_Digital_Chat | 35606176 |

## Studio Script Configuration

### Step 1: Add a CASE Node

After your "Begin" node (or after getting the first contact message):

1. Drag a **CASE** node onto the canvas
2. Double-click to configure it
3. Set **Variable**: `{lastmsg}` (or `{lastmessage}`)

### Step 2: Configure Each Branch

Add these conditions in order:

#### Branch 1: Windows Unlock
- **Condition**: `{lastmsg}` **CONTAINS** `"Windows Unlock"`
- **Action**: Connect to **Assign Skill** node
  - **Skill Name**: `DEV_Windows_Unlock_Chat`
  - **Skill ID**: `35606166`

#### Branch 2: Windows Password Reset
- **Condition**: `{lastmsg}` **CONTAINS** `"Windows Password Reset"`
- **Action**: Connect to **Assign Skill** node
  - **Skill Name**: `Windows_Password_Reset`
  - **Skill ID**: `35665540`

#### Branch 3: Mainframe Account Revoked
- **Condition**: `{lastmsg}` **CONTAINS** `"Mainframe Account Revoked"`
- **Action**: Connect to **Assign Skill** node
  - **Skill Name**: `Mainframe_Account_Revoked`
  - **Skill ID**: `35665541`

#### Branch 4: MFA Support
- **Condition**: `{lastmsg}` **CONTAINS** `"MFA Support"`
- **Action**: Connect to **Assign Skill** node
  - **Skill Name**: `MFA_Support`
  - **Skill ID**: `35665543`

#### Branch 5: Report Outage
- **Condition**: `{lastmsg}` **CONTAINS** `"Report Outage"`
- **Action**: Connect to **Assign Skill** node
  - **Skill Name**: `Report_Outage`
  - **Skill ID**: `35665544`

#### Default Branch
- **Condition**: `DEFAULT` (when no other condition matches)
- **Action**: Connect to **Assign Skill** node
  - **Skill Name**: `DEV_Default_Digital_Chat`
  - **Skill ID**: `35606176`

### Step 3: Connect to ReqAgent

After each **Assign Skill** node, connect to a **ReqAgent** node to actually assign the contact to an agent in that skill.

## Visual Flow

```
[Begin]
   ↓
[GET_CLUST_OM_FIELD or Initial Setup]
   ↓
[CASE - Check {lastmsg}]
   ├─ CONTAINS "Windows Unlock"
   │    ↓
   │  [Assign Skill: DEV_Windows_Unlock_Chat]
   │    ↓
   │  [ReqAgent]
   │
   ├─ CONTAINS "Windows Password Reset"
   │    ↓
   │  [Assign Skill: Windows_Password_Reset]
   │    ↓
   │  [ReqAgent]
   │
   ├─ CONTAINS "Mainframe Account Revoked"
   │    ↓
   │  [Assign Skill: Mainframe_Account_Revoked]
   │    ↓
   │  [ReqAgent]
   │
   ├─ CONTAINS "MFA Support"
   │    ↓
   │  [Assign Skill: MFA_Support]
   │    ↓
   │  [ReqAgent]
   │
   ├─ CONTAINS "Report Outage"
   │    ↓
   │  [Assign Skill: Report_Outage]
   │    ↓
   │  [ReqAgent]
   │
   └─ DEFAULT
        ↓
      [Assign Skill: DEV_Default_Digital_Chat]
        ↓
      [ReqAgent]
```

## Important Settings

### In CASE Node:
- **Use "CONTAINS" not "EQUALS"** - More flexible for matching
- **Case Sensitive**: YES - Make sure to match exact capitalization
- **Variable**: `{lastmsg}` or `{lastmessage}`

### In Assign Skill Node:
- You can use either:
  - **Skill Name** (easier to read)
  - **Skill ID** (more reliable if skill names change)

## Testing

1. **Save** your Studio script
2. **Activate** the script for your digital channel
3. **Open the chat widget** on your site
4. **Click each option** and verify:
   - Check browser console for debug logs
   - Verify in CXone Agent which skill receives the chat
5. **Confirm** each option routes to the correct skill

## Troubleshooting

### Chat goes to wrong skill
- Check CASE conditions are in correct order
- Verify text matching is exact (case-sensitive)
- Make sure you're using CONTAINS not EQUALS

### Chat goes to default skill every time
- Verify `{lastmsg}` variable contains the message text
- Add a TRACE node after BEGIN to debug variable values
- Check that message text from widget matches conditions exactly

### No agents receiving chats
- Verify agents are logged in to CXone Agent
- Check agents are assigned to the correct skills
- Confirm agents are in "Available" status

## Alternative: Simple IF Nodes

If you prefer multiple IF nodes instead of one CASE node:

```
[Begin] → [IF: Contains "Windows Unlock"]
            ├─ TRUE → [Assign: DEV_Windows_Unlock_Chat] → [ReqAgent]
            └─ FALSE → [IF: Contains "Windows Password Reset"]
                        ├─ TRUE → [Assign: Windows_Password_Reset] → [ReqAgent]
                        └─ FALSE → [IF: Contains "Mainframe"] ... etc
```

This is less elegant but easier to understand for beginners.

## Why You Can't Force Routing from Code

**Security & Business Logic**:
- Routing logic should be controlled by your business rules, not client code
- Prevents malicious users from routing themselves to inappropriate queues
- Allows you to change routing logic without updating the widget
- Enables complex routing based on multiple factors (time, availability, priority)

**The Pattern We Use**:
- Widget sends **structured message content**
- Studio reads that content and **makes routing decision**
- This separates concerns: UI vs. business logic

This is the **NICE-recommended approach** for chat routing!
