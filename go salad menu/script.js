// script.js

// Salad Builder Data with Philippine Peso Pricing
const saladIngredients = {
    bases: [
        { id: 1, name: "Mixed Greens", price: 0, calories: 15, protein: 1, carbs: 3, fat: 0, fiber: 2, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" },
        { id: 2, name: "Spinach", price: 0, calories: 10, protein: 1, carbs: 2, fat: 0, fiber: 1, image: "https://images.unsplash.com/photo-1570197784943-5d2b71f2d2b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 3, name: "Kale", price: 0, calories: 20, protein: 2, carbs: 4, fat: 0, fiber: 2, image: "https://images.unsplash.com/photo-1610832958506-aa0115d2c0a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 4, name: "Romaine", price: 0, calories: 10, protein: 1, carbs: 2, fat: 0, fiber: 1, image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 5, name: "Arugula", price: 15, calories: 10, protein: 1, carbs: 2, fat: 0, fiber: 1, image: "https://images.unsplash.com/photo-1598965675045-45d0c457a3f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=772&q=80" }
    ],
    proteins: [
        { id: 1, name: "Grilled Chicken", price: 65, calories: 180, protein: 35, carbs: 0, fat: 4, fiber: 0, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 2, name: "Salmon", price: 85, calories: 220, protein: 25, carbs: 0, fat: 13, fiber: 0, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 3, name: "Tofu", price: 45, calories: 120, protein: 15, carbs: 3, fat: 6, fiber: 1, image: "https://images.unsplash.com/photo-1623278845422-2c5b1c30f293?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 4, name: "Chickpeas", price: 35, calories: 140, protein: 7, carbs: 25, fat: 2, fiber: 7, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" },
        { id: 5, name: "Hard-Boiled Eggs", price: 30, calories: 140, protein: 12, carbs: 1, fat: 10, fiber: 0, image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" }
    ],
    vegetables: [
        { id: 1, name: "Cucumber", price: 15, calories: 15, protein: 1, carbs: 3, fat: 0, fiber: 1, image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" },
        { id: 2, name: "Tomatoes", price: 20, calories: 20, protein: 1, carbs: 4, fat: 0, fiber: 1, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" },
        { id: 3, name: "Bell Peppers", price: 25, calories: 25, protein: 1, carbs: 6, fat: 0, fiber: 2, image: "https://images.unsplash.com/photo-1525607551107-68e20c75b1a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 4, name: "Carrots", price: 15, calories: 25, protein: 1, carbs: 6, fat: 0, fiber: 2, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 5, name: "Broccoli", price: 20, calories: 30, protein: 2, carbs: 6, fat: 0, fiber: 2, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 6, name: "Red Onion", price: 12, calories: 15, protein: 0, carbs: 4, fat: 0, fiber: 1, image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" }
    ],
    fruits: [
        { id: 1, name: "Apple Slices", price: 25, calories: 50, protein: 0, carbs: 13, fat: 0, fiber: 2, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" },
        { id: 2, name: "Berries Mix", price: 40, calories: 40, protein: 1, carbs: 10, fat: 0, fiber: 3, image: "https://images.unsplash.com/photo-1487376480913-24046456a727?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" },
        { id: 3, name: "Orange Segments", price: 30, calories: 45, protein: 1, carbs: 11, fat: 0, fiber: 2, image: "https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 4, name: "Pomegranate", price: 35, calories: 35, protein: 1, carbs: 9, fat: 0, fiber: 1, image: "https://images.unsplash.com/photo-1541344999736-9d5c0b118d56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" }
    ],
    toppings: [
        { id: 1, name: "Almonds", price: 25, calories: 80, protein: 3, carbs: 3, fat: 7, fiber: 2, image: "https://images.unsplash.com/photo-1587135353225-31431439ca58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 2, name: "Sunflower Seeds", price: 15, calories: 60, protein: 2, carbs: 2, fat: 5, fiber: 1, image: "https://images.unsplash.com/photo-1603051998735-33d258ec7f0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 3, name: "Feta Cheese", price: 30, calories: 75, protein: 4, carbs: 1, fat: 6, fiber: 0, image: "https://images.unsplash.com/photo-1593369198311-6d7847e5bdb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" },
        { id: 4, name: "Croutons", price: 15, calories: 60, protein: 2, carbs: 10, fat: 2, fiber: 1, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" },
        { id: 5, name: "Avocado", price: 40, calories: 120, protein: 1, carbs: 6, fat: 11, fiber: 5, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" }
    ],
    dressings: [
        { id: 1, name: "Lemon Herb Vinaigrette", price: 0, calories: 45, protein: 0, carbs: 2, fat: 4, fiber: 0, image: "https://images.unsplash.com/photo-1606913079621-e64bd28622ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 2, name: "Balsamic Glaze", price: 0, calories: 35, protein: 0, carbs: 8, fat: 0, fiber: 0, image: "https://images.unsplash.com/photo-1603538524611-ba9c2e673e37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 3, name: "Greek Yogurt Ranch", price: 10, calories: 60, protein: 2, carbs: 3, fat: 5, fiber: 0, image: "https://images.unsplash.com/photo-1603539948398-4f0db1e0b2c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
        { id: 4, name: "Tahini Dressing", price: 10, calories: 70, protein: 2, carbs: 3, fat: 6, fiber: 1, image: "https://images.unsplash.com/photo-1603539309395-4c4c1c5c9c1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" }
    ]
};

// Pre-made salad images
const premadeSaladImages = {
    "mediterranean-salad": "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    "protein-bowl": "https://hips.hearstapps.com/hmg-prod/images/peanut-chicken-protein-bowl-lead-660719749b265.jpg?crop=1xw:0.9995860927152318xh;center,top&resize=1800:*",
    "asian-crunch": "https://lightlife.com/wp-content/uploads/2024/06/2413_TempehfyBook_33_AsianCrunchSlaw_R2_JK@2x.jpg",
    "caesar-salad": "https://cdn.loveandlemons.com/wp-content/uploads/2024/12/caesar-salad.jpg"
};

// Initialize currentSalad globally at the very start
window.currentSalad = {
    bases: [], // allow multiple
    proteins: [], // allow multiple
    vegetables: [],
    fruits: [],
    toppings: [],
    dressings: [] // allow multiple
};

console.log('[Script] window.currentSalad initialized:', window.currentSalad);

// Current salad state
let currentSalad = {
    base: saladIngredients.bases[0], // Default to mixed greens
    protein: null,
    vegetables: [],
    fruits: [],
    toppings: [],
    dressing: null
};

let currentStep = 1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMenuImages();
    initializeMenuFilters();
    initializeSaladBuilder();
    initializeCart();
    setupEventListeners();
    renderCustomerMenuFromDatabase();
});

// Set background images for pre-made salads
function initializeMenuImages() {
    const menuItems = document.querySelectorAll('.menu-item-img');
    menuItems.forEach(item => {
        const className = item.className.split(' ')[1];
        if (premadeSaladImages[className]) {
            item.style.backgroundImage = `url('${premadeSaladImages[className]}')`;
        }
    });
}

// Set background images for builder options
function setBuilderOptionImages() {
    // Set base images
    const baseOptions = document.querySelectorAll('#base-options .option-img');
    baseOptions.forEach((option, index) => {
        if (saladIngredients.bases[index]) {
            option.style.backgroundImage = `url('${saladIngredients.bases[index].image}')`;
        }
    });

    // Set protein images
    const proteinOptions = document.querySelectorAll('#protein-options .option-img');
    proteinOptions.forEach((option, index) => {
        if (saladIngredients.proteins[index]) {
            option.style.backgroundImage = `url('${saladIngredients.proteins[index].image}')`;
        }
    });

    // Set vegetable images
    const vegetableOptions = document.querySelectorAll('#vegetable-options .option-img');
    vegetableOptions.forEach((option, index) => {
        if (saladIngredients.vegetables[index]) {
            option.style.backgroundImage = `url('${saladIngredients.vegetables[index].image}')`;
        }
    });

    // Set fruit images
    const fruitOptions = document.querySelectorAll('#fruit-options .option-img');
    fruitOptions.forEach((option, index) => {
        if (saladIngredients.fruits[index]) {
            option.style.backgroundImage = `url('${saladIngredients.fruits[index].image}')`;
        }
    });

    // Set topping images
    const toppingOptions = document.querySelectorAll('#topping-options .option-img');
    toppingOptions.forEach((option, index) => {
        if (saladIngredients.toppings[index]) {
            option.style.backgroundImage = `url('${saladIngredients.toppings[index].image}')`;
        }
    });

    // Set dressing images
    const dressingOptions = document.querySelectorAll('#dressing-options .option-img');
    dressingOptions.forEach((option, index) => {
        if (saladIngredients.dressings[index]) {
            option.style.backgroundImage = `url('${saladIngredients.dressings[index].image}')`;
        }
    });
}

// Menu filtering functionality
function initializeMenuFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterMenuItems(this.textContent);
        });
    });
}

function filterMenuItems(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (category === 'All Salads') {
            item.style.display = 'block';
        } else {
            const tags = item.querySelectorAll('.tag');
            let hasCategory = false;
            
            tags.forEach(tag => {
                if (tag.textContent === category) {
                    hasCategory = true;
                }
            });
            
            item.style.display = hasCategory ? 'block' : 'none';
        }
    });
}

// Salad builder functionality
function initializeSaladBuilder() {
    setBuilderOptionImages();
    setupStepNavigation();
    setupIngredientSelection();
    showStep(1);
}

function setupStepNavigation() {
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const stepElements = document.querySelectorAll('.builder-step');
    
    // Step click handlers
    stepElements.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.getAttribute('data-step'));
            if (stepNumber <= currentStep) {
                showStep(stepNumber);
            }
        });
    });
    
    // Previous button
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });
    
    // Next button
    nextBtn.addEventListener('click', function() {
        if (validateCurrentStep()) {
            if (currentStep < 7) {
                showStep(currentStep + 1);
            } else {
                completeOrder();
            }
        }
    });
}

