// SoberLife III - Achievement UI Manager
// UI rendering and updates for achievements

import { getAllAchievements, getStatistics, getAchievementProgress } from './achievement-manager.js';
import { getAchievementsByCategory } from './achievement-definitions.js';

/**
 * Render achievements in Mind Palace "Your Growth Journey" section
 */
export function renderAchievementsInMindPalace() {
    try {
        const container = document.getElementById('upgradeHistoryContent');
        if (!container) {
            console.warn('Achievement container not found');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Add progress summary
        const progress = getAchievementProgress();
        const progressDiv = document.createElement('div');
        progressDiv.className = 'achievement-progress-summary';
        progressDiv.innerHTML = `
            <h4>🏆 Achievement Progress</h4>
            <p>${progress.unlocked} of ${progress.total} achievements unlocked (${progress.percentage}%)</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress.percentage}%"></div>
            </div>
        `;
        container.appendChild(progressDiv);

        // Add statistics section
        renderStatistics(getStatistics(), container);

        // Get all achievements
        const achievements = getAllAchievements();

        // Group by category
        const categories = {
            campaign: { title: '🎓 Campaign Achievements', achievements: [] },
            free_play: { title: '🎯 Free Play Milestones', achievements: [] },
            wealth: { title: '💰 Wealth Milestones', achievements: [] }
        };

        achievements.forEach(achievement => {
            if (categories[achievement.category]) {
                categories[achievement.category].achievements.push(achievement);
            }
        });

        // Render each category
        Object.values(categories).forEach(category => {
            if (category.achievements.length > 0) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'achievement-category';
                categoryDiv.innerHTML = `<h4>${category.title}</h4>`;

                category.achievements.forEach(achievement => {
                    const card = createAchievementCard(
                        achievement,
                        achievement.isUnlocked,
                        achievement.unlockedAt
                    );
                    categoryDiv.appendChild(card);
                });

                container.appendChild(categoryDiv);
            }
        });

    } catch (error) {
        console.error('Error rendering achievements:', error);
    }
}

/**
 * Create an achievement card element
 * @param {Object} achievement - Achievement object
 * @param {boolean} isUnlocked - Whether achievement is unlocked
 * @param {number|null} timestamp - Unlock timestamp
 * @returns {HTMLElement} Achievement card element
 */
export function createAchievementCard(achievement, isUnlocked, timestamp) {
    const card = document.createElement('div');
    card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    card.setAttribute('data-achievement-id', achievement.id);

    const timestampText = timestamp ? formatTimestamp(timestamp) : '';

    card.innerHTML = `
        <div class="achievement-icon">${achievement.emoji}</div>
        <div class="achievement-info">
            <h5 class="achievement-name">${achievement.name}</h5>
            <p class="achievement-description">${achievement.description}</p>
            ${isUnlocked ? `<p class="achievement-flavor">${achievement.flavorText}</p>` : ''}
            ${timestampText ? `<span class="achievement-timestamp">Unlocked: ${timestampText}</span>` : ''}
        </div>
        <div class="achievement-status">
            <span class="status-badge ${isUnlocked ? 'unlocked' : 'locked'}">
                ${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
            </span>
        </div>
    `;

    return card;
}

/**
 * Render statistics in the achievements section
 * @param {Object} stats - Statistics object
 * @param {HTMLElement} container - Container element (optional)
 */
export function renderStatistics(stats, container = null) {
    try {
        const targetContainer = container || document.getElementById('upgradeHistoryContent');
        if (!targetContainer) {
            return;
        }

        const statsDiv = document.createElement('div');
        statsDiv.className = 'achievement-statistics';
        statsDiv.innerHTML = `
            <h4>📊 Your Statistics</h4>
            <div class="stat-grid">
                <div class="stat-item">
                    <span class="stat-icon">🏃</span>
                    <div class="stat-details">
                        <span class="stat-label">Max Free Play Run</span>
                        <span class="stat-value">${stats.freePlayMaxRun} tasks</span>
                    </div>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">💎</span>
                    <div class="stat-details">
                        <span class="stat-label">Peak Zen Points</span>
                        <span class="stat-value">${stats.zenPointsPeak.toLocaleString()} points</span>
                    </div>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">🎯</span>
                    <div class="stat-details">
                        <span class="stat-label">Total Free Play Tasks</span>
                        <span class="stat-value">${stats.freePlayTasksTotal} tasks</span>
                    </div>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">🎓</span>
                    <div class="stat-details">
                        <span class="stat-label">Campaign Status</span>
                        <span class="stat-value">${stats.campaignCompleted ? '✓ Complete' : 'In Progress'}</span>
                    </div>
                </div>
            </div>
        `;

        // Insert after progress summary if it exists
        const progressSummary = targetContainer.querySelector('.achievement-progress-summary');
        if (progressSummary && progressSummary.nextSibling) {
            targetContainer.insertBefore(statsDiv, progressSummary.nextSibling);
        } else {
            targetContainer.appendChild(statsDiv);
        }

    } catch (error) {
        console.error('Error rendering statistics:', error);
    }
}

