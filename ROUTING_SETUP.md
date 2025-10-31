# Queue Routing Setup Guide

This guide explains how to configure NICE CXone to route chats to different queues based on the option selected in the chat widget.

## How It Works

When a user selects an option from the chat menu, the application sends a message with specific text that CXone routing rules can use to direct the conversation to the appropriate queue/skill.

## Available Options and Their Messages

| Option Display | Message Sent | Suggested Queue ID |
|---------------|--------------|-------------------|
| Windows Unlock | `Windows Unlock` | `windows_unlock_queue` |
| Windows Password Reset | `Windows Password Reset – provide instructions on how to resolve` | `password_reset_queue` |
| Mainframe Account Revoked | `Mainframe Account Revoked – provide instructions on how to resolve` | `mainframe_account_queue` |
| MFA – Microsoft Authenticator | `MFA – Microsoft Authenticator` | `mfa_authenticator_queue` |
| Outage | `Outage – describe application and level of impact` | `outage_queue` |

## Configuring Routing in NICE CXone

### Step 1: Create Skills/Queues

1. Log in to **NICE CXone Admin**
2. Navigate to **ACD** → **Contact Settings** → **Skills**
3. Create a skill for each category:
   - Windows Unlock Support
   - Password Reset Support
   - Mainframe Account Support
   - MFA/Authenticator Support
   - Outage Support
4. Assign agents to each skill based on their expertise

### Step 2: Configure Routing Rules

You have two main options for routing:

#### Option A: Using Studio (Recommended)

1. Navigate to **ACD** → **Studio** → **Scripts**
2. Open your chat routing script (or create a new one)
3. Add **Case** or **Menu** nodes to check the message content
4. Configure routing logic:

```
BEGIN
  IF Message.Text CONTAINS "Windows Unlock" THEN
    ROUTE TO Skill: "Windows Unlock Support"
  ELSE IF Message.Text CONTAINS "Windows Password Reset" THEN
    ROUTE TO Skill: "Password Reset Support"
  ELSE IF Message.Text CONTAINS "Mainframe Account Revoked" THEN
    ROUTE TO Skill: "Mainframe Account Support"
  ELSE IF Message.Text CONTAINS "MFA – Microsoft Authenticator" THEN
    ROUTE TO Skill: "MFA/Authenticator Support"
  ELSE IF Message.Text CONTAINS "Outage" THEN
    ROUTE TO Skill: "Outage Support"
  ELSE
    ROUTE TO Skill: "General Support"
  END IF
END
```

#### Option B: Using Intelligent Routing

1. Navigate to **Digital** → **Digital Experience** → **Routing**
2. Create routing rules based on **Message Content**
3. Set up rules for each keyword:
   - **Rule 1**: If message contains "Windows Unlock" → Route to Windows Unlock skill
   - **Rule 2**: If message contains "Password Reset" → Route to Password Reset skill
   - **Rule 3**: If message contains "Mainframe" → Route to Mainframe Account skill
   - **Rule 4**: If message contains "MFA" or "Microsoft Authenticator" → Route to MFA skill
   - **Rule 5**: If message contains "Outage" → Route to Outage skill
   - **Default**: Route to General Support skill

### Step 3: Test the Routing

1. **Open the chat widget** from your deployed application
2. **Select each option** one at a time
3. **Verify in CXone Agent** that the chat routes to the correct queue
4. Check the browser console for debug logs showing selected options

## Customizing Queue IDs

If you need to change the queue identifiers, update the `CHAT_OPTIONS` array in:
```
src/Chat/Options/ChatOptions.tsx
```

Change the `queueId` field for each option:
```typescript
const CHAT_OPTIONS: ChatOption[] = [
  {
    label: 'Windows Unlock',
    value: 'Windows Unlock',
    queueId: 'YOUR_QUEUE_ID_HERE', // Change this
  },
  // ... more options
];
```

## Troubleshooting

### Issue: Chats not routing to correct queue

**Solutions:**
1. **Check message content**: Open browser console and verify the message being sent when clicking options
2. **Verify routing rules**: Ensure CXone routing rules match the exact message text
3. **Check skill availability**: Confirm agents are available in the target skill
4. **Review Studio script**: If using Studio, verify the script logic is correct

### Issue: All chats go to default queue

**Solutions:**
1. **Case sensitivity**: CXone routing rules are case-sensitive. Ensure your rules match exactly
2. **Partial matching**: Use "contains" instead of "equals" in routing rules
3. **Rule order**: In Studio scripts, rules are evaluated top-to-bottom. Most specific rules should be first

### Issue: Agents not receiving chats

**Solutions:**
1. **Agent status**: Ensure agents are logged in and set to "Available"
2. **Skill assignment**: Verify agents are assigned to the correct skills
3. **Skill level**: Check that agents have appropriate skill levels (1-20)

## Advanced: Using Contact Custom Fields (Future Enhancement)

For more sophisticated routing, you can extend the code to use contact custom fields:

1. **In CXone Admin**: Define custom fields for contacts
2. **In the code**: Set custom fields using the SDK (requires SDK update)
3. **In routing rules**: Use custom field values for routing decisions

This allows for more complex routing logic beyond simple message content matching.

## Best Practices

1. **Keep message text unique**: Ensure each option has distinct keywords for reliable routing
2. **Use fallback routing**: Always have a default/general queue for unmatched cases
3. **Monitor routing**: Regularly check CXone reports to ensure proper routing
4. **Update documentation**: When adding new options, document the routing configuration
5. **Test in staging**: Test routing changes in a non-production environment first

## Need Help?

- **CXone Documentation**: https://help.nice-incontact.com/
- **Studio Scripting**: Search for "Studio Script Routing" in CXone help
- **Support**: Contact NICE CXone support for routing configuration assistance