function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            if (!currentSalad.base) {
                window.showModalNotification('Please select a base for your salad');
                return false;
            }
            break;
        case 2:
            if (!currentSalad.protein) {
                window.showModalNotification('Please select a protein for your salad');
                return false;
            }
            break;
        case 6:
            if (!currentSalad.dressing) {
                window.showModalNotification('Please select a dressing for your salad');
                return false;
            }
            break;
    }
    return true;
}

function showStep(stepNumber) {
    // Hide all step contents
    document.querySelectorAll('.builder-step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show current step content
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.builder-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.builder-step[data-step="${stepNumber}"]`).classList.add('active');
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    
    prevBtn.disabled = stepNumber === 1;
    
    if (stepNumber === 7) {
        nextBtn.textContent = 'Complete Order';
        updateReviewSummary();
        updateNutritionSummary();
    } else {
        const nextStepNames = {
            1: 'Select Protein',
            2: 'Add Veggies',
            3: 'Pick Fruits',
            4: 'Toppings & Extras',
            5: 'Select Dressing',
            6: 'Review'
        };
        nextBtn.textContent = `Next: ${nextStepNames[stepNumber]}`;
    }
    
    currentStep = stepNumber;
}

function setupIngredientSelection() {
    // Delegate event handling for ingredient selection
    document.querySelector('.builder-body').addEventListener('click', function(e) {
        const option = e.target.closest('.builder-option');
        if (!option) return;
        
        const type = option.getAttribute('data-type');
        const id = parseInt(option.getAttribute('data-id'));
        
        selectIngredient(type, id, option);
    });
}

function selectIngredient(type, id, optionElement) {
    const ingredient = getIngredientById(type, id);
    
    if (!ingredient) return;
    
    switch(type) {
        case 'base':
            // Only one base can be selected
            document.querySelectorAll('#base-options .builder-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            optionElement.classList.add('selected');
            currentSalad.base = ingredient;
            updateSummary('base', ingredient.name);
            break;
            
        case 'protein':
            // Only one protein can be selected
            document.querySelectorAll('#protein-options .builder-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            optionElement.classList.add('selected');
            currentSalad.protein = ingredient;
            updateSummary('protein', ingredient.name);
            break;
            
        case 'vegetable':
            // Toggle vegetable selection (max 5)
            if (optionElement.classList.contains('selected')) {
                optionElement.classList.remove('selected');
                currentSalad.vegetables = currentSalad.vegetables.filter(v => v.id !== id);
            } else if (currentSalad.vegetables.length < 5) {
                optionElement.classList.add('selected');
                currentSalad.vegetables.push(ingredient);
            } else {
                window.showModalNotification('Maximum 5 vegetables allowed');
                return;
            }
            updateSummary('veggies', currentSalad.vegetables.map(v => v.name).join(', ') || 'Not selected');
            break;
            
        case 'fruit':
            // Toggle fruit selection (max 3)
            if (optionElement.classList.contains('selected')) {
                optionElement.classList.remove('selected');
                currentSalad.fruits = currentSalad.fruits.filter(f => f.id !== id);
            } else if (currentSalad.fruits.length < 3) {
                optionElement.classList.add('selected');
                currentSalad.fruits.push(ingredient);
            } else {
                window.showModalNotification('Maximum 3 fruits allowed');
                return;
            }
            updateSummary('fruits', currentSalad.fruits.map(f => f.name).join(', ') || 'Not selected');
            break;
            
        case 'topping':
            // Toggle topping selection (max 3)
            if (optionElement.classList.contains('selected')) {
                optionElement.classList.remove('selected');
                currentSalad.toppings = currentSalad.toppings.filter(t => t.id !== id);
            } else if (currentSalad.toppings.length < 3) {
                optionElement.classList.add('selected');
                currentSalad.toppings.push(ingredient);
            } else {
                window.showModalNotification('Maximum 3 toppings allowed');
                return;
            }
            updateSummary('toppings', currentSalad.toppings.map(t => t.name).join(', ') || 'Not selected');
            break;
            
        case 'dressing':
            // Only one dressing can be selected
            document.querySelectorAll('#dressing-options .builder-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            optionElement.classList.add('selected');
            currentSalad.dressing = ingredient;
            updateSummary('dressing', ingredient.name);
            break;
    }
    
    // Keep both references in sync (some code paths use `currentSalad`, others use `window.currentSalad`)
    try {
        // prefer the window object if present
        if (typeof window !== 'undefined') {
            if (window.currentSalad && Object.keys(window.currentSalad).length > 0) {
                currentSalad = window.currentSalad;
            } else {
                window.currentSalad = currentSalad;
            }
        }
    } catch (e) {
        // ignore
    }

    updateTotalPrice();
    updateNutritionSummary();

    // Auto-advance flow: if the user is on the base step and selected at least one base, move to protein.
    // Similarly advance from protein -> vegetables to keep the builder flow smooth.
    try {
        if (typeof currentStep !== 'undefined') {
            if (type === 'base' && currentStep === 1 && window.currentSalad.bases && window.currentSalad.bases.length > 0) {
                showStep(2);
            }
            if (type === 'protein' && currentStep === 2 && window.currentSalad.proteins && window.currentSalad.proteins.length > 0) {
                showStep(3);
            }
        }
    } catch (e) {
        // ignore
    }
}

function getIngredientById(type, id) {
    switch(type) {
        case 'base': return saladIngredients.bases.find(b => b.id === id);
        case 'protein': return saladIngredients.proteins.find(p => p.id === id);
        case 'vegetable': return saladIngredients.vegetables.find(v => v.id === id);
        case 'fruit': return saladIngredients.fruits.find(f => f.id === id);
        case 'topping': return saladIngredients.toppings.find(t => t.id === id);
        case 'dressing': return saladIngredients.dressings.find(d => d.id === id);
        default: return null;
    }
}

function updateSummary(type, value) {
    document.getElementById(`summary-${type}`).textContent = value;
}

function updateTotalPrice() {
    let total = 70; // Base price for custom salad
    
    // Add ingredient prices
    if (currentSalad.base && currentSalad.base.price) total += currentSalad.base.price;
    if (currentSalad.protein) total += currentSalad.protein.price;
    currentSalad.vegetables.forEach(v => total += v.price);
    currentSalad.fruits.forEach(f => total += f.price);
    currentSalad.toppings.forEach(t => total += t.price);
    if (currentSalad.dressing && currentSalad.dressing.price) total += currentSalad.dressing.price;
    
    document.getElementById('summary-total').textContent = total;
    document.getElementById('custom-salad-price').textContent = total;
}

function updateReviewSummary() {
    document.getElementById('review-base').textContent = currentSalad.base ? currentSalad.base.name : 'Not selected';
    document.getElementById('review-protein').textContent = currentSalad.protein ? currentSalad.protein.name : 'Not selected';
    document.getElementById('review-veggies').textContent = currentSalad.vegetables.length > 0 ? 
        currentSalad.vegetables.map(v => v.name).join(', ') : 'Not selected';
    document.getElementById('review-fruits').textContent = currentSalad.fruits.length > 0 ? 
        currentSalad.fruits.map(f => f.name).join(', ') : 'Not selected';
    document.getElementById('review-toppings').textContent = currentSalad.toppings.length > 0 ? 
        currentSalad.toppings.map(t => t.name).join(', ') : 'Not selected';
    document.getElementById('review-dressing').textContent = currentSalad.dressing ? currentSalad.dressing.name : 'Not selected';
}

function updateNutritionSummary() {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;
    
    // Base nutrition
    if (currentSalad.base) {
        calories += currentSalad.base.calories;
        protein += currentSalad.base.protein;
        carbs += currentSalad.base.carbs;
        fat += currentSalad.base.fat;
        fiber += currentSalad.base.fiber;
    }
    
    // Protein nutrition
    if (currentSalad.protein) {
        calories += currentSalad.protein.calories;
        protein += currentSalad.protein.protein;
        carbs += currentSalad.protein.carbs;
        fat += currentSalad.protein.fat;
        fiber += currentSalad.protein.fiber;
    }
    
    // Vegetables nutrition
    currentSalad.vegetables.forEach(v => {
        calories += v.calories;
        protein += v.protein;
        carbs += v.carbs;
        fat += v.fat;
        fiber += v.fiber;
    });
    
    // Fruits nutrition
    currentSalad.fruits.forEach(f => {
        calories += f.calories;
        protein += f.protein;
        carbs += f.carbs;
        fat += f.fat;
        fiber += f.fiber;
    });
    
    // Toppings nutrition
    currentSalad.toppings.forEach(t => {
        calories += t.calories;
        protein += t.protein;
        carbs += t.carbs;
        fat += t.fat;
        fiber += t.fiber;
    });
    
    // Dressing nutrition
    if (currentSalad.dressing) {
        calories += currentSalad.dressing.calories;
        protein += currentSalad.dressing.protein;
        carbs += currentSalad.dressing.carbs;
        fat += currentSalad.dressing.fat;
        fiber += currentSalad.dressing.fiber;
    }
    
    document.getElementById('nutrition-calories').textContent = calories;
    document.getElementById('nutrition-protein').textContent = `${protein}g`;
    document.getElementById('nutrition-carbs').textContent = `${carbs}g`;
    document.getElementById('nutrition-fat').textContent = `${fat}g`;
    document.getElementById('nutrition-fiber').textContent = `${fiber}g`;
}

// Cart functionality
function initializeCart() {
    // If a CartManager is available, it will handle add-to-cart events (prevents duplicate adds)
    if (window.cartManager) {
        return;
    }

    // Legacy: Add to cart buttons for pre-made salads (only when CartManager not present)
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(id, name, price, 'premade');
        });
    });
    
    // Legacy: Add to cart for custom salad
    const addCustomBtnLegacy = document.getElementById('add-custom-to-cart');
    if (addCustomBtnLegacy) {
        addCustomBtnLegacy.addEventListener('click', function() {
            // Validate that at least a base is selected
            if (!currentSalad.base) {
                window.showModalNotification('Please select at least a base for your salad');
                showStep(1);
                return;
            }
            
            const price = parseFloat(document.getElementById('custom-salad-price').textContent);
            addToCart('custom', 'Custom Salad', price, 'custom');
        });
    }
}

function addToCart(id, name, price, type) {
    // In a real app, this would add to a cart object and update UI
    const cartCount = document.querySelector('.cart-count');
    let count = parseInt(cartCount.textContent);
    count++;
    cartCount.textContent = count;
    
    // Show confirmation using site modal when available
    const message = `Added ${name} to cart! Total: ₱${price}`;
    if (typeof window.showCartNotification === 'function') {
        window.showCartNotification(message);
    } else {
        window.showModalNotification(message);
    }
    
    // Reset custom salad builder if it was a custom salad
    if (type === 'custom') {
        resetSaladBuilder();
    }
}

function resetSaladBuilder() {
    // Reset to default base (mixed greens)
    document.querySelectorAll('.builder-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Select the default base
    const defaultBase = document.querySelector('#base-options .builder-option[data-id="1"]');
    if (defaultBase) {
        defaultBase.classList.add('selected');
    }
    
    currentSalad = {
        base: saladIngredients.bases[0],
        protein: null,
        vegetables: [],
        fruits: [],
        toppings: [],
        dressing: null
    };
    // Keep window.currentSalad in sync with the legacy currentSalad variable
    try {
        window.currentSalad = currentSalad;
    } catch (e) {}
    
    // Reset summaries
    updateSummary('base', 'Mixed Greens');
    updateSummary('protein', 'Not selected');
    updateSummary('veggies', 'Not selected');
    updateSummary('fruits', 'Not selected');
    updateSummary('toppings', 'Not selected');
    updateSummary('dressing', 'Not selected');
    
    // Reset price and nutrition
    updateTotalPrice();
    updateNutritionSummary();
    
    // Go back to first step
    showStep(1);
}

function completeOrder() {
    window.showModalNotification('Thank you for your order! Your custom salad has been added to cart.');
    addToCart('custom', 'Custom Salad', parseFloat(document.getElementById('custom-salad-price').textContent), 'custom');
}

// Additional event listeners
function setupEventListeners() {
    // Hero CTA button
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function() {
            document.getElementById('builder').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Navigation smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Subscribe form
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                window.showModalNotification(`Thank you for subscribing with ${email}! You'll receive our latest updates.`);
                this.reset();
            }
        });
    }
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saladIngredients,
        premadeSaladImages,
        initializeMenuImages,
        initializeMenuFilters,
        initializeSaladBuilder,
        initializeCart
    };
}

