/**
 * DormChef v6 -- Premium Midnight Kitchen
 */
'use strict';

let currentLang = localStorage.getItem('dormchef_lang') || 'en';

const LANG = {
  en: {
    tagline:'Cook with what you have.',searchPh:'Search recipe or ingredient...',
    ingSearchPh:'Search ingredient...',ingToggle:'Filter by Ingredients',
    ingSelected:(n)=>`${n} ingredient${n!==1?'s':''} selected`,
    allCats:'All Categories',results:(n)=>`<strong>${n}</strong> recipe${n!==1?'s':''} found`,
    noRecipes:'No recipes found.',noRecipesSub:'Try a different name or remove some filters.',
    noRecipesBtn:'Try a Random Recipe',hint:'Type a recipe name, choose a category, or select ingredients to find what you can cook!',
    back:'Back',saveBtn:'Save',savedBtn:'Saved',favTitle:'Saved Recipes',
    noSaved:'No saved recipes yet.',noSavedSub:'Save your favorite recipes!',
    randomTag:'RANDOM RECIPE',viewRecipe:'View Recipe',rollAgain:'Roll Again!',
    randomBtn:'Random Recipe',watchYT:'Watch on YouTube',
    ingSection:'Ingredients',toolsSection:'Cooking Tools',stepsSection:'Instructions',
    pantry:'Pantry Staples',proteins:'Proteins',vegetables:'Vegetables',
    instant:'Instant & Canned',condiments:'Condiments & Seasonings',
    tools:'Cooking Tools (optional)',ingCount:(m,t)=>`${m}/${t} ingredients`,
  },
  fil: {
    tagline:'Lutuin ang mayroon mo.',searchPh:'Maghanap ng recipe o sangkap...',
    ingSearchPh:'Hanapin ang sangkap...',ingToggle:'Pumili ng Sangkap',
    ingSelected:(n)=>`${n} sangkap ang napili`,
    allCats:'Lahat ng Category',results:(n)=>`<strong>${n}</strong> recipe ang nahanap`,
    noRecipes:'Walang nahanap na recipe.',noRecipesSub:'Subukan ng ibang salita o alisin ang filter.',
    noRecipesBtn:'Subukan ang Random Recipe',hint:'Mag-type ng recipe, pumili ng category, o mag-tick ng sangkap para malaman kung ano ang puwede mong lutuin!',
    back:'Bumalik',saveBtn:'I-save',savedBtn:'Na-save',favTitle:'Mga Na-save na Recipe',
    noSaved:'Wala pang na-save na recipe.',noSavedSub:'I-save ang iyong paboritong recipe!',
    randomTag:'RANDOM NA RECIPE',viewRecipe:'Tingnan ang Recipe',rollAgain:'Isa pa!',
    randomBtn:'Random na Recipe',watchYT:'Panoorin sa YouTube',
    ingSection:'Mga Sangkap',toolsSection:'Mga Gamit',stepsSection:'Paraan ng Pagluluto',
    pantry:'Mga Pangunahing Sangkap',proteins:'Mga Protina',vegetables:'Mga Gulay',
    instant:'Instant at Canned',condiments:'Mga Pampalasa',
    tools:'Mga Gamit sa Pagluluto (opsyonal)',ingCount:(m,t)=>`${m}/${t} sangkap`,
  }
};

function L(){return LANG[currentLang];}

function toggleLang(){
  currentLang=currentLang==='en'?'fil':'en';
  localStorage.setItem('dormchef_lang',currentLang);
  applyLang();triggerSearch();
}

const INGREDIENT_CATEGORIES = {
  staples: {
    label: 'Pantry Staples',
    items: ['Rice','Bread','Cooking Oil','Salt','Pepper','Sugar','Vinegar','Soy Sauce','Fish Sauce (Patis)','Ketchup']
  },
  proteins: {
    label: 'Proteins',
    items: ['Egg','Chicken','Pork','Ground Pork','Hotdog','Tocino','Longganisa','Tuna (canned)','Sardines (canned)','Corned Beef (canned)','Spam','Squid Ball','Bangus (Milkfish)','Tilapia']
  },
  veggies: {
    label: 'Vegetables',
    items: ['Onion','Garlic','Tomato','Cabbage','Kangkong','Sitaw (String Beans)','Ampalaya (Bitter Melon)','Potato','Carrot','Pechay','Talong (Eggplant)','Sayote','Kamote (Sweet Potato)','Green Onion','Ginger']
  },
  instant: {
    label: 'Instant & Canned',
    items: ['Instant Noodles','Lucky Me Pancit Canton','Mushroom (canned)','Coconut Milk (canned)','Tomato Sauce (canned)','Condensed Milk','Evaporated Milk','Instant Oatmeal']
  },
  condiments: {
    label: 'Condiments & Seasonings',
    items: ['Oyster Sauce','Calamansi','Chili / Siling Labuyo','Margarine / Butter','Banana Catsup','Liquid Seasoning','Peanut Butter','Bread Crumbs','Flour']
  }
};

/* ============================================================
   DATA: COOKING TOOLS
   ============================================================ */
const TOOLS = [
  { id: 'rice-cooker',   name: 'Rice Cooker',    icon: '??' },
  { id: 'frying-pan',   name: 'Frying Pan',     icon: '??' },
  { id: 'microwave',    name: 'Microwave',       icon: '??' },
  { id: 'electric-stove', name: 'Electric Stove', icon: '??' },
  { id: 'pot',          name: 'Pot / Casserole', icon: '??' },
  { id: 'oven-toaster', name: 'Oven Toaster',    icon: '??' },
  { id: 'kettle',       name: 'Electric Kettle', icon: '☕' },
  { id: 'knife',        name: 'Knife & Board',   icon: '??' }
];


const CATEGORY_IMAGES = {
  'Breakfast': 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=700&q=80',
  'Lunch':     'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&q=80',
  'Dinner':    'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=80',
  'Snacks':    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=700&q=80'
};

const CATEGORY_EMOJI = {
  'Rice':'??','Eggs':'??','Canned':'??','Instant':'??','Vegetables':'??',
  'Silog':'??','Soup':'??','Ulam':'??','Fish':'??','Bread':'??',
  'Dessert':'??','Salad':'??','Snacks':'??','Microwave':'??',
  'Rice Cooker':'??','Breakfast':'??'
};


const RECIPE_DESC = {
  'Sinangag na Kanin': 'Garlicky Filipino fried rice – the dorm staple.',
  'Egg Fried Rice': 'Fluffy egg and rice stir-fried in soy sauce.',
  'Tortang Itlog': 'Classic Filipino egg omelette with onion.',
  'Sardines Rice Bowl': 'Canned sardines sautéed with tomato over hot rice.',
  'Corned Beef Fried Rice': 'Savory corned beef scrambled into garlic rice.',
  'Tuna Omelette': 'Flaky tuna folded into a golden egg omelette.',
  'Ginisang Repolyo': 'Stir-fried cabbage in soy sauce – simple and filling.',
  'Hotdog Sinangag': 'Crispy hotdog coins tossed into garlic fried rice.',
  'Instant Mami': 'Upgraded instant noodle soup with egg and green onion.',
  'Pancit Canton': 'Stir-fried noodles with veggies – Filipino street classic.',
  'default': 'A delicious Filipino recipe you can make in your dorm.'
};



function getYouTubeLink(name) {
  const links = {
    'Sinangag na Kanin': 'sinangag+na+kanin+recipe',
    'Egg Fried Rice': 'Filipino+egg+fried+rice+recipe',
    'Tortang Itlog': 'tortang+itlog+Filipino+recipe',
    'Sardines Rice Bowl': 'sardines+rice+bowl+Filipino',
    'Corned Beef Fried Rice': 'corned+beef+fried+rice+Filipino',
    'Tuna Omelette': 'tuna+omelette+Filipino',
    'Ginisang Repolyo': 'ginisang+repolyo+recipe',
    'Hotdog Sinangag': 'hotdog+sinangag+recipe',
    'Instant Mami': 'instant+mami+noodle+soup+Filipino',
    'Pancit Canton': 'pancit+canton+stir+fry+recipe',
    'Spam Fried Rice': 'spam+fried+rice+Filipino',
    'Tocilog': 'tocilog+Filipino+recipe',
    'Longsilog': 'longsilog+Filipino+recipe',
    'Ginisang Pechay': 'ginisang+pechay+recipe',
    'Kamote Que (Sweet Potato Snack)': 'kamote+que+Filipino+recipe',
    'Giniling na Baboy Bowl': 'giniling+na+baboy+Filipino',
    'Egg Sandwich': 'Filipino+egg+sandwich+recipe',
    'Arrozcaldo': 'arrozcaldo+chicken+rice+porridge',
    'Ginisang Kangkong': 'ginisang+kangkong+recipe',
    'Tortang Giniling': 'tortang+giniling+recipe',
    'Fried Bangus': 'pritong+bangus+recipe',
    'Tinolang Manok (Simple)': 'tinolang+manok+recipe',
    'Adobong Manok (Simple)': 'adobong+manok+recipe',
    'Adobong Baboy': 'pork+adobo+recipe+Filipino',
    'Sardinas con Kamatis': 'sardinas+con+kamatis+recipe',
    'Pritong Tilapia': 'pritong+tilapia+recipe+Filipino',
    'Sopas (Simple Chicken Macaroni)': 'sopas+Filipino+chicken+macaroni',
    'Ginisang Sitaw': 'ginisang+sitaw+recipe',
    'Lugaw na May Itlog': 'lugaw+na+may+itlog+recipe',
    'Microwave Scrambled Egg': 'microwave+scrambled+eggs',
    'Microwave Sardines in Rice': 'microwave+sardines+rice',
    'Talong Omelette (Tortang Talong)': 'tortang+talong+recipe',
    'Chicken Tinola (Budget)': 'chicken+tinola+recipe+Filipino',
    'Pork Sinigang (Simple)': 'pork+sinigang+recipe+Filipino',
    'Monggo Soup (Simple)': 'monggo+soup+recipe+Filipino',
    'Hotdog and Egg Fry': 'hotdog+and+egg+Filipino',
    'Creamy Tuna Pasta (Instant Noodle Hack)': 'creamy+tuna+pasta+instant+noodles',
    'Ampalaya with Egg': 'ampalaya+with+egg+recipe',
    'Corned Beef Omelette': 'corned+beef+omelette+Filipino',
    'Potato and Egg Salad': 'potato+egg+salad+Filipino',
    'Arroz Caldo sa Rice Cooker': 'arroz+caldo+rice+cooker',
    'Ginisang Ampalaya con Egg': 'ginisang+ampalaya+con+egg',
    'Pork Adobo Flakes': 'pork+adobo+flakes+recipe',
    'Ginataang Kamote': 'ginataang+kamote+recipe',
    'Sautéed Squid Balls': 'sauteed+squid+balls+Filipino',
    'Microwave Corned Beef Bowl': 'microwave+corned+beef+bowl',
    'Ensaladang Kamatis at Sibuyas': 'ensaladang+kamatis+sibuyas',
    'Batchoy Style Noodle Soup': 'batchoy+noodle+soup+Filipino',
    'Peanut Butter Rice (Filipino Style)': 'peanut+butter+rice+Filipino',
    'Instant Noodle Upgrade (Carbonara Style)': 'instant+noodles+carbonara+hack',
    'Monggo at Dilis (Canned Sardines Substitute)': 'monggo+at+dilis+Filipino',
    'Chicken Adobo sa Rice Cooker': 'chicken+adobo+rice+cooker',
    'Champorado': 'champorado+Filipino+recipe',
    'Sinigang na Sardinas': 'sinigang+na+sardinas+recipe',
    'Sautéed Pork with Tomato': 'pork+stir+fry+tomato+Filipino',
    'Milanesa Bread (Simple Breaded Pork)': 'breaded+pork+chop+Filipino',
    'Chicken Tinola Lugaw': 'chicken+tinola+lugaw+recipe',
    'Ginisang Togue (Bean Sprout Stir-fry)': 'ginisang+togue+recipe',
    'Tuna Rice Cooker Bowl': 'tuna+rice+cooker+recipe',
    'Arroz con Leche': 'arroz+con+leche+Filipino',
    'Inihaw na Bangus (Oven Toaster)': 'inihaw+na+bangus+oven+toaster',
    'Pork Pochero (Budget)': 'pork+pochero+Filipino',
    'Buttered Corn and Rice': 'buttered+rice+mushroom+Filipino',
    'Ginisang Upo (Bottle Gourd) Style with Sayote': 'ginisang+sayote+recipe',
    'Spam Sandwich': 'spam+sandwich+Filipino+recipe',
    'Oatmeal with Condensed Milk': 'oatmeal+condensed+milk+Filipino',
    'Sautéed Mushroom on Toast': 'sauteed+mushroom+toast+recipe',
    'Pork Menudo (Budget Version)': 'pork+menudo+Filipino+recipe',
    'Ginataang Mais (Sweet Corn Pudding)': 'ginataang+mais+recipe',
    'Bulalo Style Soup (No Bones)': 'bulalo+soup+recipe+Filipino',
    'Pork Igado Style (Liver-free)': 'igado+pork+recipe+Filipino',
    'Chili Garlic Fried Egg': 'chili+garlic+fried+egg+Filipino',
    'Instant Noodle Stir-fry': 'instant+noodle+stir+fry+recipe',
    'Pork Sauté with Oyster Sauce': 'pork+saute+oyster+sauce+Filipino',
    'Canned Mushroom with Egg': 'mushroom+egg+stir+fry+Filipino',
    'Tomato Basura (Chilled Tomato Salad)': 'ensaladang+kamatis+Filipino',
    'Bread Pudding (Dorm Style)': 'bread+pudding+Filipino+recipe',
    'Ginisang Sayote with Egg': 'ginisang+sayote+with+egg',
    'Nilagang Manok': 'nilagang+manok+recipe',
    'Crispy Tuna Patties': 'tuna+patties+recipe+Filipino',
    'Chicken Inasal Style (Frying Pan)': 'chicken+inasal+frying+pan',
    'Sinigang na Tuna': 'sinigang+na+tuna+recipe',
    'Fried Egg Rice with Chili Vinegar': 'fried+egg+rice+Filipino',
    'Chicken Afritada (Simple)': 'chicken+afritada+recipe+Filipino',
    'Steamed Rice Cooker Chicken': 'steamed+chicken+rice+cooker',
    'Pork Binagoongan (Simple)': 'pork+binagoongan+recipe',
    'Egg Drop Soup': 'Filipino+egg+drop+soup',
    'Turon Style Banana (Oven Version)': 'turon+kamote+Filipino+recipe',
    'Coconut Milk Rice (Sinanglaw Style)': 'coconut+milk+rice+Filipino',
    'Bangus Sisig (Budget)': 'bangus+sisig+recipe+Filipino',
    'Simple Chicken Congee (Microwave)': 'chicken+congee+microwave',
    'Pork Tocino Style (Homemade)': 'homemade+pork+tocino+recipe',
    'Ginataang Bilo-Bilo (Simple)': 'ginataang+bilo+bilo+recipe',
    'Nilagang Sitaw at Corned Beef': 'nilagang+sitaw+corned+beef',
    'Pork and Potato Hash': 'pork+potato+hash+recipe',
    'Egg in Coconut Milk': 'egg+coconut+milk+ginata+recipe',
    'Filipino French Toast (Monay Toast)': 'Filipino+french+toast+monay',
    'Canned Tuna Pasta (No Pasta)': 'tuna+pasta+instant+noodles+hack','Sinabawang Isda': 'sinabawang+isda+Filipino',
    'Pinakbet': 'pinakbet+Filipino+recipe',
    'Chopsuey': 'chopsuey+Filipino+recipe',
    'Paksiw na Isda': 'paksiw+na+isda+recipe',
    'Daing na Bangus': 'daing+na+bangus+recipe',
    'Menudo sa Lata': 'menudo+sa+lata+corned+beef',
    'Canned Tuna with Sayote': 'tuna+sayote+stir+fry',
    'Sizzling Tofu Style Egg': 'sizzling+egg+Filipino',
    'Pork Nilaga': 'pork+nilaga+Filipino',
    'Scrambled Egg with Sardines': 'scrambled+egg+sardines+Filipino',
    'Ginisang Munggo': 'ginisang+munggo+recipe',
    'Stir-fried Corned Beef with Cabbage': 'corned+beef+cabbage+stir+fry',
    'Ginataang Manok': 'ginataang+manok+recipe',
    'Spicy Tuna Rice Bowl': 'spicy+tuna+rice+bowl+Filipino',
    'Ginisang Ampalaya with Pork': 'ginisang+ampalaya+pork+recipe',
    'Tortang Tuna': 'tortang+tuna+recipe',
    'Arroz Caldo (Microwave)': 'arroz+caldo+microwave+recipe',
    'Chicken and Potato Stew': 'chicken+potato+stew+Filipino',
    'Itlog na Maalat (Salted Egg) with Tomato': 'salted+egg+tomato+Filipino',
    'Adobong Kangkong': 'adobong+kangkong+recipe',
    'Pork Steak Filipino Style': 'pork+steak+Filipino+bistek',
    'Ginisang Sitaw at Hipon Style': 'ginisang+sitaw+recipe',
    'Banana Cue': 'banana+cue+Filipino+recipe',
    'Lugaw with Corned Beef': 'lugaw+corned+beef+recipe',
    'Tokwa at Itlog (Egg & Bean Curd Style)': 'tokwa+itlog+recipe',
    'Tuna Sinangag': 'tuna+sinangag+recipe',
    'Karekare Style Peanut Vegetable': 'kare+kare+vegetable+Filipino',
    'Hotdog Pasta Hack': 'hotdog+pasta+Filipino+hack',
    'Pork Salpicao': 'pork+salpicao+recipe',
    'Ginataang Gulay': 'ginataang+gulay+recipe',
    'Egg and Potato Frittata': 'egg+potato+frittata+Filipino',
    'Chicken Arroz Caldo de Leche': 'arroz+caldo+de+leche+recipe',
    'Garlicky Spinach Style Kangkong': 'garlicky+kangkong+recipe',
    'Pork Hamonado': 'pork+hamonado+recipe',
    'Ginisang Kamote Tops': 'ginisang+kamote+tops+recipe',
    'Sardines Spaghetti (Instant Noodle)': 'sardines+spaghetti+instant+noodle',
    'Pork Humba': 'pork+humba+Filipino+recipe',
    'Scrambled Egg with Corned Beef Toast': 'corned+beef+scrambled+egg+toast',
    'Adobong Pusit Style Squid Ball': 'adobong+squid+balls+recipe',
    'Steamed Egg (Chinese Style)': 'steamed+egg+Filipino+Chinese+style',
    'Bulalo Rice (One Pot)': 'bulalo+rice+one+pot',
    'Pancit Canton Guisado': 'pancit+canton+guisado+recipe',
    'Chicken Pastel Budget Style': 'chicken+pastel+Filipino+budget',
    'Ginisang Upo': 'ginisang+upo+recipe',
    'Egg and Mushroom Scramble': 'egg+mushroom+scramble+Filipino',
    'Coconut Milk Oatmeal': 'coconut+milk+oatmeal+Filipino',
    'Adobo Flakes Sinangag': 'adobo+flakes+sinangag+recipe',
    'Sinabawang Manok at Mais Style': 'sinabawang+manok+coconut+milk',
    'Spam and Egg Rice Bowl': 'spam+egg+rice+bowl+Filipino',
    'Ginataang Sitaw': 'ginataang+sitaw+recipe',
    'Fried Rice with Vegetables': 'fried+rice+with+vegetables+Filipino',
    'Pork Belly Fried': 'fried+pork+belly+Filipino',
    'Chicken Soup with Ginger': 'chicken+soup+ginger+Filipino',
    'Peanut Sauce Noodles': 'peanut+sauce+noodles+Filipino',
    'Caldereta Budget Style': 'caldereta+budget+recipe',
    'Canned Mushroom Soup': 'mushroom+soup+Filipino+style',
    'Tomato Egg Stir-fry': 'tomato+egg+stir+fry+Filipino',
    'Nilasing na Hipon Style (Spicy Squid Balls)': 'spicy+squid+balls+Filipino',
    'Rice Cooker Chicken Rice (Hainanese Style)': 'hainanese+chicken+rice+Filipino',
    'Pork Tocino Bowl': 'pork+tocino+bowl+recipe',
    'Sautéed Kangkong with Oyster Sauce': 'kangkong+oyster+sauce+recipe',
    'Microwave Omelette': 'microwave+omelette+recipe',
    'Spicy Garlic Corned Beef': 'spicy+garlic+corned+beef+Filipino',
    'Ginataang Puso ng Saging Style': 'ginataang+puso+ng+saging+recipe',
    'Pancit Canton Soup Style': 'pancit+canton+soup+recipe',
    'Chicken Asado Budget': 'chicken+asado+Filipino+budget',
    'Coconut Milk Chicken Soup': 'coconut+milk+chicken+soup+Filipino',
    'Dried Fish Style Spam Scramble': 'spam+egg+scramble+Filipino',
    'Macaroni Soup (Budget Sopas)': 'budget+sopas+macaroni+Filipino',
    'Miso Soup Style': 'Filipino+miso+soup+style',
    'Adobong Atay ng Manok Style (No Liver)': 'adobong+atay+manok+recipe',
    'Garlic Butter Shrimp Style (Squid Balls)': 'garlic+butter+squid+balls',
    'Pork Chop Rice Cooker': 'pork+chop+rice+cooker+recipe',
    'Skinless Longganisa Fried Rice': 'skinless+longganisa+fried+rice',
    'Tomato Soup Filipino Style': 'tomato+soup+Filipino+style',
    'Corned Beef Hash Bowl': 'corned+beef+hash+Filipino',
    'Pork and Egg Topping Rice': 'pork+egg+topping+rice+Filipino',
    'Arroz Caldo with Corned Beef': 'arroz+caldo+corned+beef+recipe',
    'Ginisang Talong': 'ginisang+talong+recipe',
    'Sweetened Kamote Dessert': 'sweetened+kamote+dessert',
    'Pork Asado Style': 'pork+asado+Filipino+recipe',
    'Saging na Saba Style Snack': 'kamote+condensed+milk+snack+Filipino',
    'Ensaladang Talong': 'ensaladang+talong+recipe',
    'Pork Binagoongan Instant Style': 'pork+binagoongan+recipe',
    'Corned Beef Sopas': 'corned+beef+sopas+recipe',
    'Pinoy Egg Salad Sandwich': 'Filipino+egg+salad+sandwich',
    'Monggo at Baboy (Budget)': 'monggo+baboy+Filipino',
    'Butter Garlic Bangus': 'butter+garlic+bangus+recipe',
    'Tokwa Style Hard Boiled Egg': 'marinated+egg+Filipino+tokwa+style',
    'Chicken Sopas sa Rice Cooker': 'chicken+sopas+rice+cooker',
    'Sweet and Sour Pork (Budget)': 'sweet+sour+pork+Filipino+budget',
    'Pechay at Corned Beef': 'pechay+corned+beef+stir+fry',
    'Chicken Inasal Rice Cooker': 'chicken+inasal+rice+cooker',
    'Champorado with Condensed Milk': 'champorado+condensed+milk',
    'Ginataang Langka Style with Cabbage': 'ginataang+langka+cabbage+recipe',
    'Tuna and Pechay Stir-fry': 'tuna+pechay+stir+fry',
    'Monggo with Kangkong and Sardines': 'monggo+kangkong+sardines',
    'Pinoy Garlic Toast': 'Filipino+garlic+toast+recipe',
    'Squid Ball Soup': 'squid+ball+soup+Filipino',
    'Chicken Longganisa Style': 'chicken+longganisa+homemade',
  };
  const q = links[name] || encodeURIComponent(name + ' Filipino recipe');
  return 'https://www.youtube.com/results?search_query=' + q;
}

