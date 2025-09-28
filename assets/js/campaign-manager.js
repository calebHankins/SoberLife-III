// SoberLife III - Campaign Manager
// Campaign state coordination and navigation flow

import { campaignState, updateCampaignState, loadCampaignProgress, resetCampaignState, resetGameState } from './game-state.js';
import { taskDefinitions, getTaskDefinition, isTaskUnlocked, getNextAvailableTask } from './task-definitions.js';
import { openShop, updateShopUI, validateShopState } from './shop-system.js';
import { hideElement, showElement } from './ui-manager.js';

// Initialize campaign system
export function initializeCampaign() {
    try {
        // Load saved campaign progress
        const loaded = loadCampaignProgress();
        
        if (loaded) {
            console.log('Campaign progress loaded from storage');
            
            // Validate and repair campaign state if needed
            if (!validateCampaignState()) {
                console.warn('Campaign state validation failed, attempting repair');
                repairCampaignState();
            }
            
            validateShopState(); // Ensure shop state is consistent
        } else {
            console.log('Starting new campaign');
            resetCampaignState();
        }
        
        // Update campaign mode flag
        updateCampaignState({ campaignMode: true });
        
        return true;
        
    } catch (error) {
        console.error('Error initializing campaign:', error);
        // Fallback to fresh campaign state
        try {
            resetCampaignState();
            updateCampaignState({ campaignMode: true });
            return true;
        } catch (fallbackError) {
            console.error('Failed to initialize fallback campaign state:', fallbackError);
            return false;
        }
    }
}

// Show campaign overview screen
export function showCampaignOverview() {
    try {
        // Hide other screens
        hideElement('gameModeSelection');
        hideElement('surveySection');
        hideElement('taskInfo');
        hideElement('zenActivities');
        hideElement('gameArea');
        hideElement('gameOverScreen');
        hideElement('gameSuccessScreen');
        hideElement('upgradeShop');
        
        // Show campaign overview
        showElement('campaignOverview');
        
        // Update campaign UI
        updateCampaignUI();
        
        console.log('Campaign overview displayed');
        
    } catch (error) {
        console.error('Error showing campaign overview:', error);
    }
}

// Update campaign overview UI
export function updateCampaignUI() {
    try {
        // Update deck composition display
        const deckCompositionElement = document.getElementById('deckComposition');
        if (deckCompositionElement) {
            const { aces, totalCards } = campaignState.deckComposition;
            deckCompositionElement.textContent = `Aces: ${aces} / ${totalCards} Cards`;
        }
        
        // Update campaign progress
        const campaignProgressElement = document.getElementById('campaignProgress');
        if (campaignProgressElement) {
            const totalTasks = Object.keys(taskDefinitions).length;
            const completedCount = campaignState.completedTasks.length;
            campaignProgressElement.textContent = `Tasks Completed: ${completedCount}/${totalTasks}`;
        }
        
        // Update task list
        updateTaskList();
        
    } catch (error) {
        console.error('Error updating campaign UI:', error);
    }
}

// Update task list display
export function updateTaskList() {
    try {
        const taskListElement = document.getElementById('taskList');
        if (!taskListElement) return;
        
        // Clear existing task cards
        taskListElement.innerHTML = '';
        
        // Create task cards for each task
        Object.values(taskDefinitions).forEach(task => {
            const taskCard = createTaskCard(task);
            taskListElement.appendChild(taskCard);
        });
        
    } catch (error) {
        console.error('Error updating task list:', error);
    }
}

// Create individual task card
function createTaskCard(task) {
    const isCompleted = campaignState.completedTasks.includes(task.id);
    const isUnlocked = isTaskUnlocked(task.id, campaignState.completedTasks);
    
    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
    
    taskCard.innerHTML = `
        <div class="task-info-section">
            <h4>${task.name}</h4>
            <p>${task.description}</p>
        </div>
        <div class="task-status">
            <div class="task-status-icon">
                ${isCompleted ? '✅' : isUnlocked ? '🎯' : '🔒'}
            </div>
            <button 
                class="task-btn" 
                onclick="startCampaignTask('${task.id}')"
                ${!isUnlocked ? 'disabled' : ''}
            >
                ${isCompleted ? 'Replay' : isUnlocked ? 'Start' : 'Locked'}
            </button>
        </div>
    `;
    
    return taskCard;
}

// Start a specific campaign task
export function startCampaignTask(taskId) {
    try {
        const task = getTaskDefinition(taskId);
        if (!task) {
            console.error(`Task not found: ${taskId}`);
            return false;
        }
        
        // Check if task is unlocked
        if (!isTaskUnlocked(taskId, campaignState.completedTasks)) {
            console.warn(`Task ${taskId} is not unlocked yet`);
            return false;
        }
        
        // Set current task and reset game state for fresh start
        updateCampaignState({ currentTask: taskId });
        resetGameState(); // Reset game state for new task
        
        // Hide campaign overview
        hideElement('campaignOverview');
        
        // Show survey for task preparation
        showTaskSurvey(task);
        
        console.log(`Starting campaign task: ${task.name}`);
        return true;
        
    } catch (error) {
        console.error('Error starting campaign task:', error);
        return false;
    }
}