// Check authentication status and update UI
document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.getElementById('authButton');
    const currentUser = JSON.parse(localStorage.getItem('freshgreens_current_user'));
    
    if (currentUser) {
        // User is logged in
        authButton.textContent = 'My Account';
        authButton.onclick = function() {
            window.location.href = 'account.html';
        };
    } else {
        // User is not logged in
        authButton.textContent = 'Sign In';
        authButton.onclick = function() {
            window.location.href = 'login.html';
        };
    }
});

// Add to the existing script.js file

// Initialize database and cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    if (typeof freshGreensDB === 'undefined') {
        console.error('Database not loaded. Make sure database.js is included.');
    }

    // Initialize cart manager
    if (typeof CartManager !== 'undefined') {
        window.cartManager = new CartManager();
    }

    // Update existing functionality to use database
    updateMenuWithDatabase();
    updateSaladBuilderWithDatabase();

    // If a CartManager exists ensure the Add Custom Salad button calls into it (avoids fallback-only behavior)
    try {
        const addCustomBtn = document.getElementById('add-custom-to-cart');
        if (addCustomBtn && window.cartManager && typeof window.cartManager.handleAddCustomSalad === 'function') {
            // remove any existing listeners to avoid duplicates
            addCustomBtn.replaceWith(addCustomBtn.cloneNode(true));
            const newBtn = document.getElementById('add-custom-to-cart');
            if (newBtn) {
                newBtn.addEventListener('click', function() {
                    window.cartManager.handleAddCustomSalad();
                });
            }
        }
    } catch (e) {
        // ignore errors
    }
});

