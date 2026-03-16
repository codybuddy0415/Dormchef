/**
 * DormChef – Cinematic Glassmorphism Edition
 */
'use strict';

/* LANGUAGE */
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

function applyLang(){
  const l=L();
  document.getElementById('lang-en')?.classList.toggle('active',currentLang==='en');
  document.getElementById('lang-fil')?.classList.toggle('active',currentLang==='fil');
  const tg=document.querySelector('.site-tagline');if(tg)tg.textContent=l.tagline;
  const sf=document.getElementById('global-search');if(sf)sf.placeholder=l.searchPh;
  const is=document.getElementById('ingredient-search');if(is)is.placeholder=l.ingSearchPh;
  const cs=document.getElementById('cat-select');if(cs&&cs.options[0])cs.options[0].text=l.allCats;
  const rb=document.getElementById('btn-random');if(rb)rb.textContent='\uD83C\uDFB2 '+l.randomBtn;
  updateIngBadge();
  const km={pantry:l.pantry,proteins:l.proteins,vegetables:l.vegetables,instant:l.instant,condiments:l.condiments,tools:l.tools};
  document.querySelectorAll('.ing-section-label[data-key]').forEach(el=>{if(km[el.dataset.key])el.textContent=km[el.dataset.key];});
  const ep=document.querySelector('#empty-state p');if(ep)ep.textContent=l.noRecipes;
  const es=document.querySelector('#empty-state small');if(es)es.textContent=l.noRecipesSub;
  const eb=document.querySelector('#empty-state .random-btn');if(eb)eb.textContent=l.noRecipesBtn;
  const hp=document.querySelector('#start-hint p');if(hp)hp.textContent=l.hint;
  const db=document.getElementById('detail-back-btn');if(db)db.textContent=l.back;
  const fb=document.getElementById('fav-toggle-btn');if(fb)fb.textContent=fb.classList.contains('saved')?l.savedBtn:l.saveBtn;
  const ft=document.getElementById('fav-overlay-title');if(ft)ft.textContent=l.favTitle;
  const nfp=document.getElementById('no-fav-p');if(nfp)nfp.textContent=l.noSaved;
  const nfs=document.getElementById('no-fav-s');if(nfs)nfs.textContent=l.noSavedSub;
  const mt=document.getElementById('modal-tag');if(mt)mt.textContent=l.randomTag;
  const mv=document.getElementById('modal-view-btn');if(mv)mv.textContent=l.viewRecipe;
  const mr=document.getElementById('modal-roll-btn');if(mr)mr.textContent=l.rollAgain;
}

/* DATA */
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
  'Rice':       'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700&q=80',
  'Eggs':       'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700&q=80',
  'Canned':     'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&q=80',
  'Instant':    'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=80',
  'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&q=80',
  'Silog':      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&q=80',
  'Soup':       'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=80',
  'Ulam':       'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&q=80',
  'Fish':       'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=700&q=80',
  'Bread':      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&q=80',
  'Dessert':    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=700&q=80',
  'Salad':      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80',
  'Snacks':     'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=700&q=80',
  'Microwave':  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=700&q=80',
  'Rice Cooker':'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=700&q=80',
  'Breakfast':  'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=700&q=80'
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
    'Canned Tuna Pasta (No Pasta)': 'tuna+pasta+instant+noodles+hack'
  };
  const q = links[name] || encodeURIComponent(name + ' Filipino recipe');
  return 'https://www.youtube.com/results?search_query=' + q;
}