/**
 * Update a specific achievement display
 * @param {string} achievementId - Achievement ID to update
 */
export function updateAchievementDisplay(achievementId) {
    try {
        const card = document.querySelector(`[data-achievement-id="${achievementId}"]`);
        if (!card) {
            return;
        }

        // Re-render the entire achievements section for simplicity
        renderAchievementsInMindPalace();

    } catch (error) {
        console.error(`Error updating achievement display for ${achievementId}:`, error);
    }
}

/**
 * Format timestamp for display
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return '';
    }
}

/**
 * Show achievement unlock notification
 * This function is called by the achievement manager when an achievement is unlocked
 * @param {Object} achievement - Achievement object
 */
export function showAchievementNotification(achievement) {
    try {
        // Check if notification already exists
        const existing = document.querySelector('.achievement-notification');
        if (existing) {
            // Queue this notification
            setTimeout(() => showAchievementNotification(achievement), 6000);
            return;
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <div class="achievement-notification-header">
                    <span class="achievement-notification-icon">${achievement.emoji}</span>
                    <h3>Achievement Unlocked!</h3>
                </div>
                <div class="achievement-notification-body">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    <p class="achievement-notification-flavor">${achievement.flavorText}</p>
                </div>
                <button class="achievement-notification-close" aria-label="Close notification">×</button>
            </div>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Add celebration particles
        createCelebrationParticles(notification);

        // Setup close button
        const closeBtn = notification.querySelector('.achievement-notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                dismissNotification(notification);
            });
        }

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            dismissNotification(notification);
        }, 5000);

        console.log(`Achievement notification shown: ${achievement.name}`);

    } catch (error) {
        console.error('Error showing achievement notification:', error);
    }
}

/**
 * Dismiss achievement notification
 * @param {HTMLElement} notification - Notification element
 */
function dismissNotification(notification) {
    try {
        if (!notification || !notification.parentNode) {
            return;
        }

        // Add dismissing class to trigger animation
        notification.classList.add('dismissing');
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        notification.style.transition = 'all 0.3s ease-out';

        // Remove from DOM after animation
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 350);

    } catch (error) {
        console.error('Error dismissing notification:', error);
    }
}

/**
 * Create celebration particles for achievement notification
 * @param {HTMLElement} element - Element to create particles around
 */
function createCelebrationParticles(element) {
    try {
        const rect = element.getBoundingClientRect();
        const particleCount = 20;
        const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'achievement-particle';
            particle.textContent = ['✨', '⭐', '🎉', '🎊', '💫'][Math.floor(Math.random() * 5)];

            particle.style.position = 'fixed';
            particle.style.left = `${rect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2}px`;
            particle.style.fontSize = `${12 + Math.random() * 12}px`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10001';

            const angle = (Math.random() * Math.PI * 2);
            const distance = 50 + Math.random() * 100;
            const finalX = Math.cos(angle) * distance;
            const finalY = Math.sin(angle) * distance;

            particle.style.setProperty('--final-x', `${finalX}px`);
            particle.style.setProperty('--final-y', `${finalY}px`);

            document.body.appendChild(particle);

            // Animate
            particle.style.animation = 'achievement-particle-float 1.5s ease-out forwards';

            // Remove after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }
    } catch (error) {
        console.error('Error creating celebration particles:', error);
    }
}

// Make functions available globally for cross-module communication
if (typeof window !== 'undefined') {
    window.showAchievementNotification = showAchievementNotification;
}
