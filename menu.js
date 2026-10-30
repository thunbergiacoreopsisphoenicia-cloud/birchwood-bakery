// Today's bake. Prices are in cents. `left` is what is still on the rack.
window.BIRCHWOOD_MENU = [
  { id: 'sourdough', cat: 'Loaves', name: 'Country sourdough', desc: 'Long-fermented white and wholewheat, thick blistered crust.', weight: '900 g', out: '7:10', price: 950, left: 14 },
  { id: 'rye', cat: 'Loaves', name: 'Rye and caraway tin', desc: 'Dense, sour and sliceable thin. Keeps for five days.', weight: '750 g', out: '7:10', price: 800, left: 9 },
  { id: 'spelt', cat: 'Loaves', name: 'Seeded spelt', desc: 'Sunflower, pumpkin and flax in a soft spelt crumb.', weight: '800 g', out: '7:40', price: 900, left: 11 },
  { id: 'walnut', cat: 'Loaves', name: 'Walnut and raisin', desc: 'Toasted walnuts, plump raisins, a little rye in the dough.', weight: '700 g', out: '8:00', price: 850, left: 5 },

  { id: 'croissant', cat: 'Pastry', name: 'Butter croissant', desc: 'Three days of folding, 82% butter, baked dark.', weight: '85 g', out: '7:00', price: 360, left: 22 },
  { id: 'painchoc', cat: 'Pastry', name: 'Pain au chocolat', desc: 'Two batons of dark chocolate, laminated dough.', weight: '95 g', out: '7:00', price: 400, left: 18 },
  { id: 'cardamom', cat: 'Pastry', name: 'Cardamom knot', desc: 'Enriched dough, ground cardamom, pearl sugar.', weight: '110 g', out: '7:30', price: 420, left: 3 },
  { id: 'almond', cat: 'Pastry', name: 'Almond croissant', desc: 'Yesterday’s croissant, frangipane, toasted flakes.', weight: '120 g', out: '8:15', price: 460, left: 0 },

  { id: 'financier', cat: 'Sweet', name: 'Brown butter financier', desc: 'Almond, burnt butter, a crisp edge.', weight: '45 g', out: '8:30', price: 320, left: 16 },
  { id: 'lemon', cat: 'Sweet', name: 'Lemon tart', desc: 'Sweet pastry, set lemon curd, no meringue.', weight: '140 g', out: '9:00', price: 520, left: 8 },
  { id: 'plum', cat: 'Sweet', name: 'Plum frangipane tart', desc: 'Roasted plums on almond cream. Seasonal, until they run out.', weight: '150 g', out: '9:00', price: 550, left: 6 },

  { id: 'scone', cat: 'Savoury', name: 'Cheddar and chive scone', desc: 'Mature cheddar, buttermilk, split and still warm at 8.', weight: '110 g', out: '7:45', price: 380, left: 12 },
  { id: 'sausage', cat: 'Savoury', name: 'Sausage roll', desc: 'Pork shoulder, fennel seed, rough puff.', weight: '160 g', out: '9:30', price: 450, left: 10 },
  { id: 'focaccia', cat: 'Savoury', name: 'Rosemary focaccia square', desc: 'Olive oil, flaky salt, potato slices on top.', weight: '180 g', out: '9:30', price: 400, left: 7 }
];

// Pickup slots, every 30 minutes while the counter is open.
window.BIRCHWOOD_SLOTS = ['7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];
