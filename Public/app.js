// Landing Page JavaScript

let currentRoomId = null;
let currentJoinToken = null;

// Theme Toggle Functionality
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateThemeUI(newTheme);
}

function updateThemeUI(theme) {
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');
    
    if (theme === 'dark') {
        icon.textContent = '☀️';
        text.textContent = 'Light';
    } else {
        icon.textContent = '🌙';
        text.textContent = 'Dark';
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);
}

// Star Shower Animation - Continuous Loop with Dark Theme Support
function initStarShower() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) {
        console.log('Canvas not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // Stars array
    let stars = [];
    const numStars = 200;
    
    // Check if dark theme
    function isDarkTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }
    
    // Create stars with theme-aware colors
    function createStars() {
        stars = [];
        const darkMode = isDarkTheme();
        
        for (let i = 0; i < numStars; i++) {
            // Bright colors for dark theme
            const colors = darkMode ? 
                ['#ffffff', '#ffffff', '#ffd700', '#ffd700', '#ff6b9d', '#00ffff', '#ff00ff'] : // More white/gold for dark
                ['#ffd700', '#ff6b9d', '#ffffff', '#ff1493', '#00ced1']; // Normal for light
            
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.5,
                fadeSpeed: Math.random() * 0.03 + 0.01,
                color: colors[Math.floor(Math.random() * colors.length)],
                glowSize: Math.random() * 5 + 3
            });
        }
    }
    
    createStars();
    
    let animationId;
    let isAnimating = true;
    
    // Animation loop - continuous
    function animate() {
        if (!isAnimating) return;
        
        const darkMode = isDarkTheme();
        
        // Clear canvas completely
        ctx.clearRect(0, 0, width, height);
        
        // Draw each star
        stars.forEach(star => {
            // Update position
            star.x += star.speedX;
            star.y += star.speedY;
            
            // Wrap around screen
            if (star.x < 0) star.x = width;
            if (star.x > width) star.x = 0;
            if (star.y < 0) star.y = height;
            if (star.y > height) star.y = 0;
            
            // Twinkle effect - brighter for dark theme
            star.opacity += star.fadeSpeed;
            const maxOpacity = darkMode ? 1 : 0.8;
            const minOpacity = darkMode ? 0.4 : 0.2;
            if (star.opacity > maxOpacity || star.opacity < minOpacity) {
                star.fadeSpeed = -star.fadeSpeed;
            }
            
            // Draw star with glow
            ctx.save();
            
            // Outer glow
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * star.glowSize, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * star.glowSize);
            gradient.addColorStop(0, star.color + (darkMode ? '80' : '40'));
            gradient.addColorStop(0.5, star.color + (darkMode ? '40' : '20'));
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = star.opacity * (darkMode ? 0.8 : 0.5);
            ctx.fill();
            
            // Core star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = star.opacity;
            ctx.fill();
            
            // Bright center for dark theme
            if (darkMode) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = star.opacity * 0.9;
                ctx.fill();
            }
            
            ctx.restore();
        });
        
        // Continue animation loop
        animationId = requestAnimationFrame(animate);
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createStars();
    });
    
    // Recreate stars when theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                createStars();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
    
    // Start animation
    animate();
    console.log('Star animation started - continuous loop with dark theme support!');
}

// Chat Preview Animation
function animatePreview() {
    const messages = [
        { text: "Hey! 👋", type: "received" },
        { text: "Hi there! 💕", type: "sent" },
        { text: "This is so cute! 🥰", type: "received" },
        { text: "Yes! Secure too 🔒", type: "sent" },
        { text: "Love the pink theme 💗", type: "received" },
        { text: "Only we can see this 😊", type: "sent" }
    ];
    
    let currentIndex = 0;
    const container = document.getElementById('previewMessages');
    
    if (!container) return;
    
    // Clear existing messages
    container.innerHTML = '';
    
    function addMessage() {
        const msg = messages[currentIndex % messages.length];
        const div = document.createElement('div');
        div.className = `preview-message ${msg.type}`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        div.innerHTML = `
            <span class="preview-text">${msg.text}</span>
            <span class="preview-time">${time}</span>
        `;
        
        container.appendChild(div);
        
        // Keep only last 4 messages
        while (container.children.length > 4) {
            container.removeChild(container.firstChild);
        }
        
        // Auto scroll
        container.scrollTop = container.scrollHeight;
        
        currentIndex++;
    }
    
    // Initial messages
    addMessage();
    setTimeout(addMessage, 800);
    setTimeout(addMessage, 1600);
    setTimeout(addMessage, 2400);
    
    // Continue animation
    setInterval(addMessage, 3000);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    loadTheme();
    animatePreview();
    initStarShower();
});

// Create new chat room
async function createRoom() {
    try {
        const response = await fetch('/api/create-room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.roomId && data.token) {
            currentRoomId = data.roomId;
            currentJoinToken = data.token; // Full token: roomId_joinToken
            
            // Show invite modal with only token
            document.getElementById('tokenDisplay').textContent = currentJoinToken;
            document.getElementById('inviteModal').classList.remove('hidden');
            
            // Store in sessionStorage for later
            sessionStorage.setItem('roomId', currentRoomId);
            sessionStorage.setItem('isCreator', 'true');
        }
    } catch (error) {
        console.error('Error creating room:', error);
        alert('Failed to create room. Please try again.');
    }
}

// Copy token
function copyToken() {
    navigator.clipboard.writeText(currentJoinToken).then(() => {
        const copyIcon = document.getElementById('copyIcon');
        const copyText = document.getElementById('copyText');
        
        copyIcon.textContent = '✅';
        copyText.textContent = 'Copied!';
        
        setTimeout(() => {
            copyIcon.textContent = '📋';
            copyText.textContent = 'Copy';
        }, 2000);
    });
}

// Enter chat room
function enterChat() {
    if (currentRoomId) {
        window.location.href = `/chat.html?room=${currentRoomId}`;
    }
}

// Join from token
function joinFromLink() {
    const token = document.getElementById('joinLink').value.trim();
    
    if (!token) {
        alert('Please enter the token number');
        return;
    }
    
    // Token format: roomId_joinToken
    const lastUnderscore = token.lastIndexOf('_');
    if (lastUnderscore > 0) {
        const roomId = token.substring(0, lastUnderscore);
        const joinToken = token.substring(lastUnderscore + 1);
        sessionStorage.setItem('isCreator', 'false');
        window.location.href = `/chat.html?room=${roomId}&token=${joinToken}`;
    } else {
        alert('Invalid token format');
    }
}

// Allow Enter key to submit
document.getElementById('joinLink')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinFromLink();
    }
});