function getImg(r) {
  const custom = getCustomPhoto(r.id);
  if (custom) return custom;
  if (r.image && r.image.trim()) return r.image.trim();
  return CATEGORY_IMAGES[r.category] || CATEGORY_IMAGES['Ulam'];
}
function getEmoji(cat){return CATEGORY_EMOJI[cat]||'\uD83C\uDF7D\uFE0F';}
function getDesc(name){return RECIPE_DESC[name]||'A delicious Filipino recipe you can make in your dorm.';}

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
    cookingTime: '10 mins', estimatedCost: '₱15–₱25', category: 'Rice', image: 'fied rice.jpg'
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
    cookingTime: '12 mins', estimatedCost: '₱20–₱35', category: 'Rice', image: 'egg fried rice.jpg'
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
    cookingTime: '8 mins', estimatedCost: '₱12–₱20', category: 'Eggs', image: 'tortang itlog.jpg'
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
    cookingTime: '15 mins', estimatedCost: '₱25–₱40', category: 'Canned', image: 'sardines rice bowl.jpg'
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
    cookingTime: '12 mins', estimatedCost: '₱40–₱55', category: 'Rice', image: 'corned beef rice.jpg'
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
    cookingTime: '10 mins', estimatedCost: '₱30–₱45', category: 'Eggs', image: 'tuna omellete.jpg'
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
    cookingTime: '10 mins', estimatedCost: '₱20–₱30', category: 'Vegetables', image: 'ginisang repolyo.jpg'
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
    cookingTime: '10 mins', estimatedCost: '₱30–₱45', category: 'Rice', image: 'hotdog sinangag.jpg'
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
    cookingTime: '7 mins', estimatedCost: '₱12–₱18', category: 'Instant', image: 'instany mami.jpg'
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
    cookingTime: '12 mins', estimatedCost: '₱18–₱30', category: 'Instant', image: 'pancit canton.jpg'
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
    cookingTime: '15 mins', estimatedCost: '₱18–₱25', category: 'Eggs', image: 'tokwa baboy.jpg'
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
    cookingTime: '13 mins', estimatedCost: '₱55–₱70', category: 'Rice', image: 'spam rice.webp'
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
    cookingTime: '15 mins', estimatedCost: '₱40–₱60', category: 'Silog', image: 'tocilog.png'
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
    cookingTime: '18 mins', estimatedCost: '₱35–₱55', category: 'Silog', image: 'longsilog.png'
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
    cookingTime: '15 mins', estimatedCost: '₱30–₱45', category: 'Instant', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80'
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
    cookingTime: '8 mins', estimatedCost: '₱15–₱25', category: 'Vegetables', image: 'ginisang pichay.jpg'
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
    cookingTime: '20 mins', estimatedCost: '₱55–₱75', category: 'Rice', image: 'giniling baboy.jpg'
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
    cookingTime: '8 mins', estimatedCost: '₱15–₱25', category: 'Bread', image: 'egg sandwich.jpg'
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
    cookingTime: '35 mins', estimatedCost: '₱60–₱85', category: 'Soup', image: 'arozcaldo.jpg'
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
    cookingTime: '7 mins', estimatedCost: '₱15–₱22', category: 'Vegetables', image: 'gisang kanfkong.jpg'
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
    cookingTime: '18 mins', estimatedCost: '₱45–₱60', category: 'Eggs', image: 'tortang giniling.jpg'
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
    cookingTime: '30 mins', estimatedCost: '₱55–₱80', category: 'Fish', image: 'bangus'
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
    cookingTime: '35 mins', estimatedCost: '₱80–₱110', category: 'Soup', image: 'tinolang manok.jpg'
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
    cookingTime: '35 mins', estimatedCost: '₱75–₱100', category: 'Ulam', image: 'adobo manko.jpg'
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
    cookingTime: '35 mins', estimatedCost: '₱80–₱110', category: 'Ulam', image: 'pork Adobo.jpg'
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
    cookingTime: '12 mins', estimatedCost: '₱25–₱35', category: 'Canned', image: 'sardinas kamatis.jpg'
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
    cookingTime: '25 mins', estimatedCost: '₱55–₱75', category: 'Fish', image: 'pritong tilapia.jpg'
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
    cookingTime: '30 mins', estimatedCost: '₱70–₱95', category: 'Soup', image: 'sopas.jpg'
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
    cookingTime: '15 mins', estimatedCost: '₱20–₱35', category: 'Vegetables', image: 'sitaw.jpg'
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
    cookingTime: '30 mins', estimatedCost: '₱15–₱25', category: 'Soup', image: 'lugaw.jpg'
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
      'Serve rice with fried egg (substitute for tuyo with whatever salted fish is available).'
    ],
    cookingTime: '10 mins', estimatedCost: '₱10–₱20', category: 'Rice', image: 'tuyo.jpg'
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
    cookingTime: '3 mins', estimatedCost: '₱10–₱18', category: 'Microwave', image: 'microegg.jpg'
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
    cookingTime: '5 mins', estimatedCost: '₱20–₱30', category: 'Microwave', image: 'microrice.jpg'
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
    cookingTime: '20 mins', estimatedCost: '₱20–₱35', category: 'Eggs', image: 'talong omellete.webp'
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
      'Squeeze calamansi for sourness (substitute for sampaloc).',
      'Serve hot with rice.'
    ],
    cookingTime: '35 mins', estimatedCost: '₱90–₱120', category: 'Soup', image: 'pork sinigang.jpg'
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
      'Serve over rice (substitute for mung beans when not available).'
    ],
    cookingTime: '12 mins', estimatedCost: '₱25–₱40', category: 'Soup', image: 'Monggo.jpg'
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
    cookingTime: '8 mins', estimatedCost: '₱22–₱35', category: 'Ulam', image: 'hotegg.jpg'
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
    cookingTime: '15 mins', estimatedCost: '₱28–₱40', category: 'Instant', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80'
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
    cookingTime: '12 mins', estimatedCost: '₱20–₱30', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80'
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
    cookingTime: '12 mins', estimatedCost: '₱35–₱50', category: 'Eggs', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80'
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
    cookingTime: '20 mins', estimatedCost: '₱30–₱45', category: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80'
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
    cookingTime: '25 mins', estimatedCost: '₱10–₱20', category: 'Rice Cooker', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80'
  },
  // ── 45 ──
  {
    id: 45, name: 'Ginisang Ampalaya con Egg',
    ingredients: ['Ampalaya (Bitter Melon)', 'Egg', 'Tomato', 'Garlic', 'Onion', 'Salt', 'Cooking Oil'],
    tools: ['frying-pan'],
    steps: [
      'Salt ampalaya slices, rest 5 mins, squeeze dry.',
      'Sauté garlic, onion, tomato.',
      'Add ampalaya, stir-fry 4 minutes.',
      'Add beaten eggs, scramble everything together.',
      'Season with salt.',
      'Serve hot with rice.'
    ],
    cookingTime: '15 mins', estimatedCost: '₱22–₱32', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80'
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
    cookingTime: '45 mins', estimatedCost: '₱80–₱110', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '20 mins', estimatedCost: '₱30–₱45', category: 'Dessert', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80'
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
    cookingTime: '10 mins', estimatedCost: '₱20–₱35', category: 'Snacks', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80'
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
    cookingTime: '8 mins', estimatedCost: '₱35–₱50', category: 'Microwave', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80'
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
    cookingTime: '5 mins', estimatedCost: '₱12–₱20', category: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80'
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
    cookingTime: '35 mins', estimatedCost: '₱50–₱75', category: 'Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80'
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
    cookingTime: '15 mins', estimatedCost: '₱18–₱28', category: 'Rice', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80'
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
    cookingTime: '10 mins', estimatedCost: '₱18–₱28', category: 'Instant', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80'
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
    cookingTime: '18 mins', estimatedCost: '₱28–₱40', category: 'Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80'
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
    cookingTime: '30 mins', estimatedCost: '₱75–₱100', category: 'Rice Cooker', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '20 mins', estimatedCost: '₱15–₱25', category: 'Dessert', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80'
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
    cookingTime: '15 mins', estimatedCost: '₱25–₱40', category: 'Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80'
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
    cookingTime: '18 mins', estimatedCost: '₱60–₱80', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '20 mins', estimatedCost: '₱60–₱85', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '35 mins', estimatedCost: '₱65–₱90', category: 'Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80'
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
    cookingTime: '10 mins', estimatedCost: '₱15–₱25', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80'
  },
  // ── 62 ──
  {
    id: 62, name: 'Tuna Rice Cooker Bowl',
    ingredients: ['Rice', 'Tuna (canned)', 'Soy Sauce', 'Garlic', 'Green Onion'],
    tools: ['rice-cooker'],
    steps: [
      'Wash rice and place in cooker.',
      'Drain tuna and place on top of uncooked rice.',
      'Add minced garlic, soy sauce.',
      'Cook as normal.',
      'When done, mix tuna into rice.',
      'Top with green onion.'
    ],
    cookingTime: '20 mins', estimatedCost: '₱28–₱40', category: 'Rice Cooker', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80'
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
    cookingTime: '25 mins', estimatedCost: '₱30–₱45', category: 'Dessert', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80'
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
    cookingTime: '30 mins', estimatedCost: '₱60–₱85', category: 'Fish', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80'
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
    cookingTime: '40 mins', estimatedCost: '₱85–₱110', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '15 mins', estimatedCost: '₱28–₱40', category: 'Rice', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80'
  },
  // ── 67 ──
  {
    id: 67, name: 'Ginisang Upo (Bottle Gourd) Style with Sayote',
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
    cookingTime: '15 mins', estimatedCost: '₱45–₱65', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '10 mins', estimatedCost: '₱45–₱65', category: 'Bread', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80'
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
    cookingTime: '5 mins', estimatedCost: '₱15–₱22', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=600&q=80'
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
    cookingTime: '10 mins', estimatedCost: '₱28–₱40', category: 'Bread', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80'
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
    cookingTime: '35 mins', estimatedCost: '₱90–₱120', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '25 mins', estimatedCost: '₱28–₱38', category: 'Dessert', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80'
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
    cookingTime: '40 mins', estimatedCost: '₱80–₱110', category: 'Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80'
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
    cookingTime: '25 mins', estimatedCost: '₱70–₱95', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '6 mins', estimatedCost: '₱10–₱18', category: 'Eggs', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80'
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
    cookingTime: '10 mins', estimatedCost: '₱15–₱22', category: 'Instant', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80'
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
    cookingTime: '15 mins', estimatedCost: '₱70–₱90', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '10 mins', estimatedCost: '₱25–₱38', category: 'Eggs', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80'
  },
  // ── 79 ──
  {
    id: 79, name: 'Tomato Basura (Chilled Tomato Salad)',
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
    cookingTime: '5 mins', estimatedCost: '₱12–₱22', category: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80'
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
    cookingTime: '30 mins', estimatedCost: '₱30–₱45', category: 'Dessert', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80'
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
    cookingTime: '12 mins', estimatedCost: '₱18–₱28', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80'
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
    cookingTime: '35 mins', estimatedCost: '₱80–₱105', category: 'Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80'
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
    cookingTime: '15 mins', estimatedCost: '₱30–₱45', category: 'Fish', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80'
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
    cookingTime: '35 mins', estimatedCost: '₱75–₱100', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
  },
  // ── 85 ──
  {
    id: 85, name: 'Sinigang na Tuna',
    ingredients: ['Tuna (canned)', 'Tomato', 'Onion', 'Kangkong', 'Calamansi', 'Salt', 'Fish Sauce (Patis)'],
    tools: ['pot', 'electric-stove'],
    steps: [
      'Pour 3 cups water into pot.',
      'Add tomato and onion, boil.',
      'Add tuna (with oil).',
      'Squeeze lots of calamansi for sourness.',
      'Add kangkong.',
      'Season with patis and salt.',
      'Serve with rice.'
    ],
    cookingTime: '12 mins', estimatedCost: '₱28–₱42', category: 'Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80'
  },
  // ── 86 ──
  {
    id: 86, name: 'Fried Egg Rice with Chili Vinegar',
    ingredients: ['Rice', 'Egg', 'Vinegar', 'Garlic', 'Chili / Siling Labuyo', 'Cooking Oil', 'Salt'],
    tools: ['frying-pan', 'rice-cooker'],
    steps: [
      'Cook rice.',
      'Fry egg to your liking.',
      'Mix vinegar, minced chili, and garlic for sawsawan.',
      'Plate rice and egg.',
      'Pour chili vinegar sawsawan over everything.',
      'Mix and eat.'
    ],
    cookingTime: '10 mins', estimatedCost: '₱12–₱20', category: 'Eggs', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80'
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
    cookingTime: '35 mins', estimatedCost: '₱85–₱110', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '30 mins', estimatedCost: '₱70–₱95', category: 'Rice Cooker', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80'
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
    cookingTime: '30 mins', estimatedCost: '₱75–₱100', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '8 mins', estimatedCost: '₱12–₱20', category: 'Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80'
  },
  // ── 91 ──
  {
    id: 91, name: 'Turon Style Banana (Oven Version)',
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
    cookingTime: '20 mins', estimatedCost: '₱15–₱25', category: 'Snacks', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80'
  },
  // ── 92 ──
  {
    id: 92, name: 'Coconut Milk Rice (Sinanglaw Style)',
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
    cookingTime: '20 mins', estimatedCost: '₱25–₱35', category: 'Rice', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80'
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
    cookingTime: '25 mins', estimatedCost: '₱60–₱85', category: 'Fish', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80'
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
    cookingTime: '12 mins', estimatedCost: '₱35–₱55', category: 'Microwave', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80'
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
    cookingTime: '20 mins (+ marinating)', estimatedCost: '₱60–₱80', category: 'Ulam', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80'
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
    cookingTime: '25 mins', estimatedCost: '₱35–₱50', category: 'Dessert', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80'
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
    cookingTime: '15 mins', estimatedCost: '₱40–₱55', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '20 mins', estimatedCost: '₱65–₱85', category: 'Ulam', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
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
    cookingTime: '10 mins', estimatedCost: '₱22–₱35', category: 'Eggs', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80'
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
    cookingTime: '10 mins', estimatedCost: '₱15–₱25', category: 'Bread', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80'
  }
];

