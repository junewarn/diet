let FOOD_DATABASE = {};

async function loadFoodDatabase() {
    try {
        const response = await fetch('food_data.json');
        FOOD_DATABASE = await response.json();
    } catch (error) {
        console.error('Failed to load food database:', error);
        FOOD_DATABASE = {
            "米饭": { calories: 116, carbs: 25.6, protein: 2.7, fat: 0.3 },
            "鸡胸肉": { calories: 165, carbs: 0, protein: 31, fat: 3.6 },
            "牛肉": { calories: 250, carbs: 0, protein: 26.4, fat: 16.1 },
            "鸡蛋": { calories: 143, carbs: 1.1, protein: 13, fat: 9.5, pieceWeight: 50 },
            "牛奶": { calories: 54, carbs: 5, protein: 3.2, fat: 3.2 },
            "西兰花": { calories: 34, carbs: 6.6, protein: 2.8, fat: 0.4 },
            "苹果": { calories: 52, carbs: 13.8, protein: 0.3, fat: 0.2, pieceWeight: 150 },
            "香蕉": { calories: 91, carbs: 22.8, protein: 1.1, fat: 0.3, pieceWeight: 118 }
        };
    }
}

function searchFood(keyword) {
    const results = [];
    for (const [name, info] of Object.entries(FOOD_DATABASE)) {
        if (name.includes(keyword)) {
            results.push({ name, ...info });
        }
    }
    return results;
}

function getFoodInfo(name) {
    return FOOD_DATABASE[name] || null;
}

function getFoodNames() {
    return Object.keys(FOOD_DATABASE);
}

function calculateFoodNutrition(name, quantity, unit) {
    const foodInfo = FOOD_DATABASE[name];
    if (!foodInfo) {
        return { calories: 0, carbs: 0, protein: 0, fat: 0, weight: 0 };
    }
    
    let weight;
    if (unit === 'piece') {
        const pieceWeight = foodInfo.pieceWeight || 100;
        weight = quantity * pieceWeight;
    } else {
        weight = quantity;
    }
    
    const factor = weight / 100;
    return {
        calories: Math.round(foodInfo.calories * factor),
        carbs: Math.round(foodInfo.carbs * factor),
        protein: Math.round(foodInfo.protein * factor),
        fat: Math.round(foodInfo.fat * factor),
        weight: weight,
        unit: unit
    };
}

loadFoodDatabase();