function updateMenuWithDatabase() {
    // Use database products instead of hardcoded ones
    const salads = freshGreensDB.getPremadeSalads();
    
    // Update menu items if they exist
    const menuGrid = document.querySelector('.menu-grid');
    if (menuGrid) {
        // You can dynamically generate menu items from database
        // or keep the existing HTML and update prices/availability
    }
}

function updateSaladBuilderWithDatabase() {
    // Use database ingredients in the salad builder
    const ingredients = freshGreensDB.getIngredients();
    
    // Update the builder options with database ingredients
    // This would replace the hardcoded ingredient arrays
}

// Custom Salad Builder - Enhanced with Cart Integration

// Make currentSalad globally accessible
window.currentSalad = {
    bases: [], // allow multiple
    proteins: [], // allow multiple
    vegetables: [],
    fruits: [],
    toppings: [],
    dressings: [] // allow multiple
};

// Keep the older `currentSalad` reference in sync (some functions use one or the other)
try {
    if (typeof currentSalad !== 'undefined') {
        currentSalad = window.currentSalad;
    }
} catch (e) {
    // ignore
}

// Initialize salad builder with database ingredients
function initializeSaladBuilder() {
    // Populate all ingredient options from database
    populateIngredientOptions();
    
    // Set up step navigation
    setupStepNavigation();
    
    // Set up ingredient selection
    setupIngredientSelection();
    
    // Initialize the first step
    showStep(1);
}