function getImg(r){
  const custom=getCustomPhoto(r.id);
  if(custom)return custom;
  if(r.image&&r.image.trim())return r.image.trim();
  return CATEGORY_IMAGES[r.category]||CATEGORY_IMAGES['Lunch'];
}
function getEmoji(cat){return CATEGORY_EMOJI[cat]||'&#127869;';}
function getDesc(name){return RECIPE_DESC[name]||RECIPE_DESC['default'];}

const RECIPES = [
  // ── 1 ──
  {
    id: 1, name: 'Sinangag na Kanin',
    ingredients: ['Rice', 'Garlic', 'Cooking Oil', 'Salt', 'Egg'],
    tools: ['frying-pan'],
    steps: [
      'Heat oil in frying pan over medium heat.',
      'Fry minced garlic until golden and fragrant.',
      'Add cold leftover rice, breaking up clumps.',
      'Season with salt and mix well.',
      'Push rice to side, scramble egg in the space, then mix together.',
      'Serve hot with your protein of choice.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱15–₱25', category: 'Breakfast', image: 'fied rice.jpg'
  },
  // ── 2 ──
  {
    id: 2, name: 'Egg Fried Rice',
    ingredients: ['Rice', 'Egg', 'Garlic', 'Onion', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Heat oil, sauté garlic and onion until soft.',
      'Beat eggs and add to the pan, scramble.',
      'Add cold cooked rice and stir-fry on high heat.',
      'Drizzle soy sauce around the edges of the pan.',
      'Toss everything together and serve.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱20–₱35', category: 'Breakfast', image: 'egg fried rice.jpg'
  },
  // ── 3 ──
  {
    id: 3, name: 'Tortang Itlog',
    ingredients: ['Egg', 'Onion', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Beat eggs in a bowl with salt and pepper.',
      'Add finely chopped onion and mix.',
      'Heat oil in pan over medium heat.',
      'Pour egg mixture and cook until edges set.',
      'Flip carefully and cook the other side until golden.',
      'Serve with rice and ketchup.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱12–₱20', category: 'Breakfast', image: 'tortang itlog.jpg'
  },
  // ── 4 ──
  {
    id: 4, name: 'Sardines Rice Bowl',
    ingredients: ['Rice', 'Sardines (canned)', 'Garlic', 'Onion', 'Tomato', 'Cooking Oil'],
    tools: ['frying-pan', 'rice-cooker'],
    steps: [
      'Cook rice in rice cooker.',
      'Heat oil, sauté garlic, onion, and tomato.',
      'Open sardines and add to pan, sauce and all.',
      'Mash lightly and cook 3–4 minutes, stirring.',
      'Serve generous spoonful over hot rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱25–₱40', category: 'Lunch', image: 'sardines rice bowl.jpg'
  },
  // ── 5 ──
  {
    id: 5, name: 'Corned Beef Fried Rice',
    ingredients: ['Rice', 'Corned Beef (canned)', 'Garlic', 'Onion', 'Egg', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Heat oil, fry garlic until golden.',
      'Add onion, cook until translucent.',
      'Add corned beef and break apart with spatula.',
      'Add cold rice and mix well over high heat.',
      'Push to side, scramble an egg in, then combine.',
      'Season with salt and serve.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱40–₱55', category: 'Breakfast', image: 'corned beef rice.jpg'
  },
  // ── 6 ──
  {
    id: 6, name: 'Tuna Omelette',
    ingredients: ['Egg', 'Tuna (canned)', 'Onion', 'Tomato', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Drain canned tuna and flake.',
      'Beat eggs, add diced onion, tomato, salt, and pepper.',
      'Stir in tuna flakes.',
      'Heat oil in pan, pour mixture.',
      'Cook until set, flip gently, cook other side.',
      'Serve hot.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱30–₱45', category: 'Breakfast', image: 'tuna omellete.jpg'
  },
  // ── 7 ──
  {
    id: 7, name: 'Ginisang Repolyo',
    ingredients: ['Cabbage', 'Garlic', 'Onion', 'Cooking Oil', 'Soy Sauce', 'Salt', 'Pepper'],
    tools: ['frying-pan', 'electric-stove', 'pot'],
    steps: [
      'Heat oil, sauté garlic and onion.',
      'Add shredded cabbage and toss over high heat.',
      'Add a splash of soy sauce.',
      'Season with salt and pepper.',
      'Cook until cabbage is tender but still crisp.',
      'Serve as side dish with rice.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱20–₱30', category: 'Lunch', image: 'ginisang repolyo.jpg'
  },
  // ── 8 ──
  {
    id: 8, name: 'Hotdog Sinangag',
    ingredients: ['Rice', 'Hotdog', 'Garlic', 'Cooking Oil', 'Soy Sauce'],
    tools: ['frying-pan'],
    steps: [
      'Slice hotdogs into coins.',
      'Fry garlic in oil until golden.',
      'Add hotdog slices and fry until lightly charred.',
      'Add cold rice and stir-fry together.',
      'Drizzle soy sauce and mix well.',
      'Serve hot.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱30–₱45', category: 'Breakfast', image: 'hotdog sinangag.jpg'
  },
  // ── 9 ──
  {
    id: 9, name: 'Instant Mami',
    ingredients: ['Instant Noodles', 'Egg', 'Green Onion', 'Garlic'],
    tools: ['pot', 'electric-stove', 'kettle'],
    steps: [
      'Boil 2 cups water in pot.',
      'Add noodles and cook 2 minutes.',
      'Crack egg in and stir gently.',
      'Add seasoning packet.',
      'Top with chopped green onion.',
      'Serve immediately.'
    ],
    cookingTime: '7 mins', estimatedCost: '₱12–₱18', category: 'Lunch', image: 'instany mami.jpg'
  },
  // ── 10 ──
  {
    id: 10, name: 'Pancit Canton',
    ingredients: ['Lucky Me Pancit Canton', 'Cabbage', 'Carrot', 'Egg', 'Cooking Oil', 'Garlic'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Soak noodles in warm water for 1 minute, drain.',
      'Heat oil, sauté garlic.',
      'Add vegetables and stir-fry 2 minutes.',
      'Add drained noodles and mix.',
      'Add seasoning packets and toss well.',
      'Push aside, scramble egg, combine.',
      'Serve hot.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱18–₱30', category: 'Lunch', image: 'pancit canton.jpg'
  },
  // ── 11 ──
  {
    id: 11, name: 'Tokwa\'t Baboy Style Tofu',
    ingredients: ['Egg', 'Soy Sauce', 'Vinegar', 'Onion', 'Chili / Siling Labuyo', 'Garlic', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Hard-boil egg, slice.',
      'Mix soy sauce, vinegar, minced onion, garlic, and chili for sauce.',
      'Fry egg pieces lightly in oil until golden.',
      'Pour sauce over and serve.',
      'Best paired with congee or rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱18–₱25', category: 'Lunch', image: 'tokwa baboy.jpg'
  },
  // ── 12 ──
  {
    id: 12, name: 'Spam Fried Rice',
    ingredients: ['Rice', 'Spam', 'Garlic', 'Egg', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Dice Spam into cubes.',
      'Fry Spam in oil until caramelized. Set aside.',
      'Fry garlic in same pan.',
      'Add rice, stir-fry on high.',
      'Scramble egg into the rice.',
      'Add back Spam, drizzle soy sauce, and toss.',
      'Serve hot.'
    ],
    cookingTime: '13 mins', estimatedCost: '₱55–₱70', category: 'Breakfast', image: 'spam rice.webp'
  },
  // ── 13 ──
  {
    id: 13, name: 'Tocilog',
    ingredients: ['Tocino', 'Rice', 'Egg', 'Garlic', 'Cooking Oil'],
    tools: ['frying-pan', 'rice-cooker'],
    steps: [
      'Cook rice in rice cooker.',
      'Fry tocino in oil over medium heat until caramelized.',
      'In same pan, fry egg sunny side up.',
      'Plate rice, tocino, and egg together.',
      'Serve with garlic vinegar on the side.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱40–₱60', category: 'Breakfast', image: 'tocilog.png'
  },
  // ── 14 ──
  {
    id: 14, name: 'Longsilog',
    ingredients: ['Longganisa', 'Rice', 'Egg', 'Garlic', 'Cooking Oil', 'Vinegar'],
    tools: ['frying-pan', 'rice-cooker'],
    steps: [
      'Cook rice in rice cooker.',
      'Add a bit of water to pan, cook longganisa covered until water evaporates.',
      'Fry in own fat until browned.',
      'Fry egg in remaining oil.',
      'Serve with sinangag (garlic rice) and egg.',
      'Dip longganisa in vinegar.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱35–₱55', category: 'Breakfast', image: 'longsilog.png'
  },
  // ── 15 ──
  {
    id: 15, name: 'Canned Tuna Pasta (No Pasta)',
    ingredients: ['Instant Noodles', 'Tuna (canned)', 'Tomato Sauce (canned)', 'Garlic', 'Onion', 'Cooking Oil'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil instant noodles without seasoning packet, drain.',
      'Heat oil, sauté garlic and onion.',
      'Add drained tuna, stir.',
      'Pour tomato sauce, simmer 3 mins.',
      'Add noodles and toss to coat.',
      'Season with salt and serve.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱30–₱45', category: 'Lunch', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80'
  },
  // ── 16 ──
  {
    id: 16, name: 'Ginisang Pechay',
    ingredients: ['Pechay', 'Garlic', 'Onion', 'Soy Sauce', 'Cooking Oil', 'Salt'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Heat oil and sauté garlic and onion.',
      'Add washed pechay and toss.',
      'Season with soy sauce and salt.',
      'Cover and steam 2 minutes.',
      'Serve with rice.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱15–₱25', category: 'Lunch', image: 'ginisang pichay.jpg'
  },
  // ── 17 ──
  {
    id: 17, name: 'Kamote Que (Sweet Potato Snack)',
    ingredients: ['Kamote (Sweet Potato)', 'Sugar', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Peel and slice kamote into thick rounds.',
      'Heat oil in pan over medium.',
      'Fry kamote slices until soft, about 5 mins each side.',
      'Sprinkle sugar over the slices.',
      'Continue cooking until sugar caramelizes.',
      'Serve as snack or merienda.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱15–₱25', category: 'Snacks', image: 'kamote que.webp'
  },
  // ── 18 ──
  {
    id: 18, name: 'Giniling na Baboy Bowl',
    ingredients: ['Ground Pork', 'Garlic', 'Onion', 'Tomato', 'Soy Sauce', 'Cooking Oil', 'Rice'],
    tools: ['frying-pan', 'rice-cooker'],
    steps: [
      'Cook rice.',
      'Sauté garlic and onion in oil.',
      'Add ground pork and cook until brown.',
      'Add diced tomato and soy sauce.',
      'Simmer 5 minutes.',
      'Serve over rice.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱55–₱75', category: 'Lunch', image: 'giniling baboy.jpg'
  },
  // ── 19 ──
  {
    id: 19, name: 'Egg Sandwich',
    ingredients: ['Egg', 'Bread', 'Margarine / Butter', 'Salt', 'Pepper'],
    tools: ['frying-pan', 'oven-toaster'],
    steps: [
      'Toast bread in oven toaster.',
      'Fry egg to your preference.',
      'Spread margarine on toast.',
      'Place egg on bread, season with salt and pepper.',
      'Close sandwich and enjoy.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱15–₱25', category: 'Breakfast', image: 'egg sandwich.jpg'
  },
  // ── 20 ──
  {
    id: 20, name: 'Arrozcaldo',
    ingredients: ['Rice', 'Chicken', 'Garlic', 'Ginger', 'Onion', 'Fish Sauce (Patis)', 'Green Onion'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, ginger, and onion in oil.',
      'Add chicken pieces, cook until white.',
      'Add rice and stir 2 minutes.',
      'Pour 5–6 cups water, bring to boil.',
      'Simmer 25 mins until rice breaks down.',
      'Season with patis.',
      'Garnish with green onion.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱60–₱85', category: 'Breakfast', image: 'arozcaldo.jpg'
  },
  // ── 21 ──
  {
    id: 21, name: 'Ginisang Kangkong',
    ingredients: ['Kangkong', 'Garlic', 'Onion', 'Oyster Sauce', 'Cooking Oil'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Separate kangkong leaves and stems.',
      'Sauté garlic and onion in oil.',
      'Add kangkong stems first, cook 1 min.',
      'Add leaves, toss quickly.',
      'Add oyster sauce and mix.',
      'Serve immediately.'
    ],
    cookingTime: '7 mins', estimatedCost: '₱15–₱22', category: 'Lunch', image: 'gisang kanfkong.jpg'
  },
  // ── 22 ──
  {
    id: 22, name: 'Tortang Giniling',
    ingredients: ['Egg', 'Ground Pork', 'Onion', 'Garlic', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Sauté garlic, onion, and ground pork. Season and cool slightly.',
      'Beat eggs in a bowl, add cooked pork mixture.',
      'Heat oil in pan.',
      'Pour one ladleful of the egg-pork mix.',
      'Cook until set, flip, cook other side.',
      'Repeat and serve with rice and ketchup.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱45–₱60', category: 'Lunch', image: 'tortang giniling.jpg'
  },
  // ── 23 ──
  {
    id: 23, name: 'Fried Bangus',
    ingredients: ['Bangus (Milkfish)', 'Garlic', 'Salt', 'Pepper', 'Vinegar', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Marinate bangus in vinegar, salt, and garlic for 15 mins.',
      'Pat dry with paper towel.',
      'Heat oil in pan, enough to shallow-fry.',
      'Fry bangus until golden brown on both sides.',
      'Serve with tomato, onion salsa and rice.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱55–₱80', category: 'Dinner', image: 'bangus.jpg'
  },
  // ── 24 ──
  {
    id: 24, name: 'Tinolang Manok (Simple)',
    ingredients: ['Chicken', 'Ginger', 'Garlic', 'Onion', 'Sayote', 'Kangkong', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté ginger, garlic, and onion.',
      'Add chicken, cook 5 minutes.',
      'Add fish sauce and 4 cups water.',
      'Bring to boil, simmer 20 mins.',
      'Add sayote, cook 5 mins.',
      'Add kangkong, turn off heat.',
      'Serve hot.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱80–₱110', category: 'Dinner', image: 'tinolang manok.jpg'
  },
  // ── 25 ──
  {
    id: 25, name: 'Adobong Manok (Simple)',
    ingredients: ['Chicken', 'Soy Sauce', 'Vinegar', 'Garlic', 'Pepper', 'Cooking Oil'],
    tools: ['pot', 'frying-pan', 'electric-stove'],
    steps: [
      'Marinate chicken in soy sauce, vinegar, garlic, pepper for 15 mins.',
      'Heat oil in pot, sauté garlic.',
      'Add chicken with marinade.',
      'Bring to boil, simmer 20 mins.',
      'Uncover and cook until sauce reduces.',
      'Serve over rice.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱75–₱100', category: 'Dinner', image: 'adobo manok.jpg'
  },
  // ── 26 ──
  {
    id: 26, name: 'Adobong Baboy',
    ingredients: ['Pork', 'Soy Sauce', 'Vinegar', 'Garlic', 'Pepper', 'Cooking Oil'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Combine pork, soy sauce, vinegar, garlic, pepper in pot.',
      'Boil without stirring, simmer 20 minutes.',
      'Uncover and fry in own fat until browned.',
      'Serve with rice.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱80–₱110', category: 'Dinner', image: 'pork Adobo.jpg'
  },
  // ── 27 ──
  {
    id: 27, name: 'Sardinas con Kamatis with upo',
    ingredients: ['Sardines (canned)', 'Tomato', 'Onion', 'Garlic', 'Cooking Oil', 'Salt', 'Pepper'],
    tools: ['frying-pan'],
    steps: [
      'Sauté garlic, onion, and tomato in oil.',
      'Add sardines (whole, with sauce).',
      'Season with salt and pepper.',
      'Cook 5 minutes, mashing lightly.',
      'Serve hot with rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱25–₱35', category: 'Lunch', image: 'sardinas kamatis.jpg'
  },
  // ── 28 ──
  {
    id: 28, name: 'Pritong Tilapia',
    ingredients: ['Tilapia', 'Salt', 'Pepper', 'Garlic', 'Cooking Oil', 'Calamansi'],
    tools: ['frying-pan'],
    steps: [
      'Score tilapia flesh with knife.',
      'Season with salt, pepper, calamansi juice.',
      'Let sit 10 minutes.',
      'Heat plenty of oil in pan.',
      'Fry tilapia until golden and crispy on both sides.',
      'Serve with spiced vinegar.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱55–₱75', category: 'Dinner', image: 'pritong tilapia.jpg'
  },
  // ── 29 ──
  {
    id: 29, name: 'Sopas (Simple Chicken Instant Noodles)',
    ingredients: ['Chicken', 'Instant Noodles', 'Carrot', 'Cabbage', 'Onion', 'Garlic', 'Evaporated Milk', 'Salt', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil chicken in 4 cups water with garlic and onion.',
      'Remove chicken, shred. Keep broth.',
      'Add noodles (as pasta substitute) to broth.',
      'Add carrot and cabbage, cook 5 mins.',
      'Return chicken, add evaporated milk.',
      'Season and simmer 3 mins.',
      'Serve hot.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'sopas.jpg'
  },
  // ── 30 ──
  {
    id: 30, name: 'Ginisang Sitaw',
    ingredients: ['Sitaw (String Beans)', 'Garlic', 'Onion', 'Tomato', 'Cooking Oil', 'Fish Sauce (Patis)'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Cut sitaw into 2-inch pieces.',
      'Sauté garlic, onion, tomato in oil.',
      'Add sitaw and toss.',
      'Add a splash of water, cover.',
      'Cook 8 minutes until tender.',
      'Season with patis and serve.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱20–₱35', category: 'Lunch', image: 'sitaw.jpg'
  },
  // ── 31 ──
  {
    id: 31, name: 'Lugaw na May Itlog',
    ingredients: ['Rice', 'Ginger', 'Garlic', 'Onion', 'Egg', 'Fish Sauce (Patis)', 'Green Onion'],
    tools: ['pot', 'electric-stove', 'rice-cooker'],
    steps: [
      'Sauté garlic, ginger, onion in oil in pot.',
      'Add rice and stir 1 minute.',
      'Pour 5 cups water, bring to boil.',
      'Simmer 20–25 mins, stirring occasionally, until porridge consistency.',
      'Season with patis.',
      'Top with poached or fried egg and green onion.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱15–₱25', category: 'Breakfast', image: 'lugaw.jpg'
  },
  // ── 32 ──
  {
    id: 32, name: 'Tuyo Sinangag',
    ingredients: ['Rice', 'Garlic', 'Cooking Oil', 'Egg'],
    tools: ['frying-pan'],
    steps: [
      'Fry garlic in oil until golden.',
      'Add cold rice, press and stir-fry.',
      'Season with salt.',
      'Fry egg separately.',
      'Serve rice with fried egg.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱10–₱20', category: 'Breakfast', image: 'tuyo.jpg'
  },
  // ── 33 ──
  {
    id: 33, name: 'Microwave Scrambled Egg',
    ingredients: ['Egg', 'Salt', 'Pepper', 'Margarine / Butter', 'Evaporated Milk'],
    tools: ['microwave'],
    steps: [
      'Crack 2 eggs into a microwave-safe mug.',
      'Add a splash of evaporated milk, salt, and pepper.',
      'Beat with a fork.',
      'Microwave 30 seconds, stir.',
      'Microwave another 30 seconds, stir.',
      'Heat in additional 15-second intervals until just set.',
      'Serve on bread or rice.'
    ],
    cookingTime: '3 mins', estimatedCost: '₱10–₱18', category: 'Breakfast', image: 'microegg.jpg'
  },
  // ── 34 ──
  {
    id: 34, name: 'Microwave Sardines in Rice',
    ingredients: ['Rice', 'Sardines (canned)', 'Garlic', 'Soy Sauce'],
    tools: ['microwave', 'rice-cooker'],
    steps: [
      'Cook rice in rice cooker.',
      'Open sardines can.',
      'Place sardines in microwave-safe bowl.',
      'Add garlic and soy sauce.',
      'Microwave 2 minutes.',
      'Mix into rice and eat.'
    ],
    cookingTime: '5 mins', estimatedCost: '₱20–₱30', category: 'Lunch', image: 'microrice.jpg'
  },
  // ── 35 ──
  {
    id: 35, name: 'Talong Omelette (Tortang Talong)',
    ingredients: ['Talong (Eggplant)', 'Egg', 'Garlic', 'Onion', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan', 'electric-stove', 'oven-toaster'],
    steps: [
      'Roast eggplant directly on flame or oven toaster until charred.',
      'Peel off burnt skin, keep stem.',
      'Flatten with fork.',
      'Beat egg with garlic, onion, salt, pepper.',
      'Dip eggplant into egg mixture.',
      'Fry in oil until golden on both sides.',
      'Serve with banana catsup.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱20–₱35', category: 'Breakfast', image: 'talong omellete.webp'
  },
  // ── 37 ──
  {
    id: 37, name: 'Pork Sinigang (Simple)',
    ingredients: ['Pork', 'Tomato', 'Onion', 'Kangkong', 'Sitaw (String Beans)', 'Salt', 'Calamansi'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil pork with onion and tomato in 5 cups water.',
      'Simmer 25 minutes until pork is tender.',
      'Add sitaw and cook 3 mins.',
      'Add kangkong, season with salt.',
      'Squeeze calamansi for sourness.',
      'Serve hot with rice.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱90–₱120', category: 'Dinner', image: 'pork sinigang.jpg'
  },
  // ── 38 ──
  {
    id: 38, name: 'Monggo (Simple)',
    ingredients: ['Garlic', 'Onion', 'Tomato', 'Cooking Oil', 'Fish Sauce (Patis)', 'Sardines (canned)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Heat oil, sauté garlic, onion, tomato.',
      'Add sardines (without liquid).',
      'Pour 3 cups water, bring to boil.',
      'Simmer 5 minutes.',
      'Season with patis.',
      'Serve over rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱25–₱40', category: 'Dinner', image: 'Monggo.jpg'
  },
  // ── 39 ──
  {
    id: 39, name: 'Hotdog and Egg Fry',
    ingredients: ['Hotdog', 'Egg', 'Cooking Oil', 'Salt', 'Ketchup'],
    tools: ['frying-pan'],
    steps: [
      'Slice hotdogs diagonally.',
      'Fry in oil until charred on the outside.',
      'Remove and fry eggs in same pan.',
      'Plate together, season with salt.',
      'Drizzle ketchup and serve with rice.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱22–₱35', category: 'Breakfast', image: 'hotegg.jpg'
  },
  // ── 40 ──
  {
    id: 40, name: 'Creamy Tuna Pasta (Instant Noodle Hack)',
    ingredients: ['Instant Noodles', 'Tuna (canned)', 'Evaporated Milk', 'Onion', 'Garlic', 'Cooking Oil', 'Salt', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Cook noodles without seasoning, drain.',
      'Sauté garlic and onion, add tuna.',
      'Pour evaporated milk, simmer 2 minutes.',
      'Season with salt and pepper.',
      'Toss in noodles and coat well.',
      'Serve hot.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱28–₱40', category: 'Lunch', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80'
  },
  // ── 41 ──
  {
    id: 41, name: 'Ampalaya with Egg',
    ingredients: ['Ampalaya (Bitter Melon)', 'Egg', 'Garlic', 'Onion', 'Salt', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Slice ampalaya thinly, rub with salt, squeeze out liquid.',
      'Sauté garlic and onion.',
      'Add ampalaya, cook 3 minutes.',
      'Beat eggs and pour over ampalaya.',
      'Stir until egg sets.',
      'Serve with rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱20–₱30', category: 'Lunch', image: 'ampaegg.jpg'
  },
  // ── 42 ──
  {
    id: 42, name: 'Corned Beef Omelette',
    ingredients: ['Corned Beef (canned)', 'Egg', 'Onion', 'Garlic', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Sauté garlic, onion, add corned beef.',
      'Cook 3 minutes and let cool slightly.',
      'Beat eggs, add corned beef mixture.',
      'Heat oil, pour mixture in pan.',
      'Cook until set, flip, cook other side.',
      'Serve with rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱35–₱50', category: 'Breakfast', image: 'corned omelette.jpg'
  },
  // ── 43 ──
  {
    id: 43, name: 'Potato and Egg Salad',
    ingredients: ['Potato', 'Egg', 'Onion', 'Salt', 'Pepper', 'Margarine / Butter'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil potatoes until fork-tender, peel and cube.',
      'Hard boil eggs, peel and chop.',
      'Mix potato, egg, diced onion.',
      'Add melted butter, salt, and pepper.',
      'Mix gently and serve.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱30–₱45', category: 'Snacks', image: 'potato salad.jpg'
  },
  // ── 44 ──
  {
    id: 44, name: 'Arroz Caldo sa Rice Cooker',
    ingredients: ['Rice', 'Ginger', 'Garlic', 'Fish Sauce (Patis)', 'Green Onion', 'Salt'],
    tools: ['rice-cooker'],
    steps: [
      'Rinse rice and add to rice cooker.',
      'Add 3x normal water (for porridge).',
      'Add grated ginger, garlic.',
      'Cook on normal setting.',
      'Once done, stir, season with patis.',
      'Serve topped with green onion.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱10–₱20', category: 'Breakfast', image: 'arozcaldo rice cooker.jpg'
  },
  // ── 46 ──
  {
    id: 46, name: 'Pork Adobo Flakes',
    ingredients: ['Pork', 'Soy Sauce', 'Vinegar', 'Garlic', 'Pepper', 'Cooking Oil'],
    tools: ['pot', 'frying-pan', 'electric-stove'],
    steps: [
      'Cook pork adobo until very tender.',
      'Remove pork, shred into small pieces.',
      'Fry shredded pork in oil until crispy.',
      'Mix with remaining sauce.',
      'Serve as topping over garlic rice.'
    ],
    cookingTime: '45 mins', estimatedCost: '₱80–₱110', category: 'Dinner', image: 'pork adobo flakes.webp'
  },
  // ── 47 ──
  {
    id: 47, name: 'Ginataang Kamote',
    ingredients: ['Kamote (Sweet Potato)', 'Coconut Milk (canned)', 'Sugar', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Peel and cube kamote.',
      'Pour coconut milk into pot, add kamote.',
      'Add sugar and a pinch of salt.',
      'Bring to simmer, cook 15 minutes until kamote is tender.',
      'Serve as dessert or snack.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱30–₱45', category: 'Snacks', image: 'ginataang kamote.jpg'
  },
  // ── 48 ──
  {
    id: 48, name: 'Sautéed Squid Balls',
    ingredients: ['Squid Ball', 'Garlic', 'Onion', 'Soy Sauce', 'Chili / Siling Labuyo', 'Cooking Oil', 'Calamansi'],
    tools: ['frying-pan'],
    steps: [
      'Skewer or leave squid balls whole.',
      'Fry in oil until golden, set aside.',
      'In same pan, sauté garlic and onion.',
      'Add chili and soy sauce.',
      'Return squid balls, toss.',
      'Squeeze calamansi and serve.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱20–₱35', category: 'Snacks', image: 'sautéed squid balls.jpg'
  },
  // ── 49 ──
  {
    id: 49, name: 'Microwave Corned Beef Bowl',
    ingredients: ['Corned Beef (canned)', 'Onion', 'Egg', 'Rice'],
    tools: ['microwave', 'rice-cooker'],
    steps: [
      'Cook rice in rice cooker.',
      'Place corned beef and diced onion in microwave-safe bowl.',
      'Crack egg on top.',
      'Microwave 2–3 minutes until egg is set.',
      'Mix and serve over rice.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱35–₱50', category: 'Lunch', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80'
  },
  // ── 50 ──
  {
    id: 50, name: 'Ensaladang Kamatis at Sibuyas',
    ingredients: ['Tomato', 'Onion', 'Fish Sauce (Patis)', 'Calamansi', 'Salt', 'Chili / Siling Labuyo'],
    tools: ['knife'],
    steps: [
      'Slice tomatoes and onions thinly.',
      'Combine in a bowl.',
      'Mix patis, calamansi juice, and chili for dressing.',
      'Pour dressing over vegetables.',
      'Toss gently and serve.',
      'Best eaten with fried fish.'
    ],
    cookingTime: '5 mins', estimatedCost: '₱12–₱20', category: 'Snacks', image: 'ensaladang kamatis at sibuyas.jpg'
  },
  // ── 51 ──
  {
    id: 51, name: 'Batchoy Style Noodle Soup',
    ingredients: ['Instant Noodles', 'Pork', 'Garlic', 'Onion', 'Fish Sauce (Patis)', 'Green Onion'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil pork with garlic and onion until tender.',
      'Shred pork, keep broth.',
      'Add noodles to broth, cook 2 minutes.',
      'Add seasoning packet (optional).',
      'Top with pork and green onion.',
      'Drizzle patis and serve.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱50–₱75', category: 'Dinner', image: 'batchoy style noodels soup.webp'
  },
  // ── 52 ──
  {
    id: 52, name: 'Peanut Butter Rice (Filipino Style)',
    ingredients: ['Rice', 'Peanut Butter', 'Soy Sauce', 'Garlic', 'Onion', 'Cooking Oil'],
    tools: ['frying-pan', 'rice-cooker'],
    steps: [
      'Cook rice.',
      'Sauté garlic and onion.',
      'Mix peanut butter with warm water to loosen.',
      'Add soy sauce and simmer sauce 2 minutes.',
      'Pour sauce over rice.',
      'Serve as an affordable and filling meal.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱18–₱28', category: 'Lunch', image: 'peanut butter rice.webp'
  },
  // ── 53 ──
  {
    id: 53, name: 'Instant Noodle Upgrade (Carbonara Style)',
    ingredients: ['Instant Noodles', 'Egg', 'Evaporated Milk', 'Garlic', 'Margarine / Butter'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Cook noodles, drain but reserve 2 tbsp water.',
      'Melt butter, sauté garlic.',
      'Beat egg with evaporated milk.',
      'Remove pan from heat, add noodles.',
      'Pour egg-milk mixture and toss quickly so egg doesn\'t curdle.',
      'Serve immediately.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱18–₱28', category: 'Lunch', image: 'instant noodle upgrade.jpg'
  },
  // ── 54 ──
  {
    id: 54, name: 'Monggo at Dilis (Canned Sardines Substitute)',
    ingredients: ['Sardines (canned)', 'Garlic', 'Onion', 'Tomato', 'Kangkong', 'Fish Sauce (Patis)', 'Cooking Oil'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, onion, tomato.',
      'Add sardines (mashed).',
      'Pour 2 cups water, simmer 10 minutes.',
      'Add kangkong, stir.',
      'Season with patis.',
      'Serve hot over rice.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱28–₱40', category: 'Dinner', image: 'monggo at dilis.webp'
  },
  // ── 55 ──
  {
    id: 55, name: 'Chicken Adobo sa Rice Cooker',
    ingredients: ['Chicken', 'Soy Sauce', 'Vinegar', 'Garlic', 'Pepper'],
    tools: ['rice-cooker'],
    steps: [
      'Place chicken in rice cooker.',
      'Add soy sauce, vinegar, garlic, and pepper.',
      'Mix to coat.',
      'Turn on rice cooker (cook setting).',
      'Let it cycle twice for thorough cooking.',
      'Serve with steamed rice.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱75–₱100', category: 'Dinner', image: 'chicken adobo rice cooker.webp'
  },
  // ── 56 ──
  {
    id: 56, name: 'Champorado',
    ingredients: ['Rice', 'Condensed Milk', 'Sugar', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Cook rice with extra water until thick and soft.',
      'Add sugar and a pinch of salt.',
      'Stir until combined (add cocoa powder if available).',
      'Serve in bowl.',
      'Drizzle condensed milk on top.',
      'Eat as breakfast or snack.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱15–₱25', category: 'Breakfast', image: 'champorado.jpg'
  },
  // ── 57 ──
  {
    id: 57, name: 'Sinigang na Sardinas',
    ingredients: ['Sardines (canned)', 'Tomato', 'Onion', 'Kangkong', 'Sitaw (String Beans)', 'Calamansi', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Pour sardines with sauce into pot, add 3 cups water.',
      'Add tomato, onion.',
      'Bring to boil, simmer 5 minutes.',
      'Add sitaw and kangkong.',
      'Squeeze calamansi generously.',
      'Season with salt and serve.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱25–₱40', category: 'Dinner', image: 'Sinigang Sardinas.jpg'
  },
  // ── 58 ──
  {
    id: 58, name: 'Sautéed Pork with Tomato',
    ingredients: ['Pork', 'Tomato', 'Garlic', 'Onion', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Slice pork thinly.',
      'Sauté garlic, onion, tomato.',
      'Add pork slices, cook until browned.',
      'Add soy sauce, toss.',
      'Simmer 5 minutes.',
      'Serve with rice.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱60–₱80', category: 'Dinner', image: 'sautéed pork with tomato.jpg'
  },
  // ── 59 ──
  {
    id: 59, name: 'Milanesa Bread (Simple Breaded Pork)',
    ingredients: ['Pork', 'Egg', 'Bread Crumbs', 'Garlic', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Pound pork slices thin.',
      'Season with garlic, salt, and pepper.',
      'Dip in beaten egg, then breadcrumbs.',
      'Fry in hot oil until golden brown on both sides.',
      'Drain on paper towel.',
      'Serve with rice and ketchup.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱60–₱85', category: 'Dinner', image: 'milanesa bread.jpeg'
  },
  // ── 60 ──
  {
    id: 60, name: 'Chicken Tinola Lugaw',
    ingredients: ['Rice', 'Chicken', 'Ginger', 'Garlic', 'Onion', 'Sayote', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, ginger, onion with chicken.',
      'Add rice and 6 cups water.',
      'Cook until rice breaks down into porridge.',
      'Add sayote, cook 5 more minutes.',
      'Season with patis.',
      'Serve hot.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱65–₱90', category: 'Dinner', image: 'chicken tinola lugaw.jpg'
  },
  // ── 61 ──
  {
    id: 61, name: 'Ginisang Togue (Bean Sprout Stir-fry)',
    ingredients: ['Garlic', 'Onion', 'Carrot', 'Soy Sauce', 'Cooking Oil', 'Salt'],
    tools: ['frying-pan'],
    steps: [
      'Heat oil, sauté garlic and onion.',
      'Add julienned carrot, cook 2 minutes.',
      'Add soy sauce and toss.',
      'Season with salt.',
      'Cook 2 more minutes.',
      'Serve with rice.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱15–₱25', category: 'Lunch', image: 'ginisang togue.jpg'
  },
  // ── 63 ──
  {
    id: 63, name: 'Arroz con Leche',
    ingredients: ['Rice', 'Condensed Milk', 'Evaporated Milk', 'Sugar', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Cook rice in 3 cups water until very soft.',
      'Pour evaporated milk, stir.',
      'Add condensed milk and sugar to taste.',
      'Cook on low heat until thick and creamy.',
      'Serve warm or chilled.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱30–₱45', category: 'Snacks', image: 'arroz con leche.jpg'
  },
  // ── 64 ──
  {
    id: 64, name: 'Inihaw na Bangus (Oven Toaster)',
    ingredients: ['Bangus (Milkfish)', 'Tomato', 'Onion', 'Garlic', 'Salt', 'Pepper', 'Calamansi'],
    tools: ['oven-toaster', 'knife'],
    steps: [
      'Open butterfly the bangus.',
      'Stuff with sliced tomato, onion, garlic.',
      'Season with salt, pepper, calamansi juice.',
      'Wrap in foil.',
      'Bake in oven toaster at 200°C for 20–25 minutes.',
      'Serve with rice and spiced vinegar.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱60–₱85', category: 'Dinner', image: 'inihaw na bangus.jpg'
  },
  // ── 65 ──
  {
    id: 65, name: 'Pork Pochero (Budget)',
    ingredients: ['Pork', 'Potato', 'Tomato', 'Onion', 'Garlic', 'Banana Catsup', 'Cooking Oil', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, onion, tomato.',
      'Add pork, brown on all sides.',
      'Pour 3 cups water, simmer 20 minutes.',
      'Add potato cubes, cook 10 minutes.',
      'Add banana catsup and season.',
      'Simmer until sauce thickens.'
    ],
    cookingTime: '40 mins', estimatedCost: '₱85–₱110', category: 'Dinner', image: 'pork pochero.webp'
  },
  // ── 66 ──
  {
    id: 66, name: 'Buttered Corn and Rice',
    ingredients: ['Rice', 'Margarine / Butter', 'Salt', 'Mushroom (canned)'],
    tools: ['rice-cooker', 'frying-pan'],
    steps: [
      'Cook rice.',
      'Drain canned mushrooms, slice.',
      'Melt butter in pan, sauté mushrooms.',
      'Season with salt.',
      'Pour over rice and mix.',
      'Serve as simple lunch.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱28–₱40', category: 'Lunch', image: 'buttered corn and rice.wepb'
  },
  // ── 67 ──
  {
    id: 67, name: 'Ginisang Sayote with Pork',
    ingredients: ['Sayote', 'Garlic', 'Onion', 'Pork', 'Fish Sauce (Patis)', 'Cooking Oil'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Peel and slice sayote thinly.',
      'Sauté garlic and onion.',
      'Add pork strips, cook until browned.',
      'Add sayote, stir-fry 5 minutes.',
      'Season with patis.',
      'Serve with rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱45–₱65', category: 'Dinner', image: 'ginisang upo.jpg'
  },
  // ── 68 ──
  {
    id: 68, name: 'Spam Sandwich',
    ingredients: ['Spam', 'Bread', 'Margarine / Butter', 'Ketchup', 'Egg'],
    tools: ['frying-pan', 'oven-toaster'],
    steps: [
      'Slice Spam and fry until crispy.',
      'Toast bread in oven toaster.',
      'Fry egg sunny side up.',
      'Spread margarine on toast.',
      'Layer Spam, egg, and ketchup.',
      'Close sandwich and serve.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱45–₱65', category: 'Breakfast', image: 'spam sandwich.jpg'
  },
  // ── 69 ──
  {
    id: 69, name: 'Oatmeal with Condensed Milk',
    ingredients: ['Instant Oatmeal', 'Condensed Milk', 'Sugar', 'Salt'],
    tools: ['microwave', 'kettle', 'pot'],
    steps: [
      'Boil water in kettle or pot.',
      'Place oatmeal in bowl.',
      'Pour hot water and stir.',
      'Let sit 2 minutes.',
      'Add condensed milk and a pinch of salt.',
      'Eat as breakfast.'
    ],
    cookingTime: '5 mins', estimatedCost: '₱15–₱22', category: 'Breakfast', image: 'oatmeal with condensed milk.jpg'
  },
  // ── 70 ──
  {
    id: 70, name: 'Sautéed Mushroom on Toast',
    ingredients: ['Mushroom (canned)', 'Bread', 'Garlic', 'Margarine / Butter', 'Salt', 'Pepper'],
    tools: ['frying-pan', 'oven-toaster'],
    steps: [
      'Drain and slice canned mushrooms.',
      'Melt butter, sauté garlic.',
      'Add mushrooms, cook until slightly browned.',
      'Season with salt and pepper.',
      'Toast bread, pile mushrooms on top.',
      'Serve as snack or meal.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱28–₱40', category: 'Snacks', image: 'Sautéed Mushroom on Toast.jpg'
  },
  // ── 71 ──
  {
    id: 71, name: 'Pork Menudo (Budget Version)',
    ingredients: ['Pork', 'Potato', 'Carrot', 'Tomato Sauce (canned)', 'Garlic', 'Onion', 'Cooking Oil', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic and onion.',
      'Add pork, cook until brown.',
      'Add potato and carrot cubes.',
      'Pour tomato sauce and ½ cup water.',
      'Simmer 20 minutes until vegetables are tender.',
      'Season with salt and serve.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱90–₱120', category: 'Dinner', image: 'pork menudo.jpg'
  },
  // ── 72 ──
  {
    id: 72, name: 'Ginataang Mais (Sweet Corn Pudding)',
    ingredients: ['Coconut Milk (canned)', 'Sugar', 'Rice', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Combine coconut milk, a cup of water, and rice in pot.',
      'Cook over medium heat, stirring often.',
      'Add sugar and salt.',
      'Cook until rice is tender and mixture is creamy.',
      'Serve as dessert or merienda.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱28–₱38', category: 'Snacks', image: 'ginataang mais.jpg'
  },
  // ── 73 ──
  {
    id: 73, name: 'Bulalo Style Soup (No Bones)',
    ingredients: ['Pork', 'Potato', 'Cabbage', 'Onion', 'Garlic', 'Salt', 'Pepper', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil pork with onion in 5 cups water.',
      'Simmer 25 minutes until tender.',
      'Add potato, cook 10 minutes.',
      'Add cabbage, season with patis and pepper.',
      'Cook 3 more minutes.',
      'Serve hot.'
    ],
    cookingTime: '40 mins', estimatedCost: '₱80–₱110', category: 'Dinner', image: 'bulalo style soup.jpg'
  },
  // ── 74 ──
  {
    id: 74, name: 'Pork Igado Style (Liver-free)',
    ingredients: ['Pork', 'Soy Sauce', 'Vinegar', 'Garlic', 'Onion', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Cut pork into strips.',
      'Sauté garlic and onion.',
      'Add pork, cook until brown.',
      'Add soy sauce, vinegar, and pepper.',
      'Simmer 15 minutes until sauce thickens.',
      'Serve over rice.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'pork igado style.jpg'
  },
  // ── 75 ──
  {
    id: 75, name: 'Chili Garlic Fried Egg',
    ingredients: ['Egg', 'Garlic', 'Chili / Siling Labuyo', 'Cooking Oil', 'Soy Sauce'],
    tools: ['frying-pan'],
    steps: [
      'Heat generous oil in pan.',
      'Add sliced garlic and chili, fry until crispy.',
      'Push aside, crack egg in hot oil.',
      'Baste egg with hot oil using a spoon.',
      'Drizzle soy sauce.',
      'Serve on rice.'
    ],
    cookingTime: '6 mins', estimatedCost: '₱10–₱18', category: 'Breakfast', image: 'chili garlic fried ggg.jpg'
  },
  // ── 76 ──
  {
    id: 76, name: 'Instant Noodle Stir-fry',
    ingredients: ['Instant Noodles', 'Egg', 'Cabbage', 'Garlic', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Soak noodles briefly in boiled water, drain.',
      'Heat oil, fry garlic.',
      'Add cabbage, stir-fry.',
      'Scramble in the egg.',
      'Add noodles and soy sauce.',
      'Toss everything together and serve dry.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱15–₱22', category: 'Lunch', image: 'instant noodle Stir fry.jpg'
  },
  // ── 77 ──
  {
    id: 77, name: 'Pork Sauté with Oyster Sauce',
    ingredients: ['Pork', 'Oyster Sauce', 'Garlic', 'Onion', 'Cooking Oil', 'Soy Sauce'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Slice pork thinly.',
      'Sauté garlic and onion.',
      'Add pork, cook until browned.',
      'Add oyster sauce and soy sauce.',
      'Stir-fry on high heat 3 minutes.',
      'Serve over rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱70–₱90', category: 'Dinner', image: 'pork sauté with pyster sauce.jpg'
  },
  // ── 78 ──
  {
    id: 78, name: 'Canned Mushroom with Egg',
    ingredients: ['Mushroom (canned)', 'Egg', 'Garlic', 'Onion', 'Oyster Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Drain mushrooms.',
      'Sauté garlic and onion.',
      'Add mushrooms, cook 3 minutes.',
      'Add oyster sauce, mix.',
      'Crack eggs, scramble into mushroom mixture.',
      'Serve hot.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱25–₱38', category: 'Lunch', image: 'canned mushroom with egg.jpg'
  },
  // ── 79 ──
  {
    id: 79, name: 'Tomato Salad (Chilled Tomato Salad)',
    ingredients: ['Tomato', 'Onion', 'Garlic', 'Fish Sauce (Patis)', 'Calamansi', 'Chili / Siling Labuyo'],
    tools: ['knife'],
    steps: [
      'Dice tomatoes and onions.',
      'Mince garlic and chili.',
      'Mix all vegetables in bowl.',
      'Dress with patis and calamansi juice.',
      'Toss and chill 5 minutes.',
      'Serve as sawsawan or side dish.'
    ],
    cookingTime: '5 mins', estimatedCost: '₱12–₱22', category: 'Snacks', image: 'tomato salad.jpg'
  },
  // ── 80 ──
  {
    id: 80, name: 'Bread Pudding (Dorm Style)',
    ingredients: ['Bread', 'Egg', 'Condensed Milk', 'Evaporated Milk', 'Margarine / Butter', 'Sugar'],
    tools: ['oven-toaster', 'microwave'],
    steps: [
      'Tear bread into chunks in baking dish.',
      'Beat eggs with condensed and evaporated milk.',
      'Pour over bread, let soak 5 minutes.',
      'Dot with butter and sprinkle sugar.',
      'Bake in oven toaster at 180°C for 20 minutes until set.',
      'Serve warm.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱30–₱45', category: 'Snacks', image: 'bread pudding.jpg'
  },
  // ── 81 ──
  {
    id: 81, name: 'Ginisang Sayote with Egg',
    ingredients: ['Sayote', 'Egg', 'Garlic', 'Onion', 'Cooking Oil', 'Salt', 'Pepper'],
    tools: ['frying-pan'],
    steps: [
      'Peel and slice sayote thinly.',
      'Sauté garlic and onion.',
      'Add sayote, cook 5 minutes.',
      'Pour beaten egg over sayote.',
      'Scramble gently, season.',
      'Serve with rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱18–₱28', category: 'Lunch', image: 'ginisang sayote with egg.jpg'
  },
  // ── 82 ──
  {
    id: 82, name: 'Nilagang Manok',
    ingredients: ['Chicken', 'Potato', 'Cabbage', 'Onion', 'Salt', 'Pepper', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil chicken with onion in 5 cups water.',
      'Simmer 20 minutes.',
      'Add potato cubes, cook 10 minutes.',
      'Add cabbage.',
      'Season with patis and pepper.',
      'Serve hot.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱80–₱105', category: 'Dinner', image: 'Nilagang Manok.jpg'
  },
  // ── 83 ──
  {
    id: 83, name: 'Crispy Tuna Patties',
    ingredients: ['Tuna (canned)', 'Egg', 'Onion', 'Garlic', 'Flour', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Drain tuna and mash.',
      'Mix with beaten egg, minced onion, garlic, flour, salt, and pepper.',
      'Form into small patties.',
      'Fry in oil until golden on both sides.',
      'Serve with ketchup and rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱30–₱45', category: 'Lunch', image: 'crispy tuna patties.jpg'
  },
  // ── 84 ──
  {
    id: 84, name: 'Chicken Inasal Style (Frying Pan)',
    ingredients: ['Chicken', 'Garlic', 'Onion', 'Calamansi', 'Cooking Oil', 'Salt', 'Pepper', 'Vinegar'],
    tools: ['frying-pan'],
    steps: [
      'Marinate chicken in calamansi, vinegar, garlic, salt, pepper for 20 minutes.',
      'Heat oil in pan.',
      'Fry chicken on medium heat, covered, 10 minutes each side.',
      'Brush with oil halfway.',
      'Cook until fully done and slightly charred.',
      'Serve with rice and spiced vinegar.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱75–₱100', category: 'Dinner', image: 'chicken inasal style.jpg'
  },
  // ── 85 ──
  {
    id: 85, name: 'Sinigang na Tuna',
    ingredients: ['Tuna (canned)', 'Tomato', 'Onion', 'Kangkong', 'Salt', 'Fish Sauce (Patis)', 'Calamansi'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Pour 3 cups water into pot.',
      'Add tomato and onion, boil.',
      'Add tuna (with oil).',
      'Squeeze calamansi generously for sourness.',
      'Add kangkong.',
      'Season with patis and salt.',
      'Serve with rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱28–₱42', category: 'Dinner', image: 'sinigang na tuna.jpg'
  },
  // ── 87 ──
  {
    id: 87, name: 'Chicken Afritada (Simple)',
    ingredients: ['Chicken', 'Tomato Sauce (canned)', 'Potato', 'Carrot', 'Garlic', 'Onion', 'Cooking Oil'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic and onion.',
      'Brown chicken pieces.',
      'Add tomato sauce and ½ cup water.',
      'Simmer 15 minutes.',
      'Add potato and carrot, cook 10 more minutes.',
      'Season with salt and serve.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱85–₱110', category: 'Dinner', image: 'chicken afritada.jpg'
  },
  // ── 88 ──
  {
    id: 88, name: 'Steamed Rice Cooker Chicken',
    ingredients: ['Chicken', 'Ginger', 'Garlic', 'Soy Sauce', 'Salt', 'Pepper'],
    tools: ['rice-cooker'],
    steps: [
      'Season chicken with soy sauce, garlic, ginger, salt, pepper.',
      'Marinate 15 minutes.',
      'Place in rice cooker, no water needed.',
      'Cook on cook setting.',
      'Turn once halfway.',
      'Serve with rice and sauce from pot.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'steamed rice cooker chicken.jpg'
  },
  // ── 89 ──
  {
    id: 89, name: 'Pork Binagoongan (Simple)',
    ingredients: ['Pork', 'Garlic', 'Onion', 'Tomato', 'Vinegar', 'Cooking Oil', 'Chili / Siling Labuyo'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Boil pork until tender, then fry until crispy.',
      'Sauté garlic, onion, tomato, chili.',
      'Add vinegar (substitute for bagoong).',
      'Add fried pork, toss.',
      'Simmer 5 minutes.',
      'Serve with rice.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱75–₱100', category: 'Dinner', image: 'pork binagoongan.jpg'
  },
  // ── 90 ──
  {
    id: 90, name: 'Egg Drop Soup',
    ingredients: ['Egg', 'Green Onion', 'Garlic', 'Soy Sauce', 'Salt', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil 3 cups water in pot.',
      'Add garlic, soy sauce, salt, and pepper.',
      'Beat eggs separately.',
      'Pour beaten eggs slowly into boiling soup while stirring.',
      'Add green onion.',
      'Serve immediately.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱12–₱20', category: 'Dinner', image: 'egg drop soup.jpg'
  },
  // ── 91 ──
  {
    id: 91, name: 'Turon Style Kamote (Oven Version)',
    ingredients: ['Kamote (Sweet Potato)', 'Sugar', 'Flour', 'Cooking Oil'],
    tools: ['frying-pan', 'oven-toaster'],
    steps: [
      'Slice kamote into strips.',
      'Roll in sugar.',
      'Mix flour with water to make batter.',
      'Dip kamote in batter.',
      'Fry in oil until golden.',
      'Serve as merienda.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱15–₱25', category: 'Snacks', image: 'turon.webp'
  },
  // ── 92 ──
  {
    id: 92, name: 'Coconut Milk Rice',
    ingredients: ['Rice', 'Coconut Milk (canned)', 'Salt', 'Garlic', 'Onion'],
    tools: ['rice-cooker', 'pot'],
    steps: [
      'Wash rice, place in pot.',
      'Mix coconut milk with water (half and half) to cover rice.',
      'Add salt, garlic, onion.',
      'Cook until rice absorbs all liquid.',
      'Fluff with fork.',
      'Serve as flavored rice.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱25–₱35', category: 'Lunch', image: 'coconut milk rice.webp'
  },
  // ── 93 ──
  {
    id: 93, name: 'Bangus Sisig (Budget)',
    ingredients: ['Bangus (Milkfish)', 'Onion', 'Garlic', 'Calamansi', 'Chili / Siling Labuyo', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan', 'oven-toaster'],
    steps: [
      'Fry or grill bangus until fully cooked.',
      'Remove flesh, discard skin and bones.',
      'Chop fish flesh finely.',
      'Mix with diced onion, garlic, chili.',
      'Season with calamansi, salt, pepper.',
      'Serve sizzling on hot pan or plate.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱60–₱85', category: 'Dinner', image: 'bangus sisig.jpg'
  },
  // ── 94 ──
  {
    id: 94, name: 'Simple Chicken Congee (Microwave)',
    ingredients: ['Rice', 'Chicken', 'Ginger', 'Salt', 'Green Onion'],
    tools: ['microwave'],
    steps: [
      'Mix cooked rice with water in large microwave-safe bowl (1:3 ratio).',
      'Add chicken strips and grated ginger.',
      'Microwave 5 minutes, stir.',
      'Microwave 3 more minutes.',
      'Season with salt.',
      'Top with green onion and serve.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱35–₱55', category: 'Breakfast', image: 'simple chicken congee.jpg'
  },
  // ── 95 ──
  {
    id: 95, name: 'Pork Tocino Style (Homemade)',
    ingredients: ['Pork', 'Sugar', 'Salt', 'Garlic', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Slice pork thinly.',
      'Marinate in sugar, salt, garlic, and soy sauce overnight (or at least 1 hour).',
      'Cook in a little water first until water evaporates.',
      'Fry in own fat until caramelized.',
      'Serve with garlic rice and egg.'
    ],
    cookingTime: '20 mins (+ marinating)', estimatedCost: '₱60–₱80', category: 'Breakfast', image: 'pork tocino style.webp'
  },
  // ── 96 ──
  {
    id: 96, name: 'Ginataang Bilo-Bilo (Simple)',
    ingredients: ['Condensed Milk', 'Coconut Milk (canned)', 'Kamote (Sweet Potato)', 'Sugar', 'Flour'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Mix flour with water to form dough, shape into small balls (bilo-bilo).',
      'Cube kamote.',
      'Bring coconut milk to boil.',
      'Add kamote and bilo-bilo.',
      'Cook until kamote is soft and balls float.',
      'Add condensed milk and sugar.',
      'Serve warm or cold.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱35–₱50', category: 'Snacks', image: 'ginataang bilo bilo.jpg'
  },
  // ── 97 ──
  {
    id: 97, name: 'Nilagang Sitaw at Corned Beef',
    ingredients: ['Sitaw (String Beans)', 'Corned Beef (canned)', 'Onion', 'Garlic', 'Salt', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil 2 cups water in pot.',
      'Add onion and garlic.',
      'Add sitaw, cook 5 minutes.',
      'Add corned beef, break apart.',
      'Simmer 3 minutes.',
      'Season and serve.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱40–₱55', category: 'Lunch', image: 'nilagang sitaw at corned beef.jpg'
  },
  // ── 98 ──
  {
    id: 98, name: 'Pork and Potato Hash',
    ingredients: ['Pork', 'Potato', 'Onion', 'Garlic', 'Soy Sauce', 'Cooking Oil', 'Salt', 'Pepper'],
    tools: ['frying-pan'],
    steps: [
      'Dice pork and potato into small cubes.',
      'Boil potato briefly (3 mins), drain.',
      'Fry pork until browned.',
      'Add onion and garlic, sauté.',
      'Add potato, fry until golden.',
      'Season with soy sauce, salt, pepper.',
      'Serve with fried egg and rice.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱65–₱85', category: 'Dinner', image: 'pork and potato hash.jpg'
  },
  // ── 99 ──
  {
    id: 99, name: 'Egg in Coconut Milk',
    ingredients: ['Egg', 'Coconut Milk (canned)', 'Garlic', 'Salt', 'Chili / Siling Labuyo'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Heat coconut milk in pan over medium.',
      'Add garlic and chili.',
      'Crack eggs directly into the simmering coconut milk.',
      'Cover and cook until eggs are set.',
      'Season with salt.',
      'Serve over rice.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱22–₱35', category: 'Breakfast', image: 'egg coconut.jpg'
  },
  // ── 100 ──
  {
    id: 100, name: 'Filipino French Toast (Monay Toast)',
    ingredients: ['Bread', 'Egg', 'Evaporated Milk', 'Sugar', 'Margarine / Butter', 'Banana Catsup'],
    tools: ['frying-pan'],
    steps: [
      'Beat egg with evaporated milk and a pinch of sugar.',
      'Dip bread slices in the mixture, coating both sides.',
      'Melt butter in pan over medium heat.',
      'Fry soaked bread until golden on both sides.',
      'Serve with banana catsup or condensed milk.',
      'Enjoy as merienda or breakfast.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱15–₱25', category: 'Breakfast', image: 'filipino french toast.jpg'
  },
  // ── 101 ──
  {
    id: 101, name: 'Sinigang na Baboy',
    ingredients: ['Pork', 'Tamarind', 'Tomato', 'Onion', 'Radish', 'Talong (Eggplant)', 'Kangkong', 'Fish Sauce (Patis)', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil pork ribs or belly in 6 cups water with onion and tomato.',
      'Simmer 25–30 minutes until pork is tender.',
      'Add tamarind (fresh boiled and strained, or sinigang mix) for sourness.',
      'Add radish slices, cook 5 minutes.',
      'Add eggplant, cook 3 minutes.',
      'Add kangkong last, season with patis and salt.',
      'Serve hot with steamed rice.'
    ],
    cookingTime: '45 mins', estimatedCost: '₱95–₱130', category: 'Dinner', image: 'pork sinigang.jpg'
  },
// ── 102 ──
  {
    id: 102, name: 'Sinabawang Isda',
    ingredients: ['Tilapia', 'Ginger', 'Tomato', 'Onion', 'Kangkong', 'Fish Sauce (Patis)', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil 4 cups water in pot.',
      'Add ginger, onion, and tomato.',
      'Add tilapia pieces, simmer 10 minutes.',
      'Add kangkong.',
      'Season with patis and salt.',
      'Serve hot with steamed rice.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱55–₱75', category: 'Dinner', image: 'sinabawang isda.jpg'
  },
  // ── 103 ──
  {
    id: 103, name: 'Pinakbet',
    ingredients: ['Sitaw (String Beans)', 'Ampalaya (Bitter Melon)', 'Talong (Eggplant)', 'Garlic', 'Onion', 'Tomato', 'Cooking Oil', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, onion, and tomato in oil.',
      'Add all vegetables and toss.',
      'Season with patis.',
      'Add ¼ cup water, cover and cook 10 minutes.',
      'Do not over-stir to keep vegetables intact.',
      'Serve with rice.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱45–₱65', category: 'Lunch', image: 'pinakbet.jpg'
  },
  // ── 104 ──
  {
    id: 104, name: 'Chopsuey',
    ingredients: ['Cabbage', 'Carrot', 'Sitaw (String Beans)', 'Egg', 'Garlic', 'Onion', 'Oyster Sauce', 'Cooking Oil'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Heat oil, sauté garlic and onion.',
      'Add carrot and sitaw, stir-fry 3 minutes.',
      'Add cabbage and toss.',
      'Add oyster sauce and ¼ cup water.',
      'Crack egg in center and scramble into veggies.',
      'Season with salt, serve with rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱35–₱55', category: 'Lunch', image: 'chopsuey.jpg'
  },
  // ── 105 ──
  {
    id: 105, name: 'Paksiw na Isda',
    ingredients: ['Bangus (Milkfish)', 'Vinegar', 'Garlic', 'Ginger', 'Salt', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Place fish in pot.',
      'Add vinegar, garlic, ginger, salt, and pepper.',
      'Add ½ cup water.',
      'Bring to boil without stirring.',
      'Simmer 15 minutes until fish is cooked.',
      'Serve with rice.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱55–₱75', category: 'Lunch', image: 'paksiw na isda.jpg'
  },
  // ── 106 ──
  {
    id: 106, name: 'Daing na Bangus',
    ingredients: ['Bangus (Milkfish)', 'Vinegar', 'Garlic', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Butterfly the bangus, marinate in vinegar, garlic, salt, pepper overnight or 1 hour.',
      'Heat generous oil in pan.',
      'Fry bangus belly-side down first until golden.',
      'Flip and fry other side.',
      'Serve with garlic rice, egg, and tomatoes.'
    ],
    cookingTime: '20 mins (+ marinating)', estimatedCost: '₱60–₱85', category: 'Breakfast', image: 'daing na bangus.jpg'
  },
  // ── 107 ──
  {
    id: 107, name: 'Menudo sa Lata',
    ingredients: ['Corned Beef (canned)', 'Potato', 'Carrot', 'Tomato Sauce (canned)', 'Garlic', 'Onion', 'Cooking Oil'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Sauté garlic and onion in oil.',
      'Add diced potato and carrot, cook 5 minutes.',
      'Add corned beef, break apart and mix.',
      'Pour tomato sauce, simmer 8 minutes.',
      'Season with salt and pepper.',
      'Serve with rice.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱55–₱75', category: 'Lunch', image: 'menudo sa lata.jpg'
  },
  // ── 108 ──
  {
    id: 108, name: 'Canned Tuna with Sayote',
    ingredients: ['Tuna (canned)', 'Sayote', 'Garlic', 'Onion', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Peel and slice sayote into thin strips.',
      'Sauté garlic and onion.',
      'Add sayote, cook 4 minutes.',
      'Add drained tuna and soy sauce.',
      'Stir and cook 3 more minutes.',
      'Serve over rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱30–₱45', category: 'Lunch', image: 'tuna sayote.jpg'
  },
  // ── 109 ──
  {
    id: 109, name: 'Sizzling Tofu Style Egg',
    ingredients: ['Egg', 'Soy Sauce', 'Calamansi', 'Chili / Siling Labuyo', 'Onion', 'Cooking Oil', 'Margarine / Butter'],
    tools: ['frying-pan'],
    steps: [
      'Melt butter in pan until very hot.',
      'Fry eggs sunny-side up.',
      'Meanwhile mix soy sauce, calamansi, chili, minced onion.',
      'Pour sauce over eggs in hot pan.',
      'It will sizzle dramatically — serve immediately.',
      'Eat with rice.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱12–₱22', category: 'Breakfast', image: 'sizzling tofu egg.jpg'
  },
  // ── 110 ──
  {
    id: 110, name: 'Pork Nilaga',
    ingredients: ['Pork', 'Potato', 'Cabbage', 'Onion', 'Garlic', 'Salt', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil pork with onion and garlic in 5 cups water.',
      'Simmer 25 minutes until tender.',
      'Add potato, cook 10 minutes.',
      'Add cabbage, season with salt and pepper.',
      'Simmer 3 more minutes.',
      'Serve hot with rice and patis.'
    ],
    cookingTime: '40 mins', estimatedCost: '₱75–₱100', category: 'Dinner', image: 'pork nilaga.jpg'
  },
  // ── 111 ──
  {
    id: 111, name: 'Scrambled Egg with Sardines',
    ingredients: ['Egg', 'Sardines (canned)', 'Onion', 'Tomato', 'Salt', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Drain most of sardine sauce, mash fish lightly.',
      'Beat eggs in bowl with salt.',
      'Sauté onion and tomato in oil.',
      'Add sardines and stir 1 minute.',
      'Pour eggs over, scramble everything together.',
      'Serve with rice.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱22–₱35', category: 'Breakfast', image: 'scrambled egg sardines.jpg'
  },
  // ── 112 ──
  {
    id: 112, name: 'Ginisang Munggo',
    ingredients: ['Garlic', 'Onion', 'Tomato', 'Kangkong', 'Fish Sauce (Patis)', 'Cooking Oil', 'Sardines (canned)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, onion, and tomato in oil.',
      'Add sardines (mashed slightly).',
      'Pour 3 cups water and bring to boil.',
      'Simmer 10 minutes.',
      'Add kangkong, season with patis.',
      'Serve over rice.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱28–₱42', category: 'Dinner', image: 'ginisang munggo.jpg'
  },
  // ── 113 ──
  {
    id: 113, name: 'Stir-fried Corned Beef with Cabbage',
    ingredients: ['Corned Beef (canned)', 'Cabbage', 'Garlic', 'Onion', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Sauté garlic and onion until soft.',
      'Add corned beef, break apart and cook 3 minutes.',
      'Add shredded cabbage and toss on high heat.',
      'Drizzle soy sauce.',
      'Cook until cabbage is tender.',
      'Serve with rice.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱40–₱55', category: 'Lunch', image: 'corned beef cabbage.jpg'
  },
  // ── 114 ──
  {
    id: 114, name: 'Ginataang Manok',
    ingredients: ['Chicken', 'Coconut Milk (canned)', 'Garlic', 'Ginger', 'Onion', 'Chili / Siling Labuyo', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, ginger, onion.',
      'Add chicken pieces, cook until white.',
      'Pour coconut milk and add chili.',
      'Simmer 20 minutes.',
      'Season with patis.',
      'Cook until sauce thickens slightly.',
      'Serve with rice.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱90–₱120', category: 'Dinner', image: 'ginataang manok.jpg'
  },
  // ── 115 ──
  {
    id: 115, name: 'Spicy Tuna Rice Bowl',
    ingredients: ['Tuna (canned)', 'Rice', 'Chili / Siling Labuyo', 'Garlic', 'Soy Sauce', 'Calamansi', 'Onion'],
    tools: ['frying-pan', 'rice-cooker'],
    steps: [
      'Cook rice.',
      'Drain tuna.',
      'Sauté garlic, onion, and chili.',
      'Add tuna, season with soy sauce and calamansi.',
      'Cook 3 minutes, stirring.',
      'Serve over rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱28–₱40', category: 'Lunch', image: 'spicy tuna rice bowl.jpg'
  },
  // ── 116 ──
  {
    id: 116, name: 'Ginisang Ampalaya with Pork',
    ingredients: ['Ampalaya (Bitter Melon)', 'Pork', 'Garlic', 'Onion', 'Tomato', 'Egg', 'Cooking Oil', 'Salt'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Slice ampalaya, rub with salt, squeeze and rinse.',
      'Sauté garlic, onion, tomato.',
      'Add pork strips, cook until done.',
      'Add ampalaya, stir-fry 4 minutes.',
      'Pour beaten egg, scramble in.',
      'Season and serve.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱55–₱75', category: 'Dinner', image: 'ginisang ampalaya pork.jpg'
  },
  // ── 117 ──
  {
    id: 117, name: 'Tortang Tuna',
    ingredients: ['Tuna (canned)', 'Egg', 'Onion', 'Garlic', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Drain tuna and flake it.',
      'Beat eggs, mix in tuna, diced onion, garlic, salt, pepper.',
      'Heat oil in pan.',
      'Pour half the mixture, cook until set.',
      'Flip carefully, cook other side.',
      'Repeat, serve with rice and ketchup.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱30–₱44', category: 'Lunch', image: 'tortang tuna.jpg'
  },
  // ── 118 ──
  {
    id: 118, name: 'Arroz Caldo (Microwave)',
    ingredients: ['Rice', 'Chicken', 'Ginger', 'Fish Sauce (Patis)', 'Green Onion', 'Salt'],
    tools: ['microwave'],
    steps: [
      'Mix cooked rice with 3 cups water in large microwave-safe bowl.',
      'Add chicken strips and grated ginger.',
      'Microwave 6 minutes, stir.',
      'Microwave 4 more minutes until porridge consistency.',
      'Season with patis and salt.',
      'Top with green onion.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱38–₱55', category: 'Breakfast', image: 'arroz caldo microwave.jpg'
  },
  // ── 119 ──
  {
    id: 119, name: 'Chicken and Potato Stew',
    ingredients: ['Chicken', 'Potato', 'Tomato Sauce (canned)', 'Garlic', 'Onion', 'Cooking Oil', 'Salt', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic and onion.',
      'Brown chicken pieces on all sides.',
      'Add potato cubes and toss.',
      'Pour tomato sauce and ½ cup water.',
      'Simmer 20 minutes until potato is tender.',
      'Season and serve with rice.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱80–₱110', category: 'Dinner', image: 'chicken potato stew.jpg'
  },
  // ── 120 ──
  {
    id: 120, name: 'Itlog na Maalat (Salted Egg) with Tomato',
    ingredients: ['Egg', 'Tomato', 'Onion', 'Calamansi', 'Salt', 'Chili / Siling Labuyo'],
    tools: ['pot', 'knife'],
    steps: [
      'Hard-boil eggs until fully cooked (12 minutes).',
      'Let cool, peel and slice.',
      'Slice tomatoes and onions.',
      'Arrange egg, tomato, and onion on plate.',
      'Squeeze calamansi, add chili and a pinch of salt.',
      'Serve as side dish.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱18–₱28', category: 'Snacks', image: 'itlog salted egg.jpg'
  },
  // ── 121 ──
  {
    id: 121, name: 'Adobong Kangkong',
    ingredients: ['Kangkong', 'Garlic', 'Soy Sauce', 'Vinegar', 'Cooking Oil', 'Pepper'],
    tools: ['frying-pan'],
    steps: [
      'Heat oil and fry garlic until golden.',
      'Add kangkong stems first, then leaves.',
      'Pour soy sauce and vinegar.',
      'Toss quickly over high heat.',
      'Season with pepper.',
      'Serve immediately — do not overcook.'
    ],
    cookingTime: '5 mins', estimatedCost: '₱15–₱22', category: 'Lunch', image: 'adobong kangkong.jpg'
  },
  // ── 122 ──
  {
    id: 122, name: 'Pork Steak Filipino Style',
    ingredients: ['Pork', 'Soy Sauce', 'Calamansi', 'Garlic', 'Onion', 'Cooking Oil', 'Pepper'],
    tools: ['frying-pan'],
    steps: [
      'Marinate pork in soy sauce, calamansi, garlic, pepper for 30 mins.',
      'Heat oil in pan on high.',
      'Sear pork slices until browned on both sides.',
      'Remove pork, sauté onion rings in same pan.',
      'Add marinade to pan and simmer 2 minutes.',
      'Pour sauce over pork and serve.'
    ],
    cookingTime: '20 mins (+ marinating)', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'pork steak.jpg'
  },
  // ── 123 ──
  {
    id: 123, name: 'Ginisang Sitaw at Hipon Style',
    ingredients: ['Sitaw (String Beans)', 'Garlic', 'Onion', 'Tomato', 'Soy Sauce', 'Cooking Oil', 'Salt'],
    tools: ['frying-pan'],
    steps: [
      'Cut sitaw into 2-inch pieces.',
      'Heat oil, sauté garlic, onion, tomato.',
      'Add sitaw, stir-fry 5 minutes.',
      'Season with soy sauce and salt.',
      'Add 2 tbsp water, cover 3 minutes.',
      'Serve with rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱20–₱32', category: 'Lunch', image: 'ginisang sitaw hipon.jpg'
  },
  // ── 124 ──
  {
    id: 124, name: 'Banana Cue',
    ingredients: ['Kamote (Sweet Potato)', 'Sugar', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Use kamote slices as banana substitute.',
      'Heat oil in pan over medium.',
      'Fry kamote until soft, about 5 minutes.',
      'Sprinkle brown sugar liberally over kamote.',
      'Let sugar caramelize and coat the pieces.',
      'Skewer and serve as merienda.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱12–₱20', category: 'Snacks', image: 'banana cue.jpg'
  },
  // ── 125 ──
  {
    id: 125, name: 'Lugaw with Corned Beef',
    ingredients: ['Rice', 'Corned Beef (canned)', 'Ginger', 'Garlic', 'Onion', 'Green Onion', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, ginger, onion.',
      'Add rice and stir 1 minute.',
      'Pour 5 cups water, boil then simmer 25 minutes.',
      'Stir in corned beef, cook 5 more minutes.',
      'Season with salt.',
      'Top with green onion and serve.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱35–₱50', category: 'Breakfast', image: 'lugaw corned beef.jpg'
  },
  // ── 126 ──
  {
    id: 126, name: 'Tokwa at Itlog (Egg & Bean Curd Style)',
    ingredients: ['Egg', 'Soy Sauce', 'Vinegar', 'Garlic', 'Onion', 'Chili / Siling Labuyo', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Hard-boil 3 eggs, peel and halve.',
      'Mix soy sauce, vinegar, minced garlic, onion, chili.',
      'Fry eggs in oil until edges are crispy.',
      'Place in bowl, pour sauce over.',
      'Let sit 2 minutes to absorb.',
      'Serve as side dish.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱15–₱25', category: 'Lunch', image: 'tokwa itlog.jpg'
  },
  // ── 127 ──
  {
    id: 127, name: 'Tuna Sinangag',
    ingredients: ['Rice', 'Tuna (canned)', 'Garlic', 'Onion', 'Soy Sauce', 'Cooking Oil', 'Egg'],
    tools: ['frying-pan'],
    steps: [
      'Fry garlic in oil until golden.',
      'Add onion and sauté.',
      'Add drained tuna, stir-fry 2 minutes.',
      'Add cold rice, press and stir-fry on high.',
      'Drizzle soy sauce, push aside and scramble egg.',
      'Mix all together and serve.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱28–₱40', category: 'Breakfast', image: 'tuna sinangag.jpg'
  },
  // ── 128 ──
  {
    id: 128, name: 'Karekare Style Peanut Vegetable',
    ingredients: ['Sitaw (String Beans)', 'Cabbage', 'Peanut Butter', 'Garlic', 'Onion', 'Cooking Oil', 'Salt', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic and onion in oil.',
      'Add sitaw and cabbage, stir-fry 3 minutes.',
      'Dissolve peanut butter in 1 cup warm water.',
      'Pour peanut sauce over vegetables.',
      'Simmer 5 minutes until thick.',
      'Season with patis and serve over rice.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱35–₱50', category: 'Dinner', image: 'karekare style.jpg'
  },
  // ── 129 ──
  {
    id: 129, name: 'Hotdog Pasta Hack',
    ingredients: ['Instant Noodles', 'Hotdog', 'Tomato Sauce (canned)', 'Garlic', 'Onion', 'Cooking Oil'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Cook noodles without seasoning packet, drain.',
      'Slice hotdogs into coins and fry until charred.',
      'Sauté garlic and onion.',
      'Add tomato sauce, simmer 3 minutes.',
      'Add noodles and hotdog, toss.',
      'Season and serve.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱28–₱40', category: 'Lunch', image: 'hotdog pasta.jpg'
  },
  // ── 130 ──
  {
    id: 130, name: 'Pork Salpicao',
    ingredients: ['Pork', 'Garlic', 'Soy Sauce', 'Oyster Sauce', 'Cooking Oil', 'Pepper'],
    tools: ['frying-pan'],
    steps: [
      'Cube pork into bite-sized pieces.',
      'Marinate in soy sauce, oyster sauce, pepper 15 mins.',
      'Heat oil in pan on very high heat.',
      'Add garlic, fry until golden and crispy.',
      'Add pork, sear quickly until cooked through.',
      'Serve on rice with garlic oil drizzle.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱65–₱88', category: 'Dinner', image: 'pork salpicao.jpg'
  },
  // ── 131 ──
  {
    id: 131, name: 'Ginataang Gulay',
    ingredients: ['Sitaw (String Beans)', 'Ampalaya (Bitter Melon)', 'Coconut Milk (canned)', 'Garlic', 'Onion', 'Ginger', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, ginger, and onion.',
      'Add vegetables and stir-fry 2 minutes.',
      'Pour coconut milk and simmer 10 minutes.',
      'Season with patis.',
      'Cook until vegetables are tender.',
      'Serve with rice.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱40–₱58', category: 'Dinner', image: 'ginataang gulay.jpg'
  },
  // ── 132 ──
  {
    id: 132, name: 'Egg and Potato Frittata',
    ingredients: ['Egg', 'Potato', 'Onion', 'Garlic', 'Salt', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan', 'oven-toaster'],
    steps: [
      'Dice and pan-fry potato until golden.',
      'Beat eggs with salt, pepper, garlic, onion.',
      'Pour egg mixture over potato in pan.',
      'Cook on low until edges set.',
      'Finish in oven toaster 5 minutes until fully set.',
      'Slice and serve like pizza slices.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱25–₱38', category: 'Breakfast', image: 'egg potato frittata.jpg'
  },
  // ── 133 ──
  {
    id: 133, name: 'Chicken Arroz Caldo de Leche',
    ingredients: ['Rice', 'Chicken', 'Condensed Milk', 'Ginger', 'Salt', 'Green Onion'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil chicken and ginger in 5 cups water.',
      'Add rice, simmer until thick.',
      'Stir in condensed milk for creamy sweetness.',
      'Season with salt.',
      'Top with green onion.',
      'Serve as comforting meal.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱55–₱75', category: 'Breakfast', image: 'arroz caldo de leche.jpg'
  },
  // ── 134 ──
  {
    id: 134, name: 'Garlicky Spinach Style Kangkong',
    ingredients: ['Kangkong', 'Garlic', 'Cooking Oil', 'Salt', 'Oyster Sauce'],
    tools: ['frying-pan'],
    steps: [
      'Slice garlic thinly.',
      'Heat generous oil, fry garlic until golden.',
      'Add kangkong leaves, toss quickly on high heat.',
      'Add oyster sauce.',
      'Season with salt and serve immediately.',
      'Do not overcook.'
    ],
    cookingTime: '5 mins', estimatedCost: '₱12–₱20', category: 'Lunch', image: 'garlicky kangkong.jpg'
  },
  // ── 135 ──
  {
    id: 135, name: 'Pork Hamonado',
    ingredients: ['Pork', 'Condensed Milk', 'Soy Sauce', 'Garlic', 'Cooking Oil', 'Salt', 'Pepper'],
    tools: ['frying-pan', 'pot'],
    steps: [
      'Slice pork thinly.',
      'Marinate in soy sauce, garlic 20 minutes.',
      'Fry pork until browned.',
      'Pour condensed milk over pork.',
      'Simmer until sauce caramelizes and thickens.',
      'Season and serve with rice.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱65–₱90', category: 'Dinner', image: 'pork hamonado.jpg'
  },
  // ── 136 ──
  {
    id: 136, name: 'Ginisang Kamote Tops',
    ingredients: ['Kamote (Sweet Potato)', 'Garlic', 'Onion', 'Fish Sauce (Patis)', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Use the leafy tops of kamote if available, or slice kamote thinly.',
      'Heat oil and sauté garlic and onion.',
      'Add kamote, toss to coat.',
      'Season with patis.',
      'Add 2 tbsp water, cover and cook 5 minutes.',
      'Serve with rice.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱12–₱22', category: 'Lunch', image: 'ginisang kamote tops.jpg'
  },
  // ── 137 ──
  {
    id: 137, name: 'Sardines Spaghetti (Instant Noodle)',
    ingredients: ['Instant Noodles', 'Sardines (canned)', 'Tomato Sauce (canned)', 'Garlic', 'Onion', 'Sugar', 'Cooking Oil'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Cook noodles, drain.',
      'Sauté garlic and onion.',
      'Add sardines, mash slightly.',
      'Add tomato sauce and a pinch of sugar.',
      'Simmer 5 minutes.',
      'Toss with noodles and serve.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱28–₱40', category: 'Lunch', image: 'sardines spaghetti.jpg'
  },
  // ── 138 ──
  {
    id: 138, name: 'Pork Humba',
    ingredients: ['Pork', 'Soy Sauce', 'Vinegar', 'Sugar', 'Garlic', 'Cooking Oil', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Brown pork pieces in oil.',
      'Add soy sauce, vinegar, garlic, and pepper.',
      'Add ½ cup water and sugar.',
      'Simmer 30 minutes until sauce thickens.',
      'The pork should be tender and caramelized.',
      'Serve with rice.'
    ],
    cookingTime: '40 mins', estimatedCost: '₱75–₱100', category: 'Dinner', image: 'pork humba.jpg'
  },
  // ── 139 ──
  {
    id: 139, name: 'Scrambled Egg with Corned Beef Toast',
    ingredients: ['Egg', 'Corned Beef (canned)', 'Bread', 'Margarine / Butter', 'Salt', 'Pepper'],
    tools: ['frying-pan', 'oven-toaster'],
    steps: [
      'Toast bread in oven toaster.',
      'Melt butter in pan.',
      'Add corned beef and cook 2 minutes.',
      'Beat eggs and pour over beef.',
      'Scramble gently until set.',
      'Pile onto toast and serve.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱35–₱50', category: 'Breakfast', image: 'corned beef toast.jpg'
  },
  // ── 140 ──
  {
    id: 140, name: 'Adobong Pusit Style Squid Ball',
    ingredients: ['Squid Ball', 'Soy Sauce', 'Vinegar', 'Garlic', 'Onion', 'Chili / Siling Labuyo', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Fry squid balls until golden.',
      'Set aside.',
      'Sauté garlic, onion, chili in same pan.',
      'Add soy sauce and vinegar.',
      'Return squid balls and toss.',
      'Simmer 3 minutes and serve.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱22–₱35', category: 'Snacks', image: 'adobong pusit squid ball.jpg'
  },
  // ── 141 ──
  {
    id: 141, name: 'Steamed Egg (Chinese Style)',
    ingredients: ['Egg', 'Soy Sauce', 'Salt', 'Green Onion'],
    tools: ['pot', 'electric-stove', 'rice-cooker'],
    steps: [
      'Beat 3 eggs with equal amount of warm water.',
      'Add pinch of salt, strain into bowl.',
      'Steam over very low heat in pot with water, covered, 15 minutes.',
      'Or place in rice cooker during rice cooking.',
      'Drizzle soy sauce over finished custard.',
      'Garnish with green onion.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱10–₱18', category: 'Lunch', image: 'steamed egg.jpg'
  },
  // ── 142 ──
  {
    id: 142, name: 'Bulalo Rice (One Pot)',
    ingredients: ['Rice', 'Pork', 'Cabbage', 'Onion', 'Salt', 'Pepper', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil pork with onion in 4 cups water until tender.',
      'Remove pork, add rice to broth.',
      'Cook rice in broth until absorbed.',
      'Add cabbage and return pork.',
      'Season with patis and pepper.',
      'Serve as one-pot meal.'
    ],
    cookingTime: '40 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'bulalo rice.jpg'
  },
  // ── 143 ──
  {
    id: 143, name: 'Pancit Canton Guisado',
    ingredients: ['Lucky Me Pancit Canton', 'Pork', 'Cabbage', 'Carrot', 'Garlic', 'Onion', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Soak noodles in warm water briefly, drain.',
      'Sauté garlic, onion, add pork strips.',
      'Add vegetables, stir-fry 3 minutes.',
      'Add noodles and seasoning packet.',
      'Drizzle soy sauce and toss well.',
      'Serve with calamansi on the side.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱45–₱65', category: 'Lunch', image: 'pancit canton guisado.jpg'
  },
  // ── 144 ──
  {
    id: 144, name: 'Chicken Pastel Budget Style',
    ingredients: ['Chicken', 'Potato', 'Carrot', 'Onion', 'Garlic', 'Evaporated Milk', 'Cooking Oil', 'Salt', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, onion, brown chicken.',
      'Add potato and carrot cubes.',
      'Pour evaporated milk and ½ cup water.',
      'Simmer 20 minutes until vegetables are soft.',
      'Season with salt and pepper.',
      'Serve over rice or with bread.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱85–₱110', category: 'Dinner', image: 'chicken pastel.jpg'
  },
  // ── 145 ──
  {
    id: 145, name: 'Ginisang Upo',
    ingredients: ['Sayote', 'Garlic', 'Onion', 'Fish Sauce (Patis)', 'Cooking Oil', 'Salt'],
    tools: ['frying-pan'],
    steps: [
      'Peel and cube sayote (used as upo substitute).',
      'Heat oil and sauté garlic and onion.',
      'Add sayote cubes.',
      'Season with patis and salt.',
      'Cover and cook 10 minutes until tender.',
      'Serve with rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱18–₱28', category: 'Lunch', image: 'ginisang upo.jpg'
  },
  // ── 146 ──
  {
    id: 146, name: 'Egg and Mushroom Scramble',
    ingredients: ['Egg', 'Mushroom (canned)', 'Garlic', 'Onion', 'Soy Sauce', 'Cooking Oil', 'Salt'],
    tools: ['frying-pan'],
    steps: [
      'Drain and slice canned mushrooms.',
      'Sauté garlic and onion.',
      'Add mushrooms, cook 3 minutes.',
      'Beat eggs and pour over mushrooms.',
      'Scramble gently.',
      'Season with soy sauce and salt, serve with toast or rice.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱22–₱35', category: 'Breakfast', image: 'egg mushroom scramble.jpg'
  },
  // ── 147 ──
  {
    id: 147, name: 'Coconut Milk Oatmeal',
    ingredients: ['Instant Oatmeal', 'Coconut Milk (canned)', 'Sugar', 'Salt', 'Banana Catsup'],
    tools: ['pot', 'microwave'],
    steps: [
      'Pour coconut milk into pot or microwave bowl.',
      'Add oatmeal and mix.',
      'Cook 2–3 minutes until thick.',
      'Add sugar and pinch of salt.',
      'Serve warm.',
      'Optionally top with banana catsup for Filipino twist.'
    ],
    cookingTime: '5 mins', estimatedCost: '₱22–₱32', category: 'Breakfast', image: 'coconut oatmeal.jpg'
  },
  // ── 148 ──
  {
    id: 148, name: 'Adobo Flakes Sinangag',
    ingredients: ['Rice', 'Pork', 'Soy Sauce', 'Vinegar', 'Garlic', 'Cooking Oil', 'Pepper'],
    tools: ['pot', 'frying-pan'],
    steps: [
      'Cook pork adobo until very tender, then shred.',
      'Crisp shredded pork in oil until dry and flaky.',
      'Fry garlic in same pan.',
      'Add cold rice, stir-fry.',
      'Mix in pork flakes.',
      'Season and serve.'
    ],
    cookingTime: '45 mins', estimatedCost: '₱75–₱100', category: 'Breakfast', image: 'adobo flakes sinangag.jpg'
  },
  // ── 149 ──
  {
    id: 149, name: 'Sinabawang Manok at Gata',
    ingredients: ['Chicken', 'Onion', 'Garlic', 'Ginger', 'Fish Sauce (Patis)', 'Salt', 'Pepper', 'Coconut Milk (canned)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil chicken with onion, garlic, ginger.',
      'Simmer 20 minutes.',
      'Add coconut milk.',
      'Season with patis, salt, and pepper.',
      'Simmer 5 more minutes.',
      'Serve as comforting soup.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱80–₱105', category: 'Dinner', image: 'sinabawang manok.jpg'
  },
  // ── 150 ──
  {
    id: 150, name: 'Spam and Egg Rice Bowl',
    ingredients: ['Spam', 'Egg', 'Rice', 'Soy Sauce', 'Garlic', 'Cooking Oil', 'Green Onion'],
    tools: ['frying-pan', 'rice-cooker'],
    steps: [
      'Cook rice.',
      'Slice and fry Spam until caramelized.',
      'Fry egg sunny-side up.',
      'Mix garlic in oil, sauté briefly.',
      'Drizzle soy sauce over.',
      'Serve Spam and egg over rice, top with green onion.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱55–₱75', category: 'Breakfast', image: 'spam egg rice bowl.jpg'
  },
  // ── 151 ──
  {
    id: 151, name: 'Ginataang Sitaw',
    ingredients: ['Sitaw (String Beans)', 'Coconut Milk (canned)', 'Garlic', 'Onion', 'Ginger', 'Fish Sauce (Patis)', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, ginger, onion.',
      'Add sitaw, stir-fry 2 minutes.',
      'Pour coconut milk.',
      'Simmer 10 minutes until sitaw is tender.',
      'Season with patis and salt.',
      'Serve with rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱30–₱45', category: 'Dinner', image: 'ginataang sitaw.jpg'
  },
  // ── 152 ──
  {
    id: 152, name: 'Fried Rice with Vegetables',
    ingredients: ['Rice', 'Carrot', 'Cabbage', 'Egg', 'Garlic', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Sauté garlic in oil.',
      'Add diced carrot, stir-fry 2 minutes.',
      'Add shredded cabbage, toss.',
      'Add cold rice, stir-fry on high.',
      'Drizzle soy sauce, push aside and scramble egg.',
      'Mix everything and serve.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱18–₱30', category: 'Lunch', image: 'fried rice vegetables.jpg'
  },
  // ── 153 ──
  {
    id: 153, name: 'Pork Belly Fried',
    ingredients: ['Pork', 'Garlic', 'Salt', 'Pepper', 'Vinegar', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Slice pork belly into strips.',
      'Season with salt and pepper.',
      'Marinate in garlic and vinegar 15 minutes.',
      'Pat dry.',
      'Fry in oil until crispy and golden.',
      'Serve with spiced vinegar and rice.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'pork belly fried.jpg'
  },
  // ── 154 ──
  {
    id: 154, name: 'Chicken Soup with Ginger',
    ingredients: ['Chicken', 'Ginger', 'Garlic', 'Onion', 'Salt', 'Pepper', 'Green Onion'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil 5 cups water.',
      'Add chicken, garlic, ginger, onion.',
      'Simmer 25 minutes.',
      'Season with salt and pepper.',
      'Top with green onion.',
      'Serve as healing soup.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'chicken ginger soup.jpg'
  },
  // ── 155 ──
  {
    id: 155, name: 'Peanut Sauce Noodles',
    ingredients: ['Instant Noodles', 'Peanut Butter', 'Soy Sauce', 'Garlic', 'Chili / Siling Labuyo', 'Calamansi', 'Sugar'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Cook noodles, drain.',
      'Mix peanut butter, soy sauce, calamansi, chili, sugar, and 3 tbsp hot water.',
      'Whisk until smooth.',
      'Pour sauce over noodles.',
      'Add minced garlic.',
      'Toss and serve.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱18–₱28', category: 'Lunch', image: 'peanut sauce noodles.jpg'
  },
  // ── 156 ──
  {
    id: 156, name: 'Caldereta Budget Style',
    ingredients: ['Pork', 'Potato', 'Carrot', 'Tomato Sauce (canned)', 'Garlic', 'Onion', 'Cooking Oil', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic and onion.',
      'Brown pork pieces.',
      'Add tomato sauce and ½ cup water.',
      'Add potato and carrot.',
      'Simmer 25 minutes until tender.',
      'Season with salt and serve with rice.'
    ],
    cookingTime: '38 mins', estimatedCost: '₱85–₱115', category: 'Dinner', image: 'caldereta budget.jpg'
  },
  // ── 157 ──
  {
    id: 157, name: 'Canned Mushroom Soup',
    ingredients: ['Mushroom (canned)', 'Evaporated Milk', 'Garlic', 'Onion', 'Margarine / Butter', 'Salt', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Melt butter, sauté garlic and onion.',
      'Add mushrooms (with liquid).',
      'Pour evaporated milk and 1 cup water.',
      'Simmer 8 minutes.',
      'Season with salt and pepper.',
      'Serve with bread as light meal.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱35–₱50', category: 'Dinner', image: 'canned mushroom soup.jpg'
  },
  // ── 158 ──
  {
    id: 158, name: 'Tomato Egg Stir-fry',
    ingredients: ['Tomato', 'Egg', 'Garlic', 'Onion', 'Salt', 'Sugar', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Heat oil, sauté garlic and onion.',
      'Add diced tomatoes, cook until soft.',
      'Add a pinch of sugar to balance acidity.',
      'Pour beaten eggs over tomatoes.',
      'Scramble gently.',
      'Season with salt and serve with rice.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱15–₱24', category: 'Breakfast', image: 'tomato egg stir fry.jpg'
  },
  // ── 159 ──
  {
    id: 159, name: 'Spicy Squid Balls Street Style',
    ingredients: ['Squid Ball', 'Garlic', 'Chili / Siling Labuyo', 'Calamansi', 'Salt', 'Cooking Oil', 'Vinegar'],
    tools: ['frying-pan'],
    steps: [
      'Deep or shallow fry squid balls until golden.',
      'Make dipping sauce: vinegar, calamansi, chili, garlic, salt.',
      'Or toss squid balls in the sauce over heat 1 minute.',
      'Serve hot as street food style snack.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱18–₱28', category: 'Snacks', image: 'nilasing squid balls.jpg'
  },
  // ── 160 ──
  {
    id: 160, name: 'Rice Cooker Chicken Rice (Hainanese Style)',
    ingredients: ['Chicken', 'Rice', 'Ginger', 'Garlic', 'Salt', 'Soy Sauce', 'Green Onion'],
    tools: ['rice-cooker'],
    steps: [
      'Season chicken with salt, ginger, garlic.',
      'Place chicken on top of washed rice in rice cooker.',
      'Add normal amount of water.',
      'Cook on normal setting.',
      'Remove chicken, slice.',
      'Serve chicken over flavored rice with soy sauce and green onion.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'hainanese style chicken rice.jpg'
  },
  // ── 161 ──
  {
    id: 161, name: 'Pork Tocino Bowl',
    ingredients: ['Tocino', 'Egg', 'Rice', 'Garlic', 'Vinegar', 'Cooking Oil'],
    tools: ['frying-pan', 'rice-cooker'],
    steps: [
      'Cook rice.',
      'Fry tocino until caramelized.',
      'Fry garlic until golden.',
      'Fry egg sunny-side up.',
      'Plate over rice.',
      'Serve with garlic vinegar dip.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱40–₱60', category: 'Breakfast', image: 'pork tocino bowl.jpg'
  },
  // ── 162 ──
  {
    id: 162, name: 'Sautéed Kangkong with Oyster Sauce',
    ingredients: ['Kangkong', 'Garlic', 'Oyster Sauce', 'Cooking Oil', 'Soy Sauce'],
    tools: ['frying-pan'],
    steps: [
      'Blanch kangkong in boiling water 1 minute, drain.',
      'Heat oil, sauté sliced garlic until golden.',
      'Add kangkong back to pan.',
      'Pour oyster sauce and soy sauce.',
      'Toss quickly and serve.',
      'Best eaten immediately.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱15–₱22', category: 'Lunch', image: 'kangkong oyster sauce.jpg'
  },
  // ── 163 ──
  {
    id: 163, name: 'Microwave Omelette',
    ingredients: ['Egg', 'Onion', 'Tomato', 'Salt', 'Pepper'],
    tools: ['microwave'],
    steps: [
      'Beat 2 eggs in microwave-safe mug.',
      'Add diced onion, tomato, salt, pepper.',
      'Mix well.',
      'Microwave 1 minute, stir.',
      'Microwave 45 more seconds until set.',
      'Slide onto rice and eat.'
    ],
    cookingTime: '4 mins', estimatedCost: '₱10–₱18', category: 'Breakfast', image: 'microwave omelette.jpg'
  },
  // ── 164 ──
  {
    id: 164, name: 'Spicy Garlic Corned Beef',
    ingredients: ['Corned Beef (canned)', 'Garlic', 'Chili / Siling Labuyo', 'Onion', 'Cooking Oil', 'Soy Sauce'],
    tools: ['frying-pan'],
    steps: [
      'Heat oil, fry garlic and chili until fragrant.',
      'Add onion, sauté.',
      'Add corned beef, break apart.',
      'Drizzle soy sauce.',
      'Fry on high heat until slightly crispy.',
      'Serve with garlic rice.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱38–₱52', category: 'Breakfast', image: 'spicy garlic corned beef.jpg'
  },
  // ── 165 ──
  {
    id: 165, name: 'Ginataang Puso ng Saging Style',
    ingredients: ['Cabbage', 'Coconut Milk (canned)', 'Pork', 'Garlic', 'Onion', 'Fish Sauce (Patis)', 'Chili / Siling Labuyo'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic and onion.',
      'Add pork, brown lightly.',
      'Add shredded cabbage (as banana blossom substitute).',
      'Pour coconut milk and chili.',
      'Simmer 15 minutes.',
      'Season with patis and serve.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'ginataang puso.jpg'
  },
  // ── 166 ──
  {
    id: 166, name: 'Pancit Canton Soup Style',
    ingredients: ['Lucky Me Pancit Canton', 'Egg', 'Garlic', 'Green Onion', 'Soy Sauce'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil 2 cups water.',
      'Add noodles and cook 2 minutes.',
      'Add seasoning packet and soy sauce.',
      'Crack egg and gently stir.',
      'Add minced garlic.',
      'Serve in bowl topped with green onion.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱14–₱20', category: 'Lunch', image: 'pancit canton soup.jpg'
  },
  // ── 167 ──
  {
    id: 167, name: 'Chicken Asado Budget',
    ingredients: ['Chicken', 'Soy Sauce', 'Tomato Sauce (canned)', 'Sugar', 'Garlic', 'Onion', 'Cooking Oil'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Brown chicken in oil.',
      'Sauté garlic and onion.',
      'Add soy sauce, tomato sauce, and sugar.',
      'Add ¼ cup water.',
      'Simmer 20 minutes until chicken is cooked.',
      'Reduce sauce and serve over rice.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱75–₱100', category: 'Dinner', image: 'chicken asado.jpg'
  },
  // ── 168 ──
  {
    id: 168, name: 'Coconut Milk Chicken Soup',
    ingredients: ['Chicken', 'Coconut Milk (canned)', 'Ginger', 'Garlic', 'Onion', 'Fish Sauce (Patis)', 'Chili / Siling Labuyo'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, ginger, onion.',
      'Add chicken, cook 5 minutes.',
      'Pour coconut milk and 2 cups water.',
      'Add chili.',
      'Simmer 20 minutes.',
      'Season with patis and serve with rice.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱85–₱110', category: 'Dinner', image: 'coconut chicken soup.jpg'
  },
  // ── 169 ──
  {
    id: 169, name: 'Crispy Spam Scramble',
    ingredients: ['Spam', 'Egg', 'Garlic', 'Onion', 'Tomato', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Dice Spam small and fry until very crispy.',
      'Remove Spam, sauté garlic, onion, tomato in same oil.',
      'Beat eggs and add to pan, scramble.',
      'Stir in crispy Spam.',
      'Season to taste.',
      'Serve with garlic rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱50–₱68', category: 'Breakfast', image: 'spam scramble.jpg'
  },
  // ── 170 ──
  {
    id: 170, name: 'Macaroni Soup (Budget Sopas)',
    ingredients: ['Instant Noodles', 'Evaporated Milk', 'Carrot', 'Cabbage', 'Garlic', 'Onion', 'Salt', 'Pepper'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic and onion in oil.',
      'Add carrot and cabbage.',
      'Pour 3 cups water, bring to boil.',
      'Add broken noodles (as macaroni substitute).',
      'Cook 3 minutes, add evaporated milk.',
      'Season with salt and pepper, serve hot.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱25–₱38', category: 'Dinner', image: 'budget sopas.jpg'
  },
  // ── 171 ──
  {
    id: 171, name: 'Miso Soup Style',
    ingredients: ['Garlic', 'Onion', 'Tomato', 'Fish Sauce (Patis)', 'Salt', 'Green Onion', 'Egg'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil 3 cups water.',
      'Add garlic, onion, tomato.',
      'Simmer 5 minutes.',
      'Season with patis and salt.',
      'Crack egg into soup, stir gently.',
      'Top with green onion and serve.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱10–₱18', category: 'Breakfast', image: 'miso soup style.jpg'
  },
  // ── 172 ──
  {
    id: 172, name: 'Chicken Adobo Dry Style',
    ingredients: ['Chicken', 'Soy Sauce', 'Vinegar', 'Garlic', 'Onion', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan', 'pot'],
    steps: [
      'Cut chicken into small pieces.',
      'Marinate in soy sauce, vinegar, garlic, pepper 15 minutes.',
      'Heat oil, sauté onion.',
      'Add chicken with marinade.',
      'Cook until liquid reduces and chicken is glossy.',
      'Serve over rice.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱70–₱92', category: 'Dinner', image: 'chicken adobo dry.jpg'
  },
  // ── 173 ──
  {
    id: 173, name: 'Garlic Butter Squid Balls',
    ingredients: ['Squid Ball', 'Garlic', 'Margarine / Butter', 'Salt', 'Pepper', 'Calamansi'],
    tools: ['frying-pan'],
    steps: [
      'Fry squid balls until golden.',
      'Melt butter in pan, add lots of garlic.',
      'Sauté garlic until fragrant.',
      'Add squid balls, toss in garlic butter.',
      'Season with salt and pepper.',
      'Squeeze calamansi and serve.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱25–₱38', category: 'Snacks', image: 'garlic butter squid balls.jpg'
  },
  // ── 174 ──
  {
    id: 174, name: 'Pork Chop Rice Cooker',
    ingredients: ['Pork', 'Soy Sauce', 'Calamansi', 'Garlic', 'Salt', 'Pepper'],
    tools: ['rice-cooker'],
    steps: [
      'Marinate pork chop in soy sauce, calamansi, garlic, salt, pepper 20 minutes.',
      'Place pork in rice cooker.',
      'Cook on cook setting.',
      'Flip halfway through.',
      'Let it cycle once more.',
      'Serve with garlic rice.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱65–₱90', category: 'Dinner', image: 'pork chop rice cooker.jpg'
  },
  // ── 175 ──
  {
    id: 175, name: 'Skinless Longganisa Fried Rice',
    ingredients: ['Longganisa', 'Rice', 'Garlic', 'Egg', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Remove longganisa casing, crumble meat.',
      'Fry longganisa in oil until cooked and slightly crispy.',
      'Add garlic, fry golden.',
      'Add cold rice, stir-fry.',
      'Scramble egg in.',
      'Drizzle soy sauce, mix and serve.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱35–₱50', category: 'Breakfast', image: 'longganisa fried rice.jpg'
  },
  // ── 176 ──
  {
    id: 176, name: 'Tomato Soup Filipino Style',
    ingredients: ['Tomato', 'Onion', 'Garlic', 'Evaporated Milk', 'Margarine / Butter', 'Salt', 'Pepper', 'Sugar'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic and onion in butter.',
      'Add diced tomatoes, cook until soft.',
      'Add 2 cups water and simmer 10 minutes.',
      'Mash tomatoes or blend if possible.',
      'Pour evaporated milk, add sugar.',
      'Season with salt and pepper, serve with bread.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱30–₱45', category: 'Dinner', image: 'tomato soup.jpg'
  },
  // ── 177 ──
  {
    id: 177, name: 'Corned Beef Hash Bowl',
    ingredients: ['Corned Beef (canned)', 'Potato', 'Onion', 'Egg', 'Cooking Oil', 'Salt', 'Pepper'],
    tools: ['frying-pan'],
    steps: [
      'Dice and fry potato until golden.',
      'Add diced onion, sauté.',
      'Add corned beef, break apart.',
      'Fry until crispy bits form.',
      'Top with a fried egg.',
      'Season and serve over rice.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱45–₱60', category: 'Breakfast', image: 'corned beef hash bowl.jpg'
  },
  // ── 178 ──
  {
    id: 178, name: 'Pork and Egg Topping Rice',
    ingredients: ['Pork', 'Egg', 'Soy Sauce', 'Garlic', 'Onion', 'Sugar', 'Cooking Oil', 'Rice'],
    tools: ['frying-pan', 'rice-cooker'],
    steps: [
      'Cook rice.',
      'Brown ground or minced pork with garlic and onion.',
      'Add soy sauce and a pinch of sugar.',
      'Simmer until sauce is slightly thick.',
      'Fry egg separately.',
      'Serve pork and egg over rice.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱55–₱75', category: 'Lunch', image: 'pork egg rice.jpg'
  },
  // ── 179 ──
  {
    id: 179, name: 'Arroz Caldo with Corned Beef',
    ingredients: ['Rice', 'Corned Beef (canned)', 'Ginger', 'Garlic', 'Onion', 'Fish Sauce (Patis)', 'Green Onion'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, ginger, onion.',
      'Add rice, stir 1 minute.',
      'Pour 5 cups water, simmer 25 minutes.',
      'Add corned beef in last 5 minutes.',
      'Season with patis.',
      'Serve topped with green onion.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱35–₱52', category: 'Breakfast', image: 'arroz caldo corned beef.jpg'
  },
  // ── 180 ──
  {
    id: 180, name: 'Ginisang Talong',
    ingredients: ['Talong (Eggplant)', 'Garlic', 'Onion', 'Tomato', 'Fish Sauce (Patis)', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Slice eggplant into rounds.',
      'Fry in oil until golden on both sides, set aside.',
      'In same pan, sauté garlic, onion, tomato.',
      'Return eggplant, add patis.',
      'Stir gently, cook 2 minutes.',
      'Serve with rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱18–₱28', category: 'Lunch', image: 'ginisang talong.jpg'
  },
  // ── 181 ──
  {
    id: 181, name: 'Sweetened Kamote Dessert',
    ingredients: ['Kamote (Sweet Potato)', 'Sugar', 'Coconut Milk (canned)', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Peel and cube kamote.',
      'Boil in water until half-cooked.',
      'Drain, add coconut milk and sugar.',
      'Simmer 10 minutes until kamote is very soft.',
      'Add pinch of salt.',
      'Serve warm as dessert.'
    ],
    cookingTime: '22 mins', estimatedCost: '₱25–₱38', category: 'Snacks', image: 'sweetened kamote.jpg'
  },
  // ── 182 ──
  {
    id: 182, name: 'Pork Asado Style',
    ingredients: ['Pork', 'Soy Sauce', 'Sugar', 'Garlic', 'Cooking Oil', 'Onion'],
    tools: ['pot', 'frying-pan'],
    steps: [
      'Marinate pork in soy sauce, garlic, sugar 20 minutes.',
      'Sauté onion in oil.',
      'Add pork with marinade.',
      'Add ¼ cup water, simmer 20 minutes.',
      'Reduce sauce until thick and caramelized.',
      'Slice and serve over rice.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'pork asado.jpg'
  },
  // ── 183 ──
  {
    id: 183, name: 'Kamote with Condensed Milk Snack',
    ingredients: ['Kamote (Sweet Potato)', 'Condensed Milk', 'Sugar', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Cut kamote into thick slices.',
      'Fry until soft and golden.',
      'Drain excess oil.',
      'Plate and drizzle condensed milk.',
      'Sprinkle sugar on top.',
      'Serve as sweet merienda.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱18–₱28', category: 'Snacks', image: 'saging saba style.jpg'
  },
  // ── 184 ──
  {
    id: 184, name: 'Ensaladang Talong',
    ingredients: ['Talong (Eggplant)', 'Tomato', 'Onion', 'Fish Sauce (Patis)', 'Calamansi', 'Salt'],
    tools: ['oven-toaster', 'knife'],
    steps: [
      'Roast eggplant whole in oven toaster until charred.',
      'Peel off burnt skin.',
      'Slice eggplant flesh.',
      'Top with diced tomato and onion.',
      'Dress with patis and calamansi.',
      'Season with salt and serve.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱18–₱28', category: 'Snacks', image: 'ensaladang talong.jpg'
  },
  // ── 185 ──
  {
    id: 185, name: 'Pork Binagoongan Quick Style',
    ingredients: ['Pork', 'Vinegar', 'Garlic', 'Onion', 'Tomato', 'Chili / Siling Labuyo', 'Fish Sauce (Patis)', 'Cooking Oil'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Boil pork until tender.',
      'Fry pork until crispy.',
      'Sauté garlic, onion, tomato, chili.',
      'Add vinegar and patis to make sauce.',
      'Toss pork in sauce.',
      'Simmer 3 minutes and serve.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'pork binagoongan instant.jpg'
  },
  // ── 186 ──
  {
    id: 186, name: 'Corned Beef Sopas',
    ingredients: ['Corned Beef (canned)', 'Instant Noodles', 'Carrot', 'Cabbage', 'Evaporated Milk', 'Garlic', 'Onion', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic and onion.',
      'Add carrot and cabbage.',
      'Pour 3 cups water and bring to boil.',
      'Add broken noodles, cook 3 minutes.',
      'Add corned beef and evaporated milk.',
      'Season with salt and serve hot.'
    ],
    cookingTime: '18 mins', estimatedCost: '₱45–₱62', category: 'Dinner', image: 'corned beef sopas.jpg'
  },
  // ── 187 ──
  {
    id: 187, name: 'Pinoy Egg Salad Sandwich',
    ingredients: ['Egg', 'Bread', 'Margarine / Butter', 'Sugar', 'Salt', 'Condensed Milk'],
    tools: ['pot', 'electric-stove', 'knife'],
    steps: [
      'Hard-boil eggs, peel and mash.',
      'Mix with condensed milk, a pinch of sugar and salt.',
      'Toast bread.',
      'Spread butter on toast.',
      'Pile egg salad on bread.',
      'Close and serve.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱18–₱28', category: 'Snacks', image: 'egg salad sandwich.jpg'
  },
  // ── 188 ──
  {
    id: 188, name: 'Monggo at Baboy (Budget)',
    ingredients: ['Garlic', 'Onion', 'Tomato', 'Pork', 'Kangkong', 'Fish Sauce (Patis)', 'Cooking Oil'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, onion, tomato.',
      'Add pork strips, cook through.',
      'Pour 3 cups water, boil.',
      'Simmer 10 minutes.',
      'Add kangkong, season with patis.',
      'Serve over rice.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱60–₱82', category: 'Dinner', image: 'monggo baboy.jpg'
  },
  // ── 189 ──
  {
    id: 189, name: 'Butter Garlic Bangus',
    ingredients: ['Bangus (Milkfish)', 'Margarine / Butter', 'Garlic', 'Salt', 'Pepper', 'Calamansi'],
    tools: ['frying-pan', 'oven-toaster'],
    steps: [
      'Butterfly bangus, season with salt and pepper.',
      'Melt butter in pan.',
      'Fry garlic until golden.',
      'Fry bangus in garlic butter until cooked.',
      'Squeeze calamansi over.',
      'Serve with rice.'
    ],
    cookingTime: '22 mins', estimatedCost: '₱65–₱88', category: 'Dinner', image: 'butter garlic bangus.jpg'
  },
  // ── 190 ──
  {
    id: 190, name: 'Marinated Boiled Egg (Tokwa Style)',
    ingredients: ['Egg', 'Soy Sauce', 'Vinegar', 'Sugar', 'Garlic', 'Onion', 'Chili / Siling Labuyo'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Hard-boil eggs, peel.',
      'Mix soy sauce, vinegar, sugar, garlic, onion, chili.',
      'Marinate eggs in sauce 10 minutes.',
      'Slice and serve with sauce.',
      'Can be eaten hot or cold.',
      'Great with rice or as pulutan.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱12–₱20', category: 'Snacks', image: 'tokwa style egg.jpg'
  },
  // ── 191 ──
  {
    id: 191, name: 'Chicken Sopas sa Rice Cooker',
    ingredients: ['Chicken', 'Instant Noodles', 'Carrot', 'Cabbage', 'Evaporated Milk', 'Onion', 'Salt', 'Pepper'],
    tools: ['rice-cooker'],
    steps: [
      'Place chicken, onion, and carrot in rice cooker.',
      'Add 3 cups water.',
      'Cook on setting once.',
      'Remove chicken and shred.',
      'Add noodles, cabbage, milk.',
      'Cook one more cycle, season and serve.'
    ],
    cookingTime: '30 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'chicken sopas rice cooker.jpg'
  },
  // ── 192 ──
  {
    id: 192, name: 'Sweet and Sour Pork (Budget)',
    ingredients: ['Pork', 'Tomato Sauce (canned)', 'Vinegar', 'Sugar', 'Garlic', 'Onion', 'Cooking Oil', 'Salt'],
    tools: ['frying-pan', 'electric-stove'],
    steps: [
      'Cut pork into chunks, season with salt.',
      'Fry pork until golden, set aside.',
      'Sauté garlic and onion.',
      'Mix tomato sauce, vinegar, and sugar.',
      'Pour sauce over garlic-onion.',
      'Add pork, simmer 5 minutes and serve.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'sweet sour pork.jpg'
  },
  // ── 193 ──
  {
    id: 193, name: 'Pechay at Corned Beef',
    ingredients: ['Pechay', 'Corned Beef (canned)', 'Garlic', 'Onion', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Sauté garlic and onion.',
      'Add corned beef, break apart.',
      'Add pechay, stir-fry.',
      'Season with soy sauce.',
      'Cook until pechay is wilted.',
      'Serve with rice.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱38–₱52', category: 'Lunch', image: 'pechay corned beef.jpg'
  },
  // ── 194 ──
  {
    id: 194, name: 'Chicken Inasal Rice Cooker',
    ingredients: ['Chicken', 'Calamansi', 'Garlic', 'Vinegar', 'Salt', 'Cooking Oil'],
    tools: ['rice-cooker'],
    steps: [
      'Marinate chicken in calamansi, garlic, vinegar, salt 30 minutes.',
      'Brush with oil.',
      'Place in rice cooker and cook.',
      'Flip halfway and brush with more oil.',
      'Let cycle complete.',
      'Serve with garlic rice and sauce.'
    ],
    cookingTime: '40 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'chicken inasal rice cooker.jpg'
  },
  // ── 195 ──
  {
    id: 195, name: 'Creamy Champorado',
    ingredients: ['Rice', 'Condensed Milk', 'Sugar', 'Salt', 'Evaporated Milk'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Cook rice in 4 cups water until very soft.',
      'Add sugar and pinch of salt.',
      'Stir in condensed milk.',
      'Cook until creamy and thick.',
      'Serve topped with evaporated milk.',
      'Eat as breakfast or merienda.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱18–₱28', category: 'Breakfast', image: 'champorado condensed milk.jpg'
  },
  // ── 196 ──
  {
    id: 196, name: 'Ginataang Langka Style (with Cabbage)',
    ingredients: ['Cabbage', 'Coconut Milk (canned)', 'Pork', 'Garlic', 'Onion', 'Ginger', 'Fish Sauce (Patis)', 'Chili / Siling Labuyo'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, ginger, onion.',
      'Brown pork.',
      'Add cabbage and chili.',
      'Pour coconut milk.',
      'Simmer 15 minutes until cabbage is tender.',
      'Season with patis and serve.'
    ],
    cookingTime: '25 mins', estimatedCost: '₱70–₱95', category: 'Dinner', image: 'ginataang cabbage.jpg'
  },
  // ── 197 ──
  {
    id: 197, name: 'Tuna and Pechay Stir-fry',
    ingredients: ['Tuna (canned)', 'Pechay', 'Garlic', 'Oyster Sauce', 'Soy Sauce', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Heat oil, sauté garlic.',
      'Add drained tuna, cook 2 minutes.',
      'Add pechay and toss.',
      'Season with oyster sauce and soy sauce.',
      'Cook 2 more minutes.',
      'Serve over rice.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱28–₱40', category: 'Lunch', image: 'tuna pechay.jpg'
  },
  // ── 198 ──
  {
    id: 198, name: 'Monggo with Kangkong and Sardines',
    ingredients: ['Sardines (canned)', 'Kangkong', 'Garlic', 'Onion', 'Tomato', 'Cooking Oil', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Sauté garlic, onion, tomato.',
      'Add sardines and mash.',
      'Pour 3 cups water, boil.',
      'Simmer 8 minutes.',
      'Add kangkong.',
      'Season with patis and serve over rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱25–₱38', category: 'Dinner', image: 'monggo sardines kangkong.jpg'
  },
  // ── 199 ──
  {
    id: 199, name: 'Pinoy Garlic Toast',
    ingredients: ['Bread', 'Margarine / Butter', 'Garlic', 'Salt'],
    tools: ['oven-toaster', 'frying-pan'],
    steps: [
      'Mince garlic finely.',
      'Mix softened butter with garlic and salt.',
      'Spread generously on bread.',
      'Toast in oven toaster until golden.',
      'Serve as snack or breakfast side.',
      'Can be paired with hot chocolate or coffee.'
    ],
    cookingTime: '5 mins', estimatedCost: '₱8–₱15', category: 'Snacks', image: 'garlic toast.jpg'
  },
  // ── 200 ──
  {
    id: 200, name: 'Squid Ball Soup',
    ingredients: ['Squid Ball', 'Instant Noodles', 'Garlic', 'Green Onion', 'Soy Sauce', 'Salt'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Boil 2 cups water.',
      'Add squid balls, cook 2 minutes.',
      'Add noodles and cook through.',
      'Season with soy sauce and salt.',
      'Add minced garlic.',
      'Top with green onion and serve.'
    ],
    cookingTime: '8 mins', estimatedCost: '₱18–₱28', category: 'Lunch', image: 'squid ball soup.jpg'
  },
  // ── 201 ──
  {
    id: 201, name: 'Chicken Longganisa Style',
    ingredients: ['Chicken', 'Garlic', 'Sugar', 'Salt', 'Soy Sauce', 'Pepper', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Mince chicken or use small pieces.',
      'Season with garlic, sugar, soy sauce, salt, and pepper.',
      'Form into small patties or logs.',
      'Cook in pan with a little water first.',
      'Let water evaporate, then fry in oil.',
      'Serve with garlic rice and egg.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱55–₱75', category: 'Breakfast', image: 'chicken longganisa.jpg'
  },

];

/* STATE */
let selectedIngredients=new Set(), selectedTools=new Set();
let currentRecipe=null, currentRandom=null;
let favorites=loadFavs(), ingPanelOpen=false, searchTimer=null;

/* INIT */
document.addEventListener('DOMContentLoaded',()=>{
  buildIngChips(); buildToolChips(); applyLang(); updateFavCount();
});

/* LANGUAGE */
function applyLang(){
  const l=L();
  document.getElementById('lang-en')?.classList.toggle('active',currentLang==='en');
  document.getElementById('lang-fil')?.classList.toggle('active',currentLang==='fil');
  const sub=document.querySelector('.hero-sub');
  if(sub)sub.textContent=currentLang==='en'?'Match recipes to the ingredients you already have in your dorm.':'Hanapin ang recipe base sa mga sangkap na mayroon ka sa dorm mo.';
  const sf=document.getElementById('global-search');if(sf)sf.placeholder=l.searchPh;
  const is=document.getElementById('ingredient-search');if(is)is.placeholder=l.ingSearchPh;
  const cs=document.getElementById('cat-select');if(cs&&cs.options[0])cs.options[0].text=l.allCats;
  updateIngBadge();
  const km={pantry:l.pantry,proteins:l.proteins,vegetables:l.vegetables,instant:l.instant,condiments:l.condiments,cookingTools:l.cookingTools};
  document.querySelectorAll('.ing-group-label[data-key]').forEach(el=>{if(km[el.dataset.key])el.textContent=km[el.dataset.key];});
  const noT=document.querySelector('#empty-state .state-title');if(noT)noT.textContent=l.noRecipes;
  const noS=document.querySelector('#empty-state .state-sub');if(noS)noS.textContent=l.noRecipesSub;
  const savBtn=document.getElementById('fav-toggle-btn');if(savBtn)savBtn.textContent=savBtn.classList.contains('saved')?l.savedBtn:l.saveBtn;
  const favTitle=document.getElementById('fav-sheet-title');if(favTitle)favTitle.textContent=l.favTitle;
  const mt=document.getElementById('modal-tag');if(mt)mt.textContent=l.randomTag;
  const mv=document.getElementById('modal-view-btn');if(mv)mv.textContent=l.viewRecipe;
  const mr=document.getElementById('modal-roll-btn');if(mr)mr.textContent=currentLang==='en'?'Another one':'Isa pa';
}

/* CHIPS */
function buildIngChips(){
  const map={staples:'grid-staples',proteins:'grid-proteins',veggies:'grid-veggies',instant:'grid-instant',condiments:'grid-condiments'};
  Object.entries(INGREDIENT_CATEGORIES).forEach(([key,cat])=>{
    const g=document.getElementById(map[key]);if(!g)return;
    cat.items.forEach(item=>{
      const lbl=document.createElement('label');
      lbl.className='chip-label';lbl.dataset.ingredient=item.toLowerCase();
      lbl.innerHTML=`<input type="checkbox" value="${item}" onchange="onChip(this)"/>${item}`;
      g.appendChild(lbl);
    });
  });
}
function onChip(cb){
  cb.checked?selectedIngredients.add(cb.value):selectedIngredients.delete(cb.value);
  cb.closest('.chip-label').classList.toggle('checked',cb.checked);
  updateIngBadge();updateClearBtn();triggerSearch();
}
function buildToolChips(){
  const g=document.getElementById('tools-chip-grid');if(!g)return;
  TOOLS.forEach(t=>{
    const lbl=document.createElement('label');lbl.className='chip-label';
    lbl.innerHTML=`<input type="checkbox" value="${t.id}" onchange="onTool(this)"/>${t.icon} ${t.name}`;
    g.appendChild(lbl);
  });
}
function onTool(cb){
  cb.checked?selectedTools.add(cb.value):selectedTools.delete(cb.value);
  cb.closest('.chip-label').classList.toggle('checked',cb.checked);
  updateClearBtn();triggerSearch();
}
function updateIngBadge(){
  const n=selectedIngredients.size;
  const badge=document.getElementById('ing-badge');
  const lbl=document.getElementById('ing-toggle-label');
  if(badge){badge.textContent=n;badge.classList.toggle('hidden',n===0);}
  if(lbl)lbl.textContent=n>0?L().ingSelected(n):(currentLang==='en'?'Filter by ingredients':'Pumili ng sangkap');
}
function updateClearBtn(){
  const n=selectedIngredients.size+selectedTools.size;
  document.getElementById('clear-filters-btn')?.classList.toggle('hidden',n===0);
}
function filterIngredients(){
  const q=document.getElementById('ingredient-search').value.toLowerCase().trim();
  document.querySelectorAll('.chip-label').forEach(l=>{
    const n=l.dataset.ingredient||'';
    l.classList.toggle('hidden-chip',q.length>0&&!n.includes(q));
  });
}
function clearAllFilters(){
  selectedIngredients.clear();selectedTools.clear();
  document.querySelectorAll('.chip-label.checked').forEach(l=>{l.classList.remove('checked');l.querySelector('input').checked=false;});
  updateIngBadge();updateClearBtn();triggerSearch();
}
function toggleIngPanel(){
  ingPanelOpen=!ingPanelOpen;
  document.getElementById('ing-panel').classList.toggle('open',ingPanelOpen);
  document.getElementById('sp-filter-btn').classList.toggle('open',ingPanelOpen);
}

/* SEARCH */
function onSearch(){
  const v=document.getElementById('global-search').value.trim();
  document.getElementById('clear-btn').classList.toggle('hidden',v==='');
  clearTimeout(searchTimer);searchTimer=setTimeout(triggerSearch,160);
}
function clearSearch(){
  document.getElementById('global-search').value='';
  document.getElementById('clear-btn').classList.add('hidden');
  triggerSearch();
}
function triggerSearch(){
  const nameQ=(document.getElementById('global-search')?.value||'').toLowerCase().trim();
  const catQ=document.getElementById('cat-select')?.value||'';
  if(!nameQ&&!catQ&&selectedIngredients.size===0){showHint();return;}
  hideHint();
  const scored=RECIPES.map(r=>{
    const nameOk=!nameQ||r.name.toLowerCase().includes(nameQ)||r.category.toLowerCase().includes(nameQ)||r.ingredients.some(i=>i.toLowerCase().includes(nameQ));
    const catOk=!catQ||r.category===catQ;
    if(!nameOk||!catOk)return null;
    if(selectedTools.size>0&&!r.tools.every(t=>selectedTools.has(t)))return null;
    const matched=selectedIngredients.size===0?r.ingredients.length:r.ingredients.filter(i=>selectedIngredients.has(i)).length;
    if(selectedIngredients.size>0&&matched===0)return null;
    const ratio=selectedIngredients.size===0?1:matched/r.ingredients.length;
    return{r,matched,ratio};
  }).filter(Boolean).sort((a,b)=>b.ratio-a.ratio);
  renderCards(scored);
}

/* RENDER CARDS */
function showHint(){
  document.getElementById('start-hint').classList.remove('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('results-bar').classList.add('hidden');
  document.getElementById('recipes-container').innerHTML='';
}
function hideHint(){document.getElementById('start-hint').classList.add('hidden');}

function renderCards(scored){
  const grid=document.getElementById('recipes-container');
  const empty=document.getElementById('empty-state');
  const bar=document.getElementById('results-bar');
  const label=document.getElementById('results-label');
  grid.innerHTML='';
  if(scored.length===0){empty.classList.remove('hidden');bar.classList.add('hidden');return;}
  empty.classList.add('hidden');bar.classList.remove('hidden');
  label.innerHTML=L().results(scored.length);
  scored.forEach(({r,matched,ratio},idx)=>{
    const pct=Math.round(ratio*100);
    const isFav=favorites.some(f=>f.id===r.id);
    const img=getImg(r);const yt=getYouTubeLink(r.name);const desc=getDesc(r.name);
    const ingTag=selectedIngredients.size>0?`${matched}/${r.ingredients.length} ${L().matchSuffix}`:`${r.ingredients.length} ingredients`;
    const badge=selectedIngredients.size>0?`<span class="rc-match ${pct>=75?'match-hi':'match-mid'}">${pct}%</span>`:'';
    const card=document.createElement('div');
    card.className='recipe-card';
    card.style.cssText=`animation:cardFadeIn 0.35s ease ${idx*0.04}s both`;
    card.innerHTML=`
      <div class="rc-img-col">
        <img class="rc-img" src="${img}" alt="${r.name}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="rc-img-placeholder" style="display:none">${getEmoji(r.category)}</div>
      </div>
      <div class="rc-content">
        <div class="rc-top"><div class="rc-name">${r.name}</div>${badge}</div>
        <div class="rc-desc">${desc}</div>
        <div class="rc-pills">
          <span class="rc-pill cat">${r.category}</span>
          <span class="rc-pill">&#9202; ${r.cookingTime}</span>
          <span class="rc-pill">&#8369; ${r.estimatedCost.replace('&#8369;','').replace('P','')}</span>
          <span class="rc-pill">${ingTag}</span>
        </div>
        <div class="rc-footer">
          <a class="rc-yt" href="${yt}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 7a2.4 2.4 0 00-1.69-1.7C16.35 5 12 5 12 5s-4.35 0-5.9.3A2.4 2.4 0 004.41 7 25 25 0 004.1 12a25 25 0 00.31 5 2.4 2.4 0 001.69 1.7C7.65 19 12 19 12 19s4.35 0 5.9-.3A2.4 2.4 0 0019.59 17 25 25 0 0019.9 12a25 25 0 00-.31-5zM10 15V9l5.2 3z"/></svg>
            ${L().watchYT}
          </a>
          <button class="rc-fav-btn ${isFav?'saved':''}" onclick="event.stopPropagation();quickFav(${r.id},this)">${isFav?'&#9829;':'&#9825;'}</button>
        </div>
      </div>`;
    card.addEventListener('click',()=>openDetail(r.id));
    grid.appendChild(card);
  });
}
/* inject card animation */
const _ks=document.createElement('style');
_ks.textContent='@keyframes cardFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(_ks);

/* DETAIL SHEET */
function openDetail(id){
  currentRecipe=RECIPES.find(r=>r.id===id);if(!currentRecipe)return;
  renderDetail(currentRecipe);updateSaveBtn();
  document.getElementById('sheet-overlay').classList.remove('hidden');
  document.body.style.overflow='hidden';
}
function closeSheet(e){if(e.target.id==='sheet-overlay')forceCloseSheet();}
function forceCloseSheet(){document.getElementById('sheet-overlay').classList.add('hidden');document.body.style.overflow='';}
function renderDetail(r){
  const body=document.getElementById('detail-body');
  const img=getImg(r);const yt=getYouTubeLink(r.name);
  const toolsHtml=r.tools.map(tid=>{const t=TOOLS.find(x=>x.id===tid);return t?`<span class="tool-chip-d">${t.icon} ${t.name}</span>`:''}).join('');
  const ings=r.ingredients.map(i=>`<li>${i}</li>`).join('');
  const steps=r.steps.map((s,i)=>`<div class="step-item"><div class="step-num">${i+1}</div><div class="step-text">${s}</div></div>`).join('');
  body.innerHTML=`
    <div class="detail-hero-wrap">
      <img class="detail-hero-img" src="${img}" alt="${r.name}"
        onerror="this.outerHTML='<div class=detail-hero-placeholder>${getEmoji(r.category)}</div>'">
      <div class="detail-hero-fade"></div>
    </div>
    <div class="detail-info">
      <div class="detail-recipe-name">${r.name}</div>
      <div class="detail-meta-row">
        <span class="detail-meta-pill cat">${r.category}</span>
        <span class="detail-meta-pill">&#9202; ${r.cookingTime}</span>
        <span class="detail-meta-pill">&#8369; ${r.estimatedCost.replace('&#8369;','')}</span>
      </div>
    </div>
    <a class="yt-cta" href="${yt}" target="_blank" rel="noopener">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 7a2.4 2.4 0 00-1.69-1.7C16.35 5 12 5 12 5s-4.35 0-5.9.3A2.4 2.4 0 004.41 7 25 25 0 004.1 12a25 25 0 00.31 5 2.4 2.4 0 001.69 1.7C7.65 19 12 19 12 19s4.35 0 5.9-.3A2.4 2.4 0 0019.59 17 25 25 0 0019.9 12a25 25 0 00-.31-5zM10 15V9l5.2 3z"/></svg>
      ${L().watchYT}
    </a>
    <div class="detail-section"><div class="detail-sec-label">${L().toolsSection}</div><div class="tools-wrap">${toolsHtml}</div></div>
    <div class="detail-section"><div class="detail-sec-label">${L().ingSection}</div><ul class="detail-ing-list">${ings}</ul></div>
    <div class="detail-section"><div class="detail-sec-label">${L().stepsSection}</div><div class="detail-steps">${steps}</div></div>`;
}
function updateSaveBtn(){
  const btn=document.getElementById('fav-toggle-btn');if(!btn||!currentRecipe)return;
  const saved=favorites.some(f=>f.id===currentRecipe.id);
  btn.textContent=saved?L().savedBtn:L().saveBtn;btn.classList.toggle('saved',saved);
}

/* FAVORITES */
function loadFavs(){try{return JSON.parse(localStorage.getItem('dormchef_favorites'))||[];}catch{return[];}}
function saveFavs(){localStorage.setItem('dormchef_favorites',JSON.stringify(favorites));}
function updateFavCount(){const n=favorites.length;const el=document.getElementById('fav-nav-count');if(el){el.textContent=n;el.classList.toggle('hidden',n===0);}}
function toggleFavorite(){
  if(!currentRecipe)return;
  const idx=favorites.findIndex(f=>f.id===currentRecipe.id);
  if(idx>=0)favorites.splice(idx,1);else favorites.push(currentRecipe);
  saveFavs();updateSaveBtn();updateFavCount();
}
function quickFav(id,btn){
  const r=RECIPES.find(x=>x.id===id);if(!r)return;
  const idx=favorites.findIndex(f=>f.id===id);
  if(idx>=0){favorites.splice(idx,1);btn.innerHTML='&#9825;';btn.classList.remove('saved');}
  else{favorites.push(r);btn.innerHTML='&#9829;';btn.classList.add('saved');}
  saveFavs();updateFavCount();
}
function openFavorites(){renderFavList();document.getElementById('fav-overlay').classList.remove('hidden');document.body.style.overflow='hidden';}
function closeFavSheet(e){if(e.target.id==='fav-overlay')forceCloseFavSheet();}
function forceCloseFavSheet(){document.getElementById('fav-overlay').classList.add('hidden');document.body.style.overflow='';}
function renderFavList(){
  const list=document.getElementById('fav-list');const noFav=document.getElementById('no-fav');
  list.innerHTML='';
  if(favorites.length===0){noFav.classList.remove('hidden');return;}
  noFav.classList.add('hidden');
  favorites.forEach(r=>{
    const row=document.createElement('div');row.className='fav-row';
    row.innerHTML=`<img class="fav-row-img" src="${getImg(r)}" alt="${r.name}" onerror="this.style.background='var(--surface-3)'"><div class="fav-row-info"><div class="fav-row-name">${r.name}</div><div class="fav-row-meta">${r.category} &middot; ${r.cookingTime}</div></div><button class="fav-row-del" onclick="event.stopPropagation();removeFav(${r.id})">&#10005;</button>`;
    row.addEventListener('click',()=>{forceCloseFavSheet();openDetail(r.id);});
    list.appendChild(row);
  });
}
function removeFav(id){const idx=favorites.findIndex(f=>f.id===id);if(idx>=0)favorites.splice(idx,1);saveFavs();updateFavCount();renderFavList();}
function goTo(p){if(p==='page-favorites')openFavorites();}

/* RANDOM */
function randomRecipe(){currentRandom=RECIPES[Math.floor(Math.random()*RECIPES.length)];showRandom(currentRandom);}
function showRandom(r){
  document.getElementById('modal-img').src=getImg(r);
  document.getElementById('modal-name').textContent=r.name;
  document.getElementById('modal-meta').innerHTML=`<span>${r.category}</span><span>&#9202; ${r.cookingTime}</span><span>&#8369; ${r.estimatedCost.replace('&#8369;','')}</span>`;
  const d=document.getElementById('modal-dice');d.style.animation='none';void d.offsetWidth;d.style.animation='';
  document.getElementById('random-modal').classList.remove('hidden');document.body.style.overflow='hidden';
}
function closeModalVeil(e){if(e.target.id==='random-modal')forceCloseModal();}
function forceCloseModal(){document.getElementById('random-modal').classList.add('hidden');document.body.style.overflow='';}
function openModalRecipe(){forceCloseModal();if(currentRandom)openDetail(currentRandom.id);}
function reroll(){currentRandom=RECIPES[Math.floor(Math.random()*RECIPES.length)];showRandom(currentRandom);}

/* PIC MANAGER */
function closePicManager(){forceClosePicSheet();}
function closePicSheet(e){if(e.target.id==='pic-overlay')forceClosePicSheet();}
function forceClosePicSheet(){document.getElementById('pic-overlay').classList.add('hidden');document.body.style.overflow='';triggerSearch();}



/* ============================================================
   PICTURE MANAGER  — Device Upload Only
   Each recipe gets its own photo from the user's device.
   Stored as base64 in localStorage, keyed by recipe id.
   ============================================================ */

const PHOTO_KEY = 'dormchef_photos_v2';
let picTab = 'all'; // 'all' | 'missing' | 'done'

/* ─── Read / write photo store ─── */
function photoStore() {
  try { return JSON.parse(localStorage.getItem(PHOTO_KEY)) || {}; }
  catch { return {}; }
}
function savePhotoStore(store) {
  try {
    localStorage.setItem(PHOTO_KEY, JSON.stringify(store));
  } catch(e) {
    // localStorage might be full (base64 images are large)
    showToast('⚠️ Storage full! Try removing some photos first.');
  }
}

/* ─── Get custom photo for one recipe ─── */
function getCustomPhoto(recipeId) {
  return photoStore()[recipeId] || null;
}

/* ─── getImg: custom upload > recipe.image field > category fallback ─── */
// (already defined above, this comment is just a reminder of priority)

/* ─── Open / close manager ─── */
function openPicManager() {
  picTab = 'all';
  document.querySelectorAll('.pic-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('pic-tab-all')?.classList.add('active');
  document.getElementById('pic-search').value = '';
  renderPicManager();
  document.getElementById('pic-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closePicManager() {
  document.getElementById('pic-overlay').classList.add('hidden');
  document.body.style.overflow = '';
  triggerSearch(); // refresh cards with new photos
}

/* ─── Tab switching ─── */
function setPicTab(tab, btn) {
  picTab = tab;
  document.querySelectorAll('.pic-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderPicManager();
}

/* ─── Render manager list ─── */
function renderPicManager() {
  const store   = photoStore();
  const searchQ = (document.getElementById('pic-search')?.value || '').toLowerCase().trim();

  // Count stats
  const total    = RECIPES.length;
  const doneIds  = RECIPES.filter(r => store[r.id]).length;
  const missing  = total - doneIds;
  const pct      = Math.round((doneIds / total) * 100);

  // Update progress
  const fill  = document.getElementById('pic-progress-fill');
  const label = document.getElementById('pic-progress-label');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = `${doneIds} / ${total} photos uploaded`;

  // Update tab labels
  const tabAll     = document.getElementById('pic-tab-all');
  const tabMissing = document.getElementById('pic-tab-missing');
  const tabDone    = document.getElementById('pic-tab-done');
  if (tabAll)     tabAll.textContent     = `All (${total})`;
  if (tabMissing) tabMissing.textContent = `No Photo (${missing})`;
  if (tabDone)    tabDone.textContent    = `Uploaded (${doneIds})`;

  // Filter
  const filtered = RECIPES.filter(r => {
    const nameOk = !searchQ ||
      r.name.toLowerCase().includes(searchQ) ||
      r.category.toLowerCase().includes(searchQ);
    const hasPhoto = !!store[r.id];
    const tabOk =
      picTab === 'all'     ? true :
      picTab === 'missing' ? !hasPhoto :
      picTab === 'done'    ? hasPhoto : true;
    return nameOk && tabOk;
  });

  // Render rows
  const list = document.getElementById('pic-recipe-list');
  list.innerHTML = '';

  if (filtered.length === 0) {
    list.innerHTML = `<div class="pic-empty-msg">No recipes match this filter.</div>`;
    return;
  }

  filtered.forEach(recipe => {
    const customPhoto = store[recipe.id] || null;
    const emoji = CATEGORY_EMOJI[recipe.category] || '??️';
    const hasPic = !!customPhoto;

    const row = document.createElement('div');
    row.className = 'pic-row' + (hasPic ? ' pic-row--done' : '');
    row.id = 'pic-row-' + recipe.id;

    row.innerHTML = `
      <!-- Left: photo preview -->
      <div class="pic-preview" id="pic-preview-${recipe.id}">
        ${hasPic
          ? `<img src="${customPhoto}" alt="${recipe.name}" class="pic-preview-img"
               onerror="this.parentElement.innerHTML='${emoji}'">`
          : `<span class="pic-preview-emoji">${emoji}</span>`
        }
        ${hasPic ? '<div class="pic-preview-check">✓</div>' : ''}
      </div>

      <!-- Middle: info -->
      <div class="pic-row-info">
        <div class="pic-row-name">${recipe.name}</div>
        <div class="pic-row-meta">
          <span class="pic-row-cat">${recipe.category}</span>
          <span class="pic-row-status ${hasPic ? 'status-done' : 'status-none'}">
            ${hasPic ? '✓ Photo uploaded' : 'No photo yet'}
          </span>
        </div>
      </div>

      <!-- Right: upload button -->
      <div class="pic-row-actions">
        <label class="pic-upload-label" title="Upload photo from device">
          <input
            type="file"
            accept="image/*"
            class="pic-file-input"
            onchange="handleUpload(${recipe.id}, this)"
          />
          <span class="pic-upload-icon">??</span>
          <span class="pic-upload-text">${hasPic ? 'Change' : 'Upload'}</span>
        </label>
        ${hasPic ? `
          <button class="pic-remove-btn" onclick="removePhoto(${recipe.id})" title="Remove photo">
            ✕
          </button>` : ''}
      </div>
    `;

    list.appendChild(row);
  });
}

/* ─── Handle file upload ─── */
function handleUpload(recipeId, input) {
  const file = input.files[0];
  if (!file) return;

  // Check file type
  if (!file.type.startsWith('image/')) {
    showToast('⚠️ Please select an image file.');
    return;
  }

  // Warn if very large
  if (file.size > 5 * 1024 * 1024) {
    showToast('⚠️ Image is very large (>5MB). Compressing...');
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target.result;

    // Compress image via canvas to keep localStorage usage low
    compressImage(raw, 600, 0.82, (compressed) => {
      const store = photoStore();
      store[recipeId] = compressed;
      savePhotoStore(store);

      const recipe = RECIPES.find(r => r.id === recipeId);
      showToast(`✅ Photo saved for "${recipe?.name || 'recipe'}"!`);

      // Update the preview in-place (no full re-render needed)
      updatePreviewInPlace(recipeId, compressed);
      renderPicManager(); // refresh counts/tabs
    });
  };
  reader.onerror = () => showToast('❌ Failed to read file. Please try again.');
  reader.readAsDataURL(file);
}

/* ─── Compress image using canvas ─── */
function compressImage(dataUrl, maxWidth, quality, callback) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let w = img.width;
    let h = img.height;

    // Scale down if wider than maxWidth
    if (w > maxWidth) {
      h = Math.round((h * maxWidth) / w);
      w = maxWidth;
    }

    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);

    const compressed = canvas.toDataURL('image/jpeg', quality);
    callback(compressed);
  };
  img.onerror = () => callback(dataUrl); // fallback: use original
  img.src = dataUrl;
}

/* ─── Update preview without full re-render ─── */
function updatePreviewInPlace(recipeId, photoSrc) {
  const preview = document.getElementById('pic-preview-' + recipeId);
  if (!preview) return;
  preview.innerHTML = `
    <img src="${photoSrc}" alt="recipe photo" class="pic-preview-img">
    <div class="pic-preview-check">✓</div>
  `;
}

/* ─── Remove photo ─── */
function removePhoto(recipeId) {
  const store = photoStore();
  delete store[recipeId];
  savePhotoStore(store);
  const recipe = RECIPES.find(r => r.id === recipeId);
  showToast(`??️ Photo removed from "${recipe?.name || 'recipe'}".`);
  renderPicManager();
}

/* ─── Toast ─── */
let _toastTimer = null;
function showToast(msg) {
  let toast = document.getElementById('dc-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dc-toast';
    document.body.appendChild(toast);
    Object.assign(toast.style, {
      position: 'fixed', bottom: '28px', left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(15,10,3,0.96)',
      color: '#fff',
      fontFamily: "'Nunito', sans-serif",
      fontSize: '.88rem', fontWeight: '700',
      padding: '12px 24px',
      borderRadius: '30px',
      border: '1.5px solid rgba(245,166,35,0.45)',
      boxShadow: '0 8px 28px rgba(0,0,0,0.55)',
      zIndex: '9999',
      maxWidth: '340px',
      textAlign: 'center',
      pointerEvents: 'none',
      transition: 'opacity .3s',
      opacity: '0',
    });
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}