/* STATE */
let selectedIngredients=new Set(),selectedTools=new Set();
let currentRecipe=null,currentRandom=null;
let favorites=loadFavs(),ingPanelOpen=false,searchTimer=null;

/* INIT */
document.addEventListener('DOMContentLoaded',()=>{buildIngChips();buildToolChips();applyLang();});

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
  updateIngBadge();triggerSearch();
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
  cb.closest('.chip-label').classList.toggle('checked',cb.checked);triggerSearch();
}
function updateIngBadge(){
  const n=selectedIngredients.size;
  const badge=document.getElementById('ing-badge');
  const lbl=document.getElementById('ing-toggle-label');
  if(badge){badge.textContent=n;badge.classList.toggle('hidden',n===0);}
  if(lbl)lbl.textContent=n>0?L().ingSelected(n):'\uD83E\uDD18 '+L().ingToggle;
}
function filterIngredients(){
  const q=document.getElementById('ingredient-search').value.toLowerCase().trim();
  document.querySelectorAll('.chip-label').forEach(l=>{
    const n=l.dataset.ingredient||'';
    l.classList.toggle('hidden-chip',q.length>0&&!n.includes(q));
  });
}
function toggleIngPanel(){
  ingPanelOpen=!ingPanelOpen;
  document.getElementById('ing-panel').classList.toggle('open',ingPanelOpen);
  document.getElementById('ing-toggle-btn').classList.toggle('open',ingPanelOpen);
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

/* RENDER */
function showHint(){
  document.getElementById('start-hint').classList.remove('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('results-label').innerHTML='';
  document.getElementById('recipes-container').innerHTML='';
}
function hideHint(){document.getElementById('start-hint').classList.add('hidden');}

function renderCards(scored){
  const container=document.getElementById('recipes-container');
  const emptyEl=document.getElementById('empty-state');
  const labelEl=document.getElementById('results-label');
  container.innerHTML='';
  if(scored.length===0){emptyEl.classList.remove('hidden');labelEl.innerHTML='';return;}
  emptyEl.classList.add('hidden');
  labelEl.innerHTML=L().results(scored.length);
  scored.forEach(({r,matched,ratio})=>{
    const pct=Math.round(ratio*100);
    const isFav=favorites.some(f=>f.id===r.id);
    const imgUrl=getImg(r);const ytUrl=getYouTubeLink(r.name);const desc=getDesc(r.name);
    const ingTag=selectedIngredients.size>0?L().ingCount(matched,r.ingredients.length):`${r.ingredients.length} ingredients`;
    const badge=selectedIngredients.size>0?`<div class="match-badge ${pct>=75?'match-high':'match-mid'}">${pct}%</div>`:'';
    const card=document.createElement('div');card.className='recipe-card';
    card.innerHTML=`
      <div class="card-inner">
        <div class="card-img-wrap">
          <img class="card-img" src="${imgUrl}" alt="${r.name}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="card-img-placeholder" style="display:none">${getEmoji(r.category)}</div>
        </div>
        <div class="card-content">
          <div class="card-top-row"><div class="card-name">${r.name}</div>${badge}</div>
          <div class="card-desc">${desc}</div>
          <div class="card-meta">
            <span class="meta-tag cat">${r.category}</span>
            <span class="meta-tag">⏱ ${r.cookingTime}</span>
            <span class="meta-tag">₱ ${r.estimatedCost.replace('₱','')}</span>
            <span class="meta-tag">${ingTag}</span>
          </div>
          <div class="card-bottom">
            <a class="watch-link" href="${ytUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 7a2.4 2.4 0 00-1.69-1.7C16.35 5 12 5 12 5s-4.35 0-5.9.3A2.4 2.4 0 004.41 7 25 25 0 004.1 12a25 25 0 00.31 5 2.4 2.4 0 001.69 1.7C7.65 19 12 19 12 19s4.35 0 5.9-.3A2.4 2.4 0 0019.59 17 25 25 0 0019.9 12a25 25 0 00-.31-5zM10 15V9l5.2 3z"/></svg>
              ${L().watchYT}
            </a>
            <button class="card-fav-btn ${isFav?'saved':''}" onclick="event.stopPropagation();quickFav(${r.id},this)">${isFav?'♥':'♡'}</button>
          </div>
        </div>
      </div>`;
    card.addEventListener('click',()=>openDetail(r.id));
    container.appendChild(card);
  });
}

/* DETAIL */
function openDetail(id){
  currentRecipe=RECIPES.find(r=>r.id===id);if(!currentRecipe)return;
  renderDetail(currentRecipe);updateSaveBtn();
  document.getElementById('detail-overlay').classList.remove('hidden');
  document.body.style.overflow='hidden';
}
function closeDetail(){
  document.getElementById('detail-overlay').classList.add('hidden');
  document.body.style.overflow='';
}
function renderDetail(r){
  const body=document.getElementById('detail-body');
  const imgUrl=getImg(r);const ytUrl=getYouTubeLink(r.name);
  const toolsHtml=r.tools.map(tid=>{const t=TOOLS.find(x=>x.id===tid);return t?`<span class="tool-pill">${t.icon} ${t.name}</span>`:''}).join('');
  const ings=r.ingredients.map(i=>`<li>${i}</li>`).join('');
  const steps=r.steps.map((s,i)=>`<div class="step-item"><div class="step-num">${i+1}</div><div class="step-text">${s}</div></div>`).join('');
  body.innerHTML=`
    <div class="detail-hero-wrap">
      <img class="detail-hero-img" src="${imgUrl}" alt="${r.name}" onerror="this.style.background='rgba(192,57,43,0.2)';this.style.height='160px'">
      <div class="detail-hero-gradient"></div>
    </div>
    <div class="detail-hero-text">
      <div class="detail-name">${r.name}</div>
      <div class="detail-meta-pills">
        <span class="detail-meta-pill cat">${r.category}</span>
        <span class="detail-meta-pill">⏱ ${r.cookingTime}</span>
        <span class="detail-meta-pill">₱ ${r.estimatedCost.replace('₱','')}</span>
      </div>
    </div>
    <a class="yt-watch-btn" href="${ytUrl}" target="_blank" rel="noopener">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 7a2.4 2.4 0 00-1.69-1.7C16.35 5 12 5 12 5s-4.35 0-5.9.3A2.4 2.4 0 004.41 7 25 25 0 004.1 12a25 25 0 00.31 5 2.4 2.4 0 001.69 1.7C7.65 19 12 19 12 19s4.35 0 5.9-.3A2.4 2.4 0 0019.59 17 25 25 0 0019.9 12a25 25 0 00-.31-5zM10 15V9l5.2 3z"/></svg>
      ${L().watchYT}
    </a>
    <div class="detail-section"><div class="detail-section-title">${L().toolsSection}</div><div class="tools-pills">${toolsHtml}</div></div>
    <div class="detail-section"><div class="detail-section-title">${L().ingSection}</div><ul class="detail-list">${ings}</ul></div>
    <div class="detail-section"><div class="detail-section-title">${L().stepsSection}</div><div class="detail-steps">${steps}</div></div>`;
}
function updateSaveBtn(){
  const btn=document.getElementById('fav-toggle-btn');if(!btn||!currentRecipe)return;
  const saved=favorites.some(f=>f.id===currentRecipe.id);
  btn.textContent=saved?L().savedBtn:L().saveBtn;btn.classList.toggle('saved',saved);
}

/* FAVORITES */
function loadFavs(){try{return JSON.parse(localStorage.getItem('dormchef_favorites'))||[];}catch{return[];}}
function saveFavs(){localStorage.setItem('dormchef_favorites',JSON.stringify(favorites));}
function toggleFavorite(){
  if(!currentRecipe)return;
  const idx=favorites.findIndex(f=>f.id===currentRecipe.id);
  if(idx>=0)favorites.splice(idx,1);else favorites.push(currentRecipe);
  saveFavs();updateSaveBtn();
}
function quickFav(id,btn){
  const r=RECIPES.find(x=>x.id===id);if(!r)return;
  const idx=favorites.findIndex(f=>f.id===id);
  if(idx>=0){favorites.splice(idx,1);btn.innerHTML='♡';btn.classList.remove('saved');}
  else{favorites.push(r);btn.innerHTML='♥';btn.classList.add('saved');}
  saveFavs();
}
function openFavorites(){renderFavList();document.getElementById('fav-overlay').classList.remove('hidden');document.body.style.overflow='hidden';}
function closeFavOverlay(){document.getElementById('fav-overlay').classList.add('hidden');document.body.style.overflow='';}
function renderFavList(){
  const list=document.getElementById('fav-list');const noFav=document.getElementById('no-fav');
  list.innerHTML='';
  if(favorites.length===0){noFav.classList.remove('hidden');return;}
  noFav.classList.add('hidden');
  favorites.forEach(r=>{
    const row=document.createElement('div');row.className='fav-mini-card';
    row.innerHTML=`<img class="fav-mini-img" src="${getImg(r)}" alt="${r.name}" onerror="this.style.background='rgba(255,255,255,0.1)'"><div class="fav-mini-info"><div class="fav-mini-name">${r.name}</div><div class="fav-mini-meta">${r.category} · ${r.cookingTime}</div></div><button class="fav-mini-remove" onclick="event.stopPropagation();removeFav(${r.id})">✕</button>`;
    row.addEventListener('click',()=>{closeFavOverlay();openDetail(r.id);});
    list.appendChild(row);
  });
}
function removeFav(id){
  const idx=favorites.findIndex(f=>f.id===id);if(idx>=0)favorites.splice(idx,1);
  saveFavs();renderFavList();
}
function goTo(p){if(p==='page-favorites')openFavorites();}

/* RANDOM */
function randomRecipe(){currentRandom=RECIPES[Math.floor(Math.random()*RECIPES.length)];showRandom(currentRandom);}
function showRandom(r){
  document.getElementById('modal-img').src=getImg(r);
  document.getElementById('modal-name').textContent=r.name;
  document.getElementById('modal-meta').innerHTML=`<span>${r.category}</span><span>⏱ ${r.cookingTime}</span><span>₱ ${r.estimatedCost.replace('₱','')}</span>`;
  const d=document.getElementById('modal-dice');d.style.animation='none';void d.offsetWidth;d.style.animation='';
  document.getElementById('random-modal').classList.remove('hidden');document.body.style.overflow='hidden';
}
function closeModalBg(e){if(e.target.id==='random-modal'){document.getElementById('random-modal').classList.add('hidden');document.body.style.overflow='';}}
function openModalRecipe(){document.getElementById('random-modal').classList.add('hidden');document.body.style.overflow='';if(currentRandom)openDetail(currentRandom.id);}
function reroll(){currentRandom=RECIPES[Math.floor(Math.random()*RECIPES.length)];showRandom(currentRandom);}



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
    const emoji = CATEGORY_EMOJI[recipe.category] || '🍽️';
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
          <span class="pic-upload-icon">📷</span>
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
  showToast(`🗑️ Photo removed from "${recipe?.name || 'recipe'}".`);
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