function populateIngredientOptions() {
    const ingredients = freshGreensDB.getIngredients();
    
    // Populate bases
    const baseOptions = document.querySelector('#step-1 .builder-options');
    baseOptions.innerHTML = ingredients.bases.map(base => `
        <div class="builder-option" data-id="${base.id}" data-type="base">
            <div class="option-img" style="background-image: url('${getIngredientImage(base.name)}')"></div>
            <div class="option-name">${base.name}</div>
            <div class="option-details">${base.price > 0 ? `+₱${base.price}` : 'Included'}</div>
        </div>
    `).join('');
    
    // Populate proteins
    const proteinOptions = document.querySelector('#step-2 .builder-options');
    proteinOptions.innerHTML = ingredients.proteins.map(protein => `
        <div class="builder-option" data-id="${protein.id}" data-type="protein">
            <div class="option-img" style="background-image: url('${getIngredientImage(protein.name)}')"></div>
            <div class="option-name">${protein.name}</div>
            <div class="option-details">+₱${protein.price}</div>
        </div>
    `).join('');
    
    // Populate vegetables
    const veggieOptions = document.querySelector('#step-3 .builder-options');
    veggieOptions.innerHTML = ingredients.vegetables.map(veggie => `
        <div class="builder-option" data-id="${veggie.id}" data-type="vegetable">
            <div class="option-img" style="background-image: url('${getIngredientImage(veggie.name)}')"></div>
            <div class="option-name">${veggie.name}</div>
            <div class="option-details">+₱${veggie.price}</div>
        </div>
    `).join('');
    
    // Populate fruits
    const fruitOptions = document.querySelector('#step-4 .builder-options');
    fruitOptions.innerHTML = ingredients.fruits.map(fruit => `
        <div class="builder-option" data-id="${fruit.id}" data-type="fruit">
            <div class="option-img" style="background-image: url('${getIngredientImage(fruit.name)}')"></div>
            <div class="option-name">${fruit.name}</div>
            <div class="option-details">+₱${fruit.price}</div>
        </div>
    `).join('');
    
    // Populate toppings
    const toppingOptions = document.querySelector('#step-5 .builder-options');
    toppingOptions.innerHTML = ingredients.toppings.map(topping => `
        <div class="builder-option" data-id="${topping.id}" data-type="topping">
            <div class="option-img" style="background-image: url('${getIngredientImage(topping.name)}')"></div>
            <div class="option-name">${topping.name}</div>
            <div class="option-details">+₱${topping.price}</div>
        </div>
    `).join('');
    
    // Populate dressings
    const dressingOptions = document.querySelector('#step-6 .builder-options');
    dressingOptions.innerHTML = ingredients.dressings.map(dressing => `
        <div class="builder-option" data-id="${dressing.id}" data-type="dressing">
            <div class="option-img" style="background-image: url('${getIngredientImage(dressing.name)}')"></div>
            <div class="option-name">${dressing.name}</div>
            <div class="option-details">${dressing.price > 0 ? `+₱${dressing.price}` : 'Included'}</div>
        </div>
    `).join('');
}

