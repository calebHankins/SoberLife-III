# Debugging Guide

## Zen Points System

### Architecture Overview
The zen points system uses a centralized manager pattern with the following flow:
```
ZenPointsManager (authoritative) → Campaign State (persistence) → UI Display
```

### Common Issues & Solutions

#### Issue: Completion Bonus Not Persisting
**Symptoms**: Player earns completion bonus on success screen but balance reverts when returning to campaign
**Root Cause**: Task completion flow timing - completion bonus awarded after campaign state saved
**Solution**: Ensure completion bonus is awarded BEFORE calling `completeCurrentTask()`
**Code Location**: `assets/js/main.js` in task completion flow

#### Issue: Header UI Shows Wrong Balance
**Symptoms**: Backend state is correct but header display shows outdated zen points
**Root Cause**: Missing `updateDisplay()` calls in navigation functions
**Solution**: Add `updateDisplay()` call after updating game state in campaign navigation
**Code Location**: `assets/js/campaign-manager.js` in `showCampaignOverview()`

#### Issue: Shop Purchases Not Persisting
**Symptoms**: Can make purchases but balance reverts after navigation
**Root Cause**: Shop not properly calling zen points manager spend function
**Solution**: Ensure `ZenPointsManager.spend()` is called before updating campaign state
**Code Location**: `assets/js/shop-system.js` in purchase functions

### Debugging Checklist

When investigating zen points issues, check these in order:

1. **Console Logs**: Look for zen point transaction logs showing type and new balance
2. **Manager Balance**: Call `ZenPointsManager.getCurrentBalance()` in console
3. **Campaign State**: Check `campaignState.zenPointBalance` matches manager
4. **UI Display**: Verify header shows same balance as backend state
5. **localStorage**: Inspect raw persistence data for corruption

### Testing Protocol

For any zen points related changes, run this test sequence:

1. **Start Campaign**: Verify initial balance loads correctly
2. **Complete Task**: Earn completion bonus and verify it persists
3. **Visit Shop**: Make purchase and verify deduction
4. **Return to Campaign**: Verify balance is consistent across all displays
5. **Refresh Browser**: Verify persistence across sessions
6. **Navigate All Screens**: Verify UI stays synchronized

### Key Functions to Monitor

- `ZenPointsManager.add()` - All zen point earnings
- `ZenPointsManager.spend()` - All zen point spending  
- `ZenPointsManager.getCurrentBalance()` - Authoritative balance
- `updateDisplay()` - UI synchronization
- `completeCurrentTask()` - Campaign state persistence

### State Validation

The system includes automatic validation and repair:
- Campaign state validation runs on load
- Corrupted data triggers repair mechanisms
- Backup/restore functionality available
- Console warnings for validation failures

## General Debugging Tips

### Module Communication
- Use console.log with module prefixes for traceability
- Import/export issues often cause silent failures
- Check browser network tab for module loading errors

### State Management
- Always update state through proper functions, never directly
- Use validation functions before state changes
- Implement graceful fallbacks for corrupted state

### UI Synchronization
- Call `updateDisplay()` after any state changes that affect UI
- Use consistent data sources across all UI components
- Test navigation flows thoroughly for UI consistency