// Show task-specific survey
function showTaskSurvey(task) {
    try {
        // Update survey description for the specific task
        const surveyDescription = document.getElementById('surveyDescription');
        if (surveyDescription) {
            surveyDescription.textContent = `Before we begin your ${task.name.toLowerCase()}, let's assess your current stress level:`;
        }
        
        // Update prepared question for task context
        const preparedQuestion = document.getElementById('preparedQuestion');
        if (preparedQuestion) {
            if (task.id === 'dmv') {
                preparedQuestion.textContent = 'How prepared do you feel for the DMV?';
            } else if (task.id === 'jobInterview') {
                preparedQuestion.textContent = 'How prepared do you feel for the job interview?';
            } else {
                preparedQuestion.textContent = 'How prepared do you feel for this task?';
            }
        }
        
        // Show survey section
        showElement('surveySection');
        
        // Reset survey inputs
        const surveyInputs = document.querySelectorAll('input[type="radio"]');
        surveyInputs.forEach(input => input.checked = false);
        
        // Disable start button until survey is complete
        const startTaskBtn = document.getElementById('startTaskBtn');
        if (startTaskBtn) {
            startTaskBtn.disabled = true;
        }
        
    } catch (error) {
        console.error('Error showing task survey:', error);
    }
}

// Complete current task
export function completeCurrentTask(zenPointsEarned) {
    try {
        const currentTaskId = campaignState.currentTask;
        if (!currentTaskId) {
            console.warn('No current task to complete');
            return false;
        }
        
        // Add to completed tasks if not already completed
        if (!campaignState.completedTasks.includes(currentTaskId)) {
            const newCompletedTasks = [...campaignState.completedTasks, currentTaskId];
            updateCampaignState({ 
                completedTasks: newCompletedTasks,
                totalZenEarned: campaignState.totalZenEarned + zenPointsEarned
            });
        }
        
        console.log(`Task ${currentTaskId} completed! Zen earned: ${zenPointsEarned}`);
        
        // Check if campaign is complete
        const totalTasks = Object.keys(taskDefinitions).length;
        if (campaignState.completedTasks.length >= totalTasks) {
            showCampaignComplete();
            return true;
        }
        
        // Show post-task options (shop or continue)
        showPostTaskOptions(zenPointsEarned);
        return true;
        
    } catch (error) {
        console.error('Error completing current task:', error);
        return false;
    }
}

// Show post-task options (shop or continue campaign)
function showPostTaskOptions(zenPointsRemaining) {
    try {
        // Update success screen buttons for campaign mode
        const continueToShopBtn = document.getElementById('continueToShopBtn');
        const continueCampaignBtn = document.getElementById('continueCampaignBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');
        
        if (continueToShopBtn) {
            continueToShopBtn.classList.remove('hidden');
            continueToShopBtn.onclick = () => openShop(zenPointsRemaining);
        }
        
        if (continueCampaignBtn) {
            continueCampaignBtn.classList.remove('hidden');
            continueCampaignBtn.onclick = () => returnToCampaign();
        }
        
        if (playAgainBtn) {
            playAgainBtn.textContent = 'Replay Task';
            playAgainBtn.onclick = () => replayCurrentTask();
        }
        
    } catch (error) {
        console.error('Error showing post-task options:', error);
    }
}

// Return to campaign overview
export function returnToCampaign() {
    try {
        // Hide all game screens
        hideElement('gameOverScreen');
        hideElement('gameSuccessScreen');
        hideElement('upgradeShop');
        hideElement('surveySection');
        hideElement('taskInfo');
        hideElement('zenActivities');
        hideElement('gameArea');
        
        // Show campaign overview
        showCampaignOverview();
        
        console.log('Returned to campaign overview');
        
    } catch (error) {
        console.error('Error returning to campaign:', error);
    }
}

// Replay current task
function replayCurrentTask() {
    try {
        const currentTaskId = campaignState.currentTask;
        if (currentTaskId) {
            // Reset game state before replaying
            resetGameState();
            startCampaignTask(currentTaskId);
        }
    } catch (error) {
        console.error('Error replaying current task:', error);
    }
}