function getIngredientImage(ingredientName) {
    // Map ingredient names to images
    const imageMap = {
        // Bases
        'Mixed Greens': 'https://cdn.loveandlemons.com/wp-content/uploads/2021/04/green-salad-1-740x1024.jpg',
        'Spinach': 'https://veggieharvest.com/wp-content/uploads/2020/11/spinach-1170x780.jpg',
        'Kale': 'https://cdn.britannica.com/74/181374-050-83F7B492/kale-leaves.jpg',
        'Romaine': 'https://www.taylorfarms.com/wp-content/uploads/2023/10/Romaine-Leaves.jpg',
        'Arugula': 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2023/10/4/fresh-arugula-in-light-wooden-bowl-on-rustic-background.jpg.rend.hgtvcom.1280.853.85.suffix/1696427623187.webp',
        
        // Proteins
        'Grilled Chicken': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
        'Salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
        'Tofu': 'https://sweetsimplevegan.com/wp-content/uploads/2020/09/Easy-Crispy-Baked-Tofu-Recipe-Sweet-Simple-Vegan-6.jpg',
        'Chickpeas': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
        'Hard-Boiled Eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        
        // Vegetables
        'Cucumber': 'https://snaped.fns.usda.gov/sites/default/files/styles/crop_ratio_7_5/public/seasonal-produce/2018-05/cucumbers2.jpg.webp?itok=Y2CZseBE',
        'Tomatoes': 'https://cdn.prod.website-files.com/60805a0f5f83cfc3688b8d9f/630e070d0c22d91d0d44982e_cherry-tomato-p-1600.jpg',
        'Bell Peppers': 'https://thenaturalnurturer.com/wp-content/uploads/2023/04/Sauteed-Bell-Peppers-33.jpg',
        'Red Onion': 'https://assets.bonappetit.com/photos/6099896ca2e3fb8858d712dd/1:1/w_1920,c_limit/Basically_alliums_pickle.jpg',
        'Carrots': 'https://www.allrecipes.com/thmb/ikpFtPB4bhgZ7j2l-3Tem2yzdH8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/229669-glazed-carrots-DDMFS-4x3-151-83cd27fa77bd459a8aad877174f1db8f.jpg',    
        'Broccoli': 'https://frommichigantothetable.com/wp-content/uploads/2023/02/IMG_8252-scaled-735x980.jpg',
        // Fruits
        'Pomegranate': 'https://healthyfamilyproject.com/wp-content/uploads/2020/05/Pomegranate-background.jpg.webp',
        'Orange Segments': 'https://www.dessarts.com/wp-content/uploads/2020/01/How-to-Cut-Orange_720px_3-720x720.jpg',
        'Berries Mix': 'https://ncrshop.connoisseurs.co.in/cdn/shop/products/img1_1024x1024@2x.jpg?v=1612263537',
        'Apple Slices': 'https://www.simplyrecipes.com/thmb/Ju2xz8GG7CeavUSWW1iVjtZmsts=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-How-To-Slice-Apples-LEAD-1-194303ec6fe84378ba8825768ffe02f2.jpg',   

        // Toppings
        'Feta Cheese': 'https://cheesemaking.com/cdn/shop/products/feta-cheese-making-recipe-442412.jpg?v=1744671773&width=800',
        'Croutons': 'https://iambaker.net/wp-content/uploads/2018/10/croutons-1.jpg',
        'Sunflower Seeds': 'https://www.eatingwell.com/thmb/q5Ej3AulH6iP3wDG60BOJ8Xanhg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/sunflower-seeds-square-a86a13fc532d4947a9ee580a97c77285.jpg',
        'Avocado': 'https://www.darta.com/sites/default/files/styles/category_tab_image/public/product-images/8294XX99.png?itok=fh_BkOgE',
        'Almonds': 'https://www.health.com/thmb/xklPFBrlPpwcHND_ov5EZwLHAwc=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc()/almonds-GettyImages-683814187-2000-44a06e730fac4c60a10cbb5f9642b589.jpg',

        // Dressings
        'Lemon Herb Vinaigrette': 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/4/4/0/LS-Library_Herb-Vinaigrette_s4x3.jpg.rend.hgtvcom.1280.720.suffix/1522778706376.webp',
        'Balsamic Glaze': 'https://foxeslovelemons.com/wp-content/uploads/2022/04/Balsamic-Glaze-Recipe-5.jpg',
        'Greek Yogurt Ranch': 'https://dashfordinner.com/wp-content/uploads/2024/09/greekyogurtranch.jpg',
        'Tahini Dressing': 'https://www.forkintheroad.co/wp-content/uploads/2023/11/miso-tahini-dressing-125.jpg',
        // Default image for missing ingredients
        'default': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    };
    
    return imageMap[ingredientName] || imageMap['default'];
}

