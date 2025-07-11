// Import CSS files
import '../css/styles.css';

// Chat functionality
function initializeChat() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');

    if (!chatForm || !userInput || !chatContainer) return;

    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        userInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        try {
            console.log('Sending request to:', '/.netlify/functions/chat');
            console.log('Request body:', { message });
            
            // Try multiple endpoints
            let response;
            let endpoints = [
                '/.netlify/functions/chat',
                '/api/chat',
                '/functions/chat'
            ];
            
            let success = false;
            for (let endpoint of endpoints) {
                try {
                    console.log('Trying endpoint:', endpoint);
                    response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message })
                    });
                    
                    if (response.ok) {
                        success = true;
                        break;
                    }
                } catch (err) {
                    console.log('Failed endpoint:', endpoint, err);
                    continue;
                }
            }
            
            if (!success) {
                throw new Error('All endpoints failed');
            }

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            const data = await response.json();
            console.log('Response data:', data);
            hideTypingIndicator();
            addMessage(data.text, 'bot');
        } catch (error) {
            console.error('Error:', error);
            hideTypingIndicator();
            addMessage(`Maaf, terjadi kesalahan: ${error.message}`, 'bot');
        }
    });
}

function addMessage(text, sender) {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `mb-4 flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
    
    const messageClass = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.innerHTML = `
        <div class="message ${messageClass} p-4 max-w-xs">
            <p>${text}</p>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showTypingIndicator() {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'mb-4 flex justify-start';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message bot-message p-4">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Workout functionality
function initializeWorkout() {
    const workoutForm = document.getElementById('workoutForm');
    if (!workoutForm) return;

    workoutForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            fitnessLevel: document.getElementById('fitnessLevel').value,
            workoutType: document.getElementById('workoutType').value,
            duration: document.getElementById('duration').value,
            equipment: Array.from(document.getElementById('equipment').selectedOptions).map(option => option.value),
            goals: Array.from(document.getElementById('goals').selectedOptions).map(option => option.value)
        };

        try {
            // Show loading state
            const popup = document.getElementById('workoutPopup');
            const loading = document.getElementById('loading');
            const result = document.getElementById('workoutResult');
            popup.classList.remove('hidden');
            popup.classList.add('flex');
            loading.classList.remove('hidden');
            result.innerHTML = '';

            // Create a prompt for the AI
            const prompt = `Generate a detailed workout plan with the following specifications:
            - Fitness Level: ${formData.fitnessLevel}
            - Workout Type: ${formData.workoutType}
            - Duration: ${formData.duration} minutes
            - Available Equipment: ${formData.equipment.join(', ')}
            - Goals: ${formData.goals.join(', ')}

            Please provide a structured workout plan in the following format:

            WARM-UP (5-10 minutes):
            [List warm-up exercises with duration/reps]

            MAIN WORKOUT:
            [List exercises with sets, reps, and rest periods]

            COOL-DOWN (5-10 minutes):
            [List cool-down exercises with duration]

            TIPS & PRECAUTIONS:
            [List important tips and precautions]

            Format each section clearly and use bullet points for exercises. Include specific details about form, breathing, and rest periods. Please use **double asterisks** to make important terms, exercise names, or section titles bold.`;

            console.log('Sending workout request');
            console.log('Workout prompt:', prompt);
            
            // Try multiple endpoints for workout
            let response;
            let endpoints = [
                '/.netlify/functions/chat',
                '/api/chat',
                '/functions/chat'
            ];
            
            let success = false;
            for (let endpoint of endpoints) {
                try {
                    console.log('Trying workout endpoint:', endpoint);
                    response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: prompt })
                    });
                    
                    if (response.ok) {
                        success = true;
                        break;
                    }
                } catch (err) {
                    console.log('Failed workout endpoint:', endpoint, err);
                    continue;
                }
            }
            
            if (!success) {
                throw new Error('All workout endpoints failed');
            }

            console.log('Workout response status:', response.status);

            const data = await response.json();
            console.log('Workout response data:', data);
            displayWorkout({ workout: data.text });
        } catch (error) {
            console.error('Workout Error:', error);
            alert(`An error occurred while generating the workout: ${error.message}`);
        } finally {
            // Hide loading state
            document.getElementById('loading').classList.add('hidden');
        }
    });
}