// Show campaign completion
function showCampaignComplete() {
    try {
        // Update success screen for campaign completion
        const successMessage = document.getElementById('successMessage');
        const successSubtext = document.getElementById('successSubtext');
        const successStats = document.getElementById('successStats');
        
        if (successMessage) {
            successMessage.textContent = '🎉 Campaign Complete! 🎉';
        }
        
        if (successSubtext) {
            successSubtext.textContent = 'You\'ve mastered stress management across all scenarios!';
        }
        
        if (successStats) {
            const { aces } = campaignState.deckComposition;
            const { totalSpent } = campaignState.shopUpgrades;
            successStats.innerHTML = `
                <p>Total Tasks Completed: ${campaignState.completedTasks.length}</p>
                <p>Final Deck Power: ${aces} Aces</p>
                <p>Total Zen Invested: ${totalSpent} Points</p>
            `;
        }
        
        // Update buttons for campaign completion
        const continueToShopBtn = document.getElementById('continueToShopBtn');
        const continueCampaignBtn = document.getElementById('continueCampaignBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');
        
        if (continueToShopBtn) continueToShopBtn.classList.add('hidden');
        if (continueCampaignBtn) {
            continueCampaignBtn.textContent = 'View Campaign';
            continueCampaignBtn.classList.remove('hidden');
        }
        if (playAgainBtn) {
            playAgainBtn.textContent = 'New Campaign';
            playAgainBtn.onclick = () => startNewCampaign();
        }
        
        console.log('Campaign completed!');
        
    } catch (error) {
        console.error('Error showing campaign completion:', error);
    }
}

// Start new campaign (reset progress)
export function startNewCampaign() {
    try {
        resetCampaignState();
        resetGameState(); // Also reset the game state
        showCampaignOverview();
        console.log('New campaign started');
    } catch (error) {
        console.error('Error starting new campaign:', error);
    }
}

// Reset campaign progress
export function resetCampaign() {
    try {
        const confirmed = confirm('Are you sure you want to reset your campaign progress? This will delete all completed tasks and deck upgrades.');
        
        if (confirmed) {
            resetCampaignState();
            resetGameState(); // Also reset the game state
            updateCampaignUI();
            console.log('Campaign progress reset');
        }
        
    } catch (error) {
        console.error('Error resetting campaign:', error);
    }
}

// Get campaign statistics
export function getCampaignStatistics() {
    try {
        const totalTasks = Object.keys(taskDefinitions).length;
        const completedTasks = campaignState.completedTasks.length;
        const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
        
        return {
            totalTasks,
            completedTasks,
            completionPercentage,
            totalZenEarned: campaignState.totalZenEarned,
            deckPower: campaignState.deckComposition.aces,
            upgradesOwned: campaignState.shopUpgrades.acesAdded
        };
        
    } catch (error) {
        console.error('Error getting campaign statistics:', error);
        return null;
    }
}

// Check if campaign mode is active
export function isCampaignMode() {
    return campaignState.campaignMode === true;
}

// Get current task definition
export function getCurrentTask() {
    if (campaignState.currentTask) {
        return getTaskDefinition(campaignState.currentTask);
    }
    return null;
}

// Validate campaign state integrity
function validateCampaignState() {
    try {
        // Check required properties exist
        const requiredProps = ['currentTask', 'completedTasks', 'totalZenEarned', 'deckComposition', 'shopUpgrades'];
        for (const prop of requiredProps) {
            if (!(prop in campaignState)) {
                console.warn(`Missing campaign state property: ${prop}`);
                return false;
            }
        }
        
        // Validate data types
        if (typeof campaignState.currentTask !== 'number' && typeof campaignState.currentTask !== 'string') {
            console.warn('Invalid currentTask type');
            return false;
        }
        
        if (!Array.isArray(campaignState.completedTasks)) {
            console.warn('completedTasks is not an array');
            return false;
        }
        
        if (typeof campaignState.totalZenEarned !== 'number' || campaignState.totalZenEarned < 0) {
            console.warn('Invalid totalZenEarned');
            return false;
        }
        
        // Validate deck composition
        const { deckComposition } = campaignState;
        if (!deckComposition || typeof deckComposition.aces !== 'number' || typeof deckComposition.totalCards !== 'number') {
            console.warn('Invalid deck composition');
            return false;
        }
        
        if (deckComposition.aces < 4 || deckComposition.aces > deckComposition.totalCards) {
            console.warn('Invalid ace count in deck composition');
            return false;
        }
        
        // Validate shop upgrades
        const { shopUpgrades } = campaignState;
        if (!shopUpgrades || typeof shopUpgrades.acesAdded !== 'number' || typeof shopUpgrades.totalSpent !== 'number') {
            console.warn('Invalid shop upgrades');
            return false;
        }
        
        if (shopUpgrades.acesAdded < 0 || shopUpgrades.totalSpent < 0) {
            console.warn('Negative values in shop upgrades');
            return false;
        }
        
        // Validate consistency between aces and upgrades
        const expectedAces = 4 + shopUpgrades.acesAdded;
        if (deckComposition.aces !== expectedAces) {
            console.warn('Inconsistency between deck aces and shop upgrades');
            return false;
        }
        
        // Validate completed tasks contain valid task IDs
        for (const taskId of campaignState.completedTasks) {
            if (!getTaskDefinition(taskId)) {
                console.warn(`Invalid completed task ID: ${taskId}`);
                return false;
            }
        }
        
        return true;
        
    } catch (error) {
        console.error('Error validating campaign state:', error);
        return false;
    }
}