function selectIngredient(type, id, optionElement) {
    const ingredients = freshGreensDB.getIngredients();
    let ingredient = null;
    let max = 1;
    switch(type) {
        case 'base':
            ingredient = ingredients.bases.find(b => b.id === id);
            max = 2;
            break;
        case 'protein':
            ingredient = ingredients.proteins.find(p => p.id === id);
            max = 2;
            break;
        case 'vegetable':
            ingredient = ingredients.vegetables.find(v => v.id === id);
            max = 5;
            break;
        case 'fruit':
            ingredient = ingredients.fruits.find(f => f.id === id);
            max = 3;
            break;
        case 'topping':
            ingredient = ingredients.toppings.find(t => t.id === id);
            max = 3;
            break;
        case 'dressing':
            ingredient = ingredients.dressings.find(d => d.id === id);
            max = 2;
            break;
    }
    if (!ingredient) return;

    // Multi-select logic for all categories
    let arrName = type + (type.endsWith('s') ? '' : 's');
    if (['base','protein','dressing'].includes(type)) arrName = type + 's';
    let arr = window.currentSalad[arrName];
    if (!arr) arr = window.currentSalad[arrName] = [];

    if (optionElement.classList.contains('selected')) {
        optionElement.classList.remove('selected');
        window.currentSalad[arrName] = arr.filter(i => i.id !== id);
    } else if (arr.length < max) {
        optionElement.classList.add('selected');
        window.currentSalad[arrName].push(ingredient);
    } else {
        window.showModalNotification(`Maximum ${max} ${type}${max>1?'s':''} allowed`);
        return;
    }

    // Update summary
    if (type === 'base') updateSummary('base', window.currentSalad.bases.map(b=>b.name).join(', ') || 'Not selected');
    if (type === 'protein') updateSummary('protein', window.currentSalad.proteins.map(p=>p.name).join(', ') || 'Not selected');
    if (type === 'vegetable') updateSummary('veggies', window.currentSalad.vegetables.map(v=>v.name).join(', ') || 'Not selected');
    if (type === 'fruit') updateSummary('fruits', window.currentSalad.fruits.map(f=>f.name).join(', ') || 'Not selected');
    if (type === 'topping') updateSummary('toppings', window.currentSalad.toppings.map(t=>t.name).join(', ') || 'Not selected');
    if (type === 'dressing') updateSummary('dressing', window.currentSalad.dressings.map(d=>d.name).join(', ') || 'Not selected');

    // Keep legacy single-select `currentSalad` in sync for other code paths that still use it
    try {
        if (typeof currentSalad !== 'undefined') {
            currentSalad.base = (window.currentSalad.bases && window.currentSalad.bases.length) ? window.currentSalad.bases[0] : null;
            currentSalad.protein = (window.currentSalad.proteins && window.currentSalad.proteins.length) ? window.currentSalad.proteins[0] : null;
            currentSalad.dressing = (window.currentSalad.dressings && window.currentSalad.dressings.length) ? window.currentSalad.dressings[0] : null;
        }
    } catch (e) {
        // ignore
    }

    updateTotalPrice();
    updateNutritionSummary();

    // Auto-advance flow: if the user is on the base step and selected at least one base, move to protein.
    // Similarly advance from protein -> vegetables to keep the builder flow smooth.
    try {
        if (typeof currentStep !== 'undefined') {
            if (type === 'base' && currentStep === 1 && window.currentSalad.bases && window.currentSalad.bases.length > 0) {
                showStep(2);
            }
            if (type === 'protein' && currentStep === 2 && window.currentSalad.proteins && window.currentSalad.proteins.length > 0) {
                showStep(3);
            }
        }
    } catch (e) {
        // ignore
    }
}

// Enhanced add custom salad to cart function
function addCustomSaladToCart() {
    console.log('[Script] addCustomSaladToCart called, window.currentSalad=', window.currentSalad);
    
    // Validate that at least one base and one protein is selected
    if (!window.currentSalad || !window.currentSalad.bases || !window.currentSalad.bases.length) {
        return;
    }
    if (!window.currentSalad.proteins || !window.currentSalad.proteins.length) {
        return;
    }

    // Calculate custom salad price
    let price = 70; // Base price for custom salad
    let description = 'Custom salad with: ';

    // Add bases
    if (window.currentSalad.bases && window.currentSalad.bases.length) {
        window.currentSalad.bases.forEach(base => {
            if (base.price) price += base.price;
        });
        description += `Bases: ${window.currentSalad.bases.map(b=>b.name).join(', ')}, `;
    }

    // Add proteins
    if (window.currentSalad.proteins && window.currentSalad.proteins.length) {
        window.currentSalad.proteins.forEach(protein => {
            price += protein.price;
        });
        description += `Proteins: ${window.currentSalad.proteins.map(p=>p.name).join(', ')}, `;
    }

    // Add vegetables
    if (window.currentSalad.vegetables && window.currentSalad.vegetables.length) {
        window.currentSalad.vegetables.forEach(veg => {
            price += veg.price;
        });
        description += `Vegetables: ${window.currentSalad.vegetables.map(v => v.name).join(', ')}, `;
    }

    // Add fruits
    if (window.currentSalad.fruits && window.currentSalad.fruits.length) {
        window.currentSalad.fruits.forEach(fruit => {
            price += fruit.price;
        });
        description += `Fruits: ${window.currentSalad.fruits.map(f => f.name).join(', ')}, `;
    }

    // Add toppings
    if (window.currentSalad.toppings && window.currentSalad.toppings.length) {
        window.currentSalad.toppings.forEach(topping => {
            price += topping.price;
        });
        description += `Toppings: ${window.currentSalad.toppings.map(t => t.name).join(', ')}, `;
    }

    // Add dressings
    if (window.currentSalad.dressings && window.currentSalad.dressings.length) {
        window.currentSalad.dressings.forEach(dressing => {
            if (dressing.price) price += dressing.price;
        });
        description += `Dressings: ${window.currentSalad.dressings.map(d => d.name).join(', ')}`;
    }

    // Remove trailing comma and space
    description = description.replace(/, $/, '');

    const customSalad = {
        id: Date.now(), // Unique ID for custom salad
        name: 'Custom Salad',
        price: price,
        description: description,
        category: 'custom',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    };

    // Prepare customizations object for the cart
    const customizations = {
        bases: window.currentSalad.bases || [],
        proteins: window.currentSalad.proteins || [],
        vegetables: window.currentSalad.vegetables || [],
        fruits: window.currentSalad.fruits || [],
        toppings: window.currentSalad.toppings || [],
        dressings: window.currentSalad.dressings || []
    };

    console.log('[Script] Adding custom salad to cart:', customSalad);

    // Add to cart using the cart manager
    if (window.cartManager) {
        console.log('[Script] CartManager found, adding to cart');
        window.cartManager.addToCart(customSalad, 1, customizations);
        showOrderAddedNotification('Custom Salad');
        resetSaladBuilder();
    } else {
        console.error('[Script] CartManager not available');
        window.showModalNotification('Error: Cart system not available. Please refresh the page.');
    }
}

