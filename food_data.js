let FOOD_DATABASE = {};

async function loadFoodDatabase() {
    const savedData = localStorage.getItem('food_database');
    if (savedData) {
        try {
            FOOD_DATABASE = JSON.parse(savedData);
            return;
        } catch (error) {
            console.error('Failed to parse saved food database:', error);
        }
    }
    
    try {
        const response = await fetch('food_data.json');
        const data = await response.json();
        if (data.foods) {
            FOOD_DATABASE = flattenFoodData(data.foods);
        } else {
            FOOD_DATABASE = data;
        }
    } catch (error) {
        console.error('Failed to load food database:', error);
        FOOD_DATABASE = getDefaultFoodDatabase();
    }
}

function flattenFoodData(foodsByCategory) {
    const result = {};
    for (const category in foodsByCategory) {
        const foods = foodsByCategory[category];
        for (const name in foods) {
            result[name] = foods[name];
        }
    }
    return result;
}

function getDefaultFoodDatabase() {
    return {
        "稻米": { calories: 346, carbs: 77.2, protein: 7.9, fat: 0.9, pieceWeight: null },
        "鸡胸肉": { calories: 118, carbs: 0, protein: 24.6, fat: 1.7, pieceWeight: 150 },
        "牛肉": { calories: 125, carbs: 0, protein: 22.3, fat: 3.1, pieceWeight: 100 },
        "鸡蛋": { calories: 143, carbs: 1.1, protein: 13, fat: 9.5, pieceWeight: 50 },
        "牛奶": { calories: 54, carbs: 3.4, protein: 3, fat: 3.2, pieceWeight: 250 },
        "豆腐": { calories: 81, carbs: 4.2, protein: 8.1, fat: 3.7, pieceWeight: 100 },
        "白菜": { calories: 17, carbs: 2.4, protein: 1.5, fat: 0.1, pieceWeight: 100 },
        "苹果": { calories: 49, carbs: 12, protein: 0.3, fat: 0.2, pieceWeight: 200 },
        "香蕉": { calories: 93, carbs: 22.2, protein: 1.4, fat: 0.2, pieceWeight: 120 },
        "猪瘦肉": { calories: 143, carbs: 0, protein: 21.3, fat: 6.2, pieceWeight: 100 },
        "草鱼": { calories: 113, carbs: 0, protein: 18.5, fat: 3.5, pieceWeight: 100 },
        "红薯": { calories: 61, carbs: 15.3, protein: 0.7, fat: 0.2, pieceWeight: 150 },
        "玉米": { calories: 112, carbs: 22.8, protein: 4, fat: 1.2, pieceWeight: 180 }
    };
}

function searchFood(keyword) {
    if (!keyword) {
        return Object.entries(FOOD_DATABASE).map(([name, info]) => ({ name, ...info }));
    }
    const results = [];
    const lowerKeyword = keyword.toLowerCase();
    for (const [name, info] of Object.entries(FOOD_DATABASE)) {
        if (name.toLowerCase().includes(lowerKeyword)) {
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
        calories: Math.round(foodInfo.calories * factor * 10) / 10,
        carbs: Math.round(foodInfo.carbs * factor * 10) / 10,
        protein: Math.round(foodInfo.protein * factor * 10) / 10,
        fat: Math.round(foodInfo.fat * factor * 10) / 10,
        weight: weight,
        unit: unit
    };
}

let RECIPES = [];

async function loadRecipes() {
    try {
        const response = await fetch('recipes_data.json');
        RECIPES = await response.json();
    } catch (error) {
        console.error('Failed to load recipes:', error);
        RECIPES = [];
    }
}

function getRecipes() {
    return RECIPES;
}

function getRecipeById(id) {
    return RECIPES.find(r => r.id === id);
}

function searchRecipes(keyword) {
    if (!keyword) return RECIPES;
    return RECIPES.filter(r => r.name.includes(keyword));
}

function getRecipesByNutrition(calories, carbs, protein, fat) {
    const tolerance = 0.3;
    return RECIPES.filter(r => {
        const calMatch = Math.abs(r.calories - calories) <= calories * tolerance;
        const carbMatch = Math.abs(r.carbs - carbs) <= carbs * tolerance || carbs === 0;
        const proteinMatch = Math.abs(r.protein - protein) <= protein * tolerance || protein === 0;
        const fatMatch = Math.abs(r.fat - fat) <= fat * tolerance || fat === 0;
        return calMatch && (carbMatch || proteinMatch);
    });
}

if (typeof window !== 'undefined') {
    loadFoodDatabase();
    loadRecipes();
}