function displayWorkout(response) {
    const result = document.getElementById('workoutResult');
    let workoutText = response.workout;
    
    // Clean up any remaining asterisks and format text properly
    workoutText = workoutText
        // Replace **text** with <strong>text</strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Replace any remaining single asterisks with nothing
        .replace(/\*/g, '')
        // Clean up any extra spaces
        .replace(/\s+/g, ' ')
        .trim();

    // Split the workout text into sections
    const sections = workoutText.split('\n\n');
    let formattedHTML = '';

    sections.forEach(section => {
        if (section.trim()) {
            if (section.toUpperCase().includes('WARM-UP')) {
                formattedHTML += `
                    <div class="workout-section">
                        <h3 class="text-xl font-semibold text-blue-600 mb-4">Warm-Up</h3>
                        <div class="space-y-3">${formatSection(section)}</div>
                    </div>`;
            } else if (section.toUpperCase().includes('MAIN WORKOUT')) {
                formattedHTML += `
                    <div class="workout-section">
                        <h3 class="text-xl font-semibold text-blue-600 mb-4">Main Workout</h3>
                        <div class="space-y-3">${formatSection(section)}</div>
                    </div>`;
            } else if (section.toUpperCase().includes('COOL-DOWN')) {
                formattedHTML += `
                    <div class="workout-section">
                        <h3 class="text-xl font-semibold text-blue-600 mb-4">Cool-Down</h3>
                        <div class="space-y-3">${formatSection(section)}</div>
                    </div>`;
            } else if (section.toUpperCase().includes('TIPS')) {
                formattedHTML += `
                    <div class="tips-section">
                        <h3 class="text-xl font-semibold text-blue-600 mb-4">Tips & Precautions</h3>
                        <div class="space-y-3">${formatSection(section)}</div>
                    </div>`;
            } else {
                formattedHTML += `
                    <div class="workout-section">
                        <div class="space-y-3">${formatSection(section)}</div>
                    </div>`;
            }
        }
    });

    result.innerHTML = formattedHTML;
}

function formatSection(section) {
    // Remove the section header if it exists
    const lines = section.split('\n').filter(line => line.trim());
    const headerIndex = lines.findIndex(line => 
        line.toUpperCase().includes('WARM-UP') || 
        line.toUpperCase().includes('MAIN WORKOUT') || 
        line.toUpperCase().includes('COOL-DOWN') || 
        line.toUpperCase().includes('TIPS')
    );
    
    if (headerIndex !== -1) {
        lines.splice(headerIndex, 1);
    }

    // Format each line
    return lines.map(line => {
        if (line.trim().startsWith('-') || line.trim().startsWith('•') || line.match(/^\d+\./)) {
            const cleanLine = line.trim().replace(/^[-•\d]+\.?\s*/, '');
            return `
                <div class="exercise-item">
                    <i class="fas fa-dumbbell"></i>
                    <div>${cleanLine}</div>
                </div>`;
        }
        return `<div class="text-gray-700">${line}</div>`;
    }).join('');
}

function closePopup() {
    document.getElementById('workoutPopup').classList.add('hidden');
    document.getElementById('workoutPopup').classList.remove('flex');
}

// Global functions for HTML
window.closePopup = closePopup;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('GymPT application loaded successfully!');
    
    // Initialize chat functionality
    initializeChat();
    
    // Initialize workout functionality
    initializeWorkout();
    
    // Close popup when clicking outside
    window.addEventListener('click', function(event) {
        const popup = document.getElementById('workoutPopup');
        if (event.target === popup) {
            closePopup();
        }
    });
}); 