// Notification function
function showOrderAddedNotification(itemName) {
    const notification = document.createElement('div');
    notification.className = 'order-added-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${itemName} added to cart!</span>
        </div>
    `;

    // Add styles if not already present
    if (!document.querySelector('#order-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'order-notification-styles';
        styles.textContent = `
            .order-added-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
                z-index: 1000;
                animation: slideInRight 0.4s ease;
                font-weight: 500;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-content i {
                font-size: 1.3rem;
                animation: popIn 0.5s ease;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes popIn {
                0% {
                    transform: scale(0);
                }
                50% {
                    transform: scale(1.2);
                }
                100% {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.4s ease reverse';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Make reset function globally accessible
window.resetSaladBuilder = function() {
    window.currentSalad = {
        base: null,
        protein: null,
        vegetables: [],
        fruits: [],
        toppings: [],
        dressing: null
    };
    
    // Reset UI selections
    document.querySelectorAll('.builder-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset summaries
    updateSummary('base', 'Not selected');
    updateSummary('protein', 'Not selected');
    updateSummary('veggies', 'Not selected');
    updateSummary('fruits', 'Not selected');
    updateSummary('toppings', 'Not selected');
    updateSummary('dressing', 'Not selected');
    
    // Reset price and nutrition
    updateTotalPrice();
    updateNutritionSummary();
    
    // Go back to first step
    showStep(1);
};
// Also keep the legacy currentSalad reference updated when window.resetSaladBuilder is used
try {
    if (typeof window.resetSaladBuilder === 'function') {
        const _origReset = window.resetSaladBuilder;
        window.resetSaladBuilder = function() {
            _origReset();
            try { currentSalad = window.currentSalad; } catch (e) {}
        };
    }
} catch (e) {}

// Update the event listener for the custom salad button
document.addEventListener('DOMContentLoaded', function() {
    const addCustomBtn = document.getElementById('add-custom-to-cart');
    if (addCustomBtn) {
        addCustomBtn.addEventListener('click', addCustomSaladToCart);
    }
});

function renderCustomerMenuFromDatabase() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;

    // Load premade salads from database (freshgreens_products) and admin menu overrides (freshgreens_menu)
    let dbPremade = [];
    try {
        if (typeof freshGreensDB !== 'undefined' && freshGreensDB.getPremadeSalads) {
            dbPremade = freshGreensDB.getPremadeSalads() || [];
        } else {
            const stored = JSON.parse(localStorage.getItem('freshgreens_products') || '{}');
            dbPremade = (stored && stored.premade) ? stored.premade : [];
        }
    } catch (e) {
        console.warn('[Script] Error reading freshGreensDB premade salads', e);
        dbPremade = JSON.parse(localStorage.getItem('freshgreens_products') || '{}').premade || [];
    }

    const overrideMenu = JSON.parse(localStorage.getItem('freshgreens_menu')) || [];

    // Merge and dedupe: overrideMenu takes precedence
    const mergedMap = new Map();
    dbPremade.forEach(item => {
        const key = item.id !== undefined ? `id:${item.id}` : `name:${(item.name||'').toLowerCase()}`;
        mergedMap.set(key, item);
    });
    overrideMenu.forEach(item => {
        const key = item.id !== undefined ? `id:${item.id}` : `name:${(item.name||'').toLowerCase()}`;
        mergedMap.set(key, item); // override or add
    });

    const merged = Array.from(mergedMap.values());
    if (merged.length === 0) {
        // No items found — replace existing grid with a friendly placeholder so it's clear
        menuGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--gray); grid-column: 1 / -1;">No premade salads available right now — check back soon or try refreshing the page.</p>';
        console.log('[Script] No premade salads found to render');
        return;
    }

    menuGrid.innerHTML = merged.map(item => `
        <div class="menu-item">
            <div class="menu-item-img" style="background-image:url('${item.image || ''}');"></div>
            <div class="menu-item-content">
                <div class="menu-item-title">
                    <h3>${item.name}</h3>
                    <span class="menu-item-price">₱${item.price}</span>
                </div>
                <p class="menu-item-desc">${item.description || ''}</p>
                <div class="menu-item-tags">
                    ${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="nutrition-info">
                    ${item.nutrition ? `<span class="nutrition-item">${item.nutrition.calories} cal</span>` : ''}
                    ${item.nutrition ? `<span class="nutrition-item">${item.nutrition.protein}g protein</span>` : ''}
                    ${item.nutrition ? `<span class="nutrition-item">${item.nutrition.fiber}g fiber</span>` : ''}
                </div>
                <button class="btn btn-primary add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Re-initialize images and attach add-to-cart handlers
    try { initializeMenuImages(); } catch (e) {}
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.removeEventListener('click', window._menuAddToCartHandler);
    });
    // attach one handler function reference so we can remove later if needed
    window._menuAddToCartHandler = function() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price')) || 0;
        try { addToCart(id, name, price, 'premade'); } catch (e) { console.warn('[Script] addToCart failed', e); }
    };
    document.querySelectorAll('.add-to-cart').forEach(btn => btn.addEventListener('click', window._menuAddToCartHandler));
    console.log('[Script] Rendered merged menu items:', merged.length);
}

// Listen for cross-window/tab changes to relevant localStorage keys so the customer menu updates
window.addEventListener('storage', function(e) {
    try {
        if (!e || !e.key) return;
        if (e.key === 'freshgreens_products' || e.key === 'freshgreens_menu') {
            console.log('[Script] Detected storage change for', e.key, ' — re-rendering customer menu');
            // Re-render the customer menu so admin changes in another tab become visible without a manual refresh
            renderCustomerMenuFromDatabase();
        }
    } catch (err) {
        console.warn('[Script] storage event handler error', err);
    }
});

// Listen to custom events from admin UI in the same tab/window
window.addEventListener('freshgreens_menu_updated', function(e) {
    try {
        console.log('[Script] Received freshgreens_menu_updated event', e && e.detail);
        renderCustomerMenuFromDatabase();
    } catch (err) {
        console.warn('[Script] freshgreens_menu_updated handler error', err);
    }
});