// Repair corrupted campaign state
function repairCampaignState() {
    try {
        console.log('Attempting to repair campaign state...');
        
        // Repair missing or invalid properties
        if (typeof campaignState.currentTask !== 'number' && typeof campaignState.currentTask !== 'string') {
            campaignState.currentTask = 0;
        }
        
        if (!Array.isArray(campaignState.completedTasks)) {
            campaignState.completedTasks = [];
        }
        
        if (typeof campaignState.totalZenEarned !== 'number' || campaignState.totalZenEarned < 0) {
            campaignState.totalZenEarned = 0;
        }
        
        // Repair deck composition
        if (!campaignState.deckComposition || typeof campaignState.deckComposition !== 'object') {
            campaignState.deckComposition = { aces: 4, totalCards: 52 };
        } else {
            if (typeof campaignState.deckComposition.aces !== 'number' || campaignState.deckComposition.aces < 4) {
                campaignState.deckComposition.aces = 4;
            }
            if (typeof campaignState.deckComposition.totalCards !== 'number' || campaignState.deckComposition.totalCards < 52) {
                campaignState.deckComposition.totalCards = 52;
            }
        }
        
        // Repair shop upgrades
        if (!campaignState.shopUpgrades || typeof campaignState.shopUpgrades !== 'object') {
            campaignState.shopUpgrades = { acesAdded: 0, totalSpent: 0 };
        } else {
            if (typeof campaignState.shopUpgrades.acesAdded !== 'number' || campaignState.shopUpgrades.acesAdded < 0) {
                campaignState.shopUpgrades.acesAdded = Math.max(0, campaignState.deckComposition.aces - 4);
            }
            if (typeof campaignState.shopUpgrades.totalSpent !== 'number' || campaignState.shopUpgrades.totalSpent < 0) {
                campaignState.shopUpgrades.totalSpent = 0;
            }
        }
        
        // Ensure consistency between aces and upgrades
        const expectedAces = 4 + campaignState.shopUpgrades.acesAdded;
        if (campaignState.deckComposition.aces !== expectedAces) {
            campaignState.deckComposition.aces = expectedAces;
        }
        
        // Filter out invalid completed tasks
        campaignState.completedTasks = campaignState.completedTasks.filter(taskId => {
            return getTaskDefinition(taskId) !== null;
        });
        
        // Ensure task progress object exists
        if (!campaignState.taskProgress || typeof campaignState.taskProgress !== 'object') {
            campaignState.taskProgress = {};
        }
        
        // Save repaired state
        updateCampaignState({});
        
        console.log('Campaign state repaired successfully');
        return true;
        
    } catch (error) {
        console.error('Error repairing campaign state:', error);
        return false;
    }
}

// Create campaign backup
export function createCampaignBackup() {
    try {
        const backup = {
            timestamp: Date.now(),
            campaignState: JSON.parse(JSON.stringify(campaignState))
        };
        
        localStorage.setItem('soberlife-campaign-backup', JSON.stringify(backup));
        console.log('Campaign backup created');
        return true;
        
    } catch (error) {
        console.error('Error creating campaign backup:', error);
        return false;
    }
}

// Restore campaign from backup
export function restoreCampaignBackup() {
    try {
        const backupData = localStorage.getItem('soberlife-campaign-backup');
        if (!backupData) {
            console.warn('No campaign backup found');
            return false;
        }
        
        const backup = JSON.parse(backupData);
        if (!backup.campaignState) {
            console.warn('Invalid backup data');
            return false;
        }
        
        // Restore campaign state
        Object.assign(campaignState, backup.campaignState);
        updateCampaignState({});
        
        console.log('Campaign restored from backup');
        return true;
        
    } catch (error) {
        console.error('Error restoring campaign backup:', error);
        return false;
    }
}

// Emergency campaign reset with confirmation
export function emergencyResetCampaign() {
    try {
        const confirmed = confirm(
            'EMERGENCY RESET: This will completely reset your campaign progress and cannot be undone. ' +
            'Are you absolutely sure you want to continue?'
        );
        
        if (confirmed) {
            // Clear all campaign data
            localStorage.removeItem('soberlife-campaign');
            localStorage.removeItem('soberlife-campaign-backup');
            
            // Reset to default state
            resetCampaignState();
            
            console.log('Emergency campaign reset completed');
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('Error performing emergency reset:', error);
        return false;
    }
}