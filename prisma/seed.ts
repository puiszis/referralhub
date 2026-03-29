import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "decorations" },
      update: {},
      create: { name: "Decorations", slug: "decorations", description: "Balloons, banners, backdrops, and themed decor to transform any space.", iconEmoji: "🎃", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "tableware" },
      update: {},
      create: { name: "Tableware", slug: "tableware", description: "Plates, cups, napkins, and tablescape essentials for every theme.", iconEmoji: "🍽️", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "costumes" },
      update: {},
      create: { name: "Costumes & Dress-Up", slug: "costumes", description: "Costumes, masks, props, and dress-up accessories for hosts and guests.", iconEmoji: "🧙", sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: "food-drink" },
      update: {},
      create: { name: "Food & Drink", slug: "food-drink", description: "Baking supplies, candy, drink dispensers, and themed food picks.", iconEmoji: "🧁", sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: "lighting-effects" },
      update: {},
      create: { name: "Lighting & Effects", slug: "lighting-effects", description: "LED lights, fog machines, projectors, and atmospheric effects.", iconEmoji: "✨", sortOrder: 5 },
    }),
    prisma.category.upsert({
      where: { slug: "party-games" },
      update: {},
      create: { name: "Party Games", slug: "party-games", description: "Games, activities, and entertainment for all ages.", iconEmoji: "🎲", sortOrder: 6 },
    }),
    prisma.category.upsert({
      where: { slug: "invitations" },
      update: {},
      create: { name: "Invitations & Stationery", slug: "invitations", description: "Printable invites, thank-you cards, and party signage.", iconEmoji: "💌", sortOrder: 7 },
    }),
  ]);

  // Deals
  const deals = [
    {
      title: "Amazon Party Supplies — 15% Off First Subscribe & Save",
      slug: "amazon-party-supplies-subscribe-save",
      storeName: "Amazon",
      storeUrl: "https://www.amazon.com",
      referralUrl: "https://www.amazon.com/?tag=bewitched-20",
      referralCode: "bewitched-20",
      categoryId: categories[0].id,
      descriptionShort: "Get 15% off party decorations, tableware, and more with Subscribe & Save on your first delivery.",
      descriptionLong: "Amazon's Subscribe & Save is a hidden gem for party planners who host frequently. Set up recurring deliveries of plates, napkins, balloons, and streamers — and get 15% off when you have 5+ items in a single delivery.\n\nI use this for bulk basics: solid color plates, napkins, and balloon packs. The prices beat party stores every time, and it shows up at your door.\n\nUse my referral link to shop and I'll earn a small commission on qualifying purchases.",
      creditType: "15% off for you, affiliate commission for us",
      creditValueUser: 15, creditValueOperator: 5, imageEmoji: "📦",
      tags: JSON.stringify(["amazon", "bulk", "decorations", "tableware"]),
      featured: true, status: "active", source: "manual", clickCount: 234,
    },
    {
      title: "Oriental Trading — Free Shipping on $49+",
      slug: "oriental-trading-free-shipping",
      storeName: "Oriental Trading",
      storeUrl: "https://www.orientaltrading.com",
      referralUrl: "https://www.orientaltrading.com/?ref=bewitched",
      referralCode: "bewitched",
      categoryId: categories[0].id,
      descriptionShort: "The ultimate bulk party supply store — free shipping when you spend $49 or more.",
      descriptionLong: "Oriental Trading is THE place for bulk party supplies at crazy low prices. We're talking 72-count balloon packs for under $10, themed tableware sets, and decorations for literally every party theme imaginable.\n\nTheir Halloween and holiday collections are unmatched. I order from them for every party I plan — the quality-to-price ratio can't be beat for disposable party supplies.\n\nFree shipping kicks in at $49, which is easy to hit when you're stocking up for a bash.",
      creditType: "Free shipping on $49+, affiliate commission for us",
      creditValueUser: 10, creditValueOperator: 8, imageEmoji: "🎉",
      tags: JSON.stringify(["bulk", "decorations", "tableware", "oriental-trading"]),
      featured: true, status: "active", source: "manual", clickCount: 187,
    },
    {
      title: "Spirit Halloween — $10 Off $50+ Purchase",
      slug: "spirit-halloween-10-off",
      storeName: "Spirit Halloween",
      storeUrl: "https://www.spirithalloween.com",
      referralUrl: "https://www.spirithalloween.com/?ref=bewitched10",
      referralCode: "bewitched10",
      categoryId: categories[2].id,
      descriptionShort: "Save $10 on costumes, animatronics, and Halloween decor when you spend $50+.",
      descriptionLong: "Spirit Halloween is the seasonal king for a reason. Their animatronics are the centerpiece of any Halloween party, and their costume selection is massive.\n\nI grab at least one new animatronic every year — they're the single best investment for a Halloween bash. Guests lose their minds over the motion-activated ones by the front door.\n\nUse my link for $10 off any purchase over $50. Works on costumes, props, and decor.",
      creditType: "$10 off $50+ for you, $5 credit for us",
      creditValueUser: 10, creditValueOperator: 5, imageEmoji: "👻",
      tags: JSON.stringify(["halloween", "costumes", "animatronics", "spirit"]),
      featured: true, status: "active", source: "manual", clickCount: 312,
      expiresAt: new Date("2026-11-01"),
    },
    {
      title: "Etsy — Unique Handmade Party Decor",
      slug: "etsy-handmade-party-decor",
      storeName: "Etsy",
      storeUrl: "https://www.etsy.com",
      referralUrl: "https://www.etsy.com/?ref=bewitched",
      referralCode: "bewitched",
      categoryId: categories[0].id,
      descriptionShort: "Discover one-of-a-kind party decorations, custom banners, and handmade centerpieces on Etsy.",
      descriptionLong: "For unique, Instagram-worthy party decor that nobody else will have, Etsy is unbeatable. Custom birthday banners, hand-painted cake toppers, and themed centerpieces that look like they cost 10x what you paid.\n\nI find my best tablescape pieces here — the personalized touches make a party feel special without a wedding-level budget.\n\nShop through my link and I'll earn a small referral bonus from Etsy.",
      creditType: "Affiliate commission for us",
      creditValueUser: 0, creditValueOperator: 4, imageEmoji: "🎨",
      tags: JSON.stringify(["etsy", "handmade", "custom", "decorations", "banners"]),
      featured: false, status: "active", source: "manual", clickCount: 156,
    },
    {
      title: "Party City — BOGO 50% Off Balloons",
      slug: "party-city-bogo-balloons",
      storeName: "Party City",
      storeUrl: "https://www.partycity.com",
      referralUrl: "https://www.partycity.com/?ref=bewitched",
      referralCode: "bewitched",
      categoryId: categories[0].id,
      descriptionShort: "Buy one get one 50% off all balloon bouquets and helium tanks at Party City.",
      descriptionLong: "Party City's balloon deals are hard to beat, especially the BOGO 50% off that runs regularly. Their helium tanks are the most convenient option if you're doing your own balloon arches at home.\n\nPro tip: order their pre-made balloon bouquets for pickup — saves you the hassle of inflating and tying dozens of balloons yourself.\n\nGrab the deal through my link for the current BOGO offer.",
      creditType: "BOGO 50% off for you, affiliate commission for us",
      creditValueUser: 25, creditValueOperator: 3, imageEmoji: "🎈",
      tags: JSON.stringify(["balloons", "party-city", "helium", "bogo"]),
      featured: false, status: "active", source: "manual", clickCount: 98,
    },
    {
      title: "LITFAD LED Fairy Lights — 20% Off First Order",
      slug: "litfad-led-fairy-lights",
      storeName: "LITFAD",
      storeUrl: "https://www.litfad.com",
      referralUrl: "https://www.litfad.com/?ref=bewitched20",
      referralCode: "bewitched20",
      categoryId: categories[4].id,
      descriptionShort: "Gorgeous LED fairy lights, string lights, and neon signs — 20% off your first purchase.",
      descriptionLong: "Lighting is the single biggest factor in party atmosphere, and LITFAD has some of the best decorative lighting I've found. Their fairy light curtains are stunning as photo backdrops, and the LED neon signs add instant personality to any setup.\n\nI use their warm white fairy light curtains for literally every party — they transform a basic room into something magical in 5 minutes.\n\n20% off your first order through my link.",
      creditType: "20% off for you, $5 credit for us",
      creditValueUser: 20, creditValueOperator: 5, imageEmoji: "💡",
      tags: JSON.stringify(["lights", "fairy-lights", "led", "neon", "atmosphere"]),
      featured: true, status: "active", source: "manual", clickCount: 203,
    },
    {
      title: "Instacart — $10 Off First Grocery Delivery",
      slug: "instacart-grocery-delivery",
      storeName: "Instacart",
      storeUrl: "https://www.instacart.com",
      referralUrl: "https://www.instacart.com/?ref=bewitched",
      referralCode: "bewitched",
      categoryId: categories[3].id,
      descriptionShort: "Get party snacks, drinks, and baking supplies delivered — $10 off your first order.",
      descriptionLong: "When party day arrives and you realize you forgot the punch ingredients, Instacart saves the day. Same-day delivery of snacks, drinks, produce, baking supplies — everything you need for the food table.\n\nI use it for every party to grab last-minute items without leaving the house during setup time. The $10 off first order makes it a no-brainer.\n\nSign up through my link and we both get credit.",
      creditType: "$10 off for you, $10 credit for us",
      creditValueUser: 10, creditValueOperator: 10, imageEmoji: "🛒",
      tags: JSON.stringify(["groceries", "delivery", "food", "snacks", "drinks"]),
      featured: false, status: "active", source: "manual", clickCount: 145,
    },
    {
      title: "Canva Pro — Free 30-Day Trial for Party Invites",
      slug: "canva-pro-party-invites",
      storeName: "Canva",
      storeUrl: "https://www.canva.com",
      referralUrl: "https://www.canva.com/?ref=bewitched",
      referralCode: "bewitched",
      categoryId: categories[6].id,
      descriptionShort: "Design gorgeous party invitations, menus, and signage with Canva Pro — free for 30 days.",
      descriptionLong: "Canva Pro is my secret weapon for party invitations, table signs, menus, and social media posts. The party-themed templates are incredible — you can have a professional-looking invite designed in 10 minutes.\n\nThe free trial gives you full access to premium templates, stock photos, and the background remover tool. Perfect for designing a full suite of party stationery.\n\nSign up through my link for a 30-day free trial.",
      creditType: "30-day free trial for you, referral credit for us",
      creditValueUser: 13, creditValueOperator: 7, imageEmoji: "✏️",
      tags: JSON.stringify(["invitations", "design", "canva", "stationery", "diy"]),
      featured: false, status: "active", source: "manual", clickCount: 89,
    },
  ];

  for (const deal of deals) {
    await prisma.deal.upsert({ where: { slug: deal.slug }, update: {}, create: deal });
  }

  // Blog Posts
  const blogPosts = [
    {
      title: "The Ultimate Halloween Bash — Everything You Need",
      slug: "ultimate-halloween-bash-guide",
      excerpt: "A complete guide to throwing a spooky, memorable Halloween party — from fog machines to witch's punch, every detail covered.",
      coverEmoji: "🎃",
      status: "published",
      publishedAt: new Date("2026-03-15"),
      tags: JSON.stringify(["halloween", "party-planning", "decorations", "complete-guide"]),
      dealSlugs: JSON.stringify(["spirit-halloween-10-off", "litfad-led-fairy-lights", "amazon-party-supplies-subscribe-save", "instacart-grocery-delivery"]),
      content: `Every unforgettable Halloween party starts with three things: atmosphere, food, and one great scare. This guide covers all of it.

## Setting the Scene

The single most impactful purchase for a Halloween party is a fog machine. A $30 fog machine transforms your entire space from "oh, there are some cobwebs" to "I'm genuinely not sure what's lurking in that corner." Pair it with purple or green LED lights and you're 90% of the way there.

### Must-Have Decorations

- Fog machine (the absolute #1 priority)
- LED string lights in purple, orange, or green
- Fake cobwebs (stretch them thin — less is more)
- One or two statement animatronics by the entrance
- Jack-o-lanterns (real or LED — both work great)
- A skeleton or two posed in unexpected places

## The Witch's Punch Bowl

This is the crowd-pleaser that takes 5 minutes to make. Combine:

- 2 liters of ginger ale
- 1 bottle of grape juice
- A scoop of lime sherbet (it bubbles and looks magical)
- Dry ice for fog effect (handle with tongs only!)

### Snack Table Essentials

Keep it simple with themed names for regular food:

- "Mummy Dogs" — hot dogs wrapped in crescent dough
- "Witch Finger Cookies" — sugar cookies shaped like fingers
- "Monster Eye Deviled Eggs" — with olive slice "pupils"
- A cheese board shaped like a coffin (seriously, it's easy)

## The Scare Factor

Plant one good scare. A motion-activated animatronic in a dark hallway or a friend hiding in a costume works every time. The anticipation is what makes it — let word spread that "something" is in the hallway.

## Music & Ambiance

Create a playlist that builds: start with moody instrumentals during arrival, transition to classic Halloween songs during dinner, then upbeat party music later. Spotify has great pre-made Halloween playlists.

## Budget Breakdown

A killer Halloween party for 20 people can be done for under $150:

- Fog machine: $30
- LED lights: $15
- Decorations (bulk): $25
- Food & drinks: $50
- Costumes/props: $30

The trick is buying bulk basics from Amazon or Oriental Trading and splurging on 1-2 statement pieces that create the "wow" factor.`,
      seoTitle: "Ultimate Halloween Party Guide 2026 | Bewitched Bashes",
      seoDescription: "Complete guide to throwing an unforgettable Halloween bash — decorations, food, drinks, and scare tactics on any budget.",
    },
    {
      title: "Enchanted Garden Party on a Budget",
      slug: "enchanted-garden-party-budget",
      excerpt: "Transform your backyard into a fairy-tale garden party without breaking the bank — string lights, wildflowers, and smart shopping.",
      coverEmoji: "🧚",
      status: "published",
      publishedAt: new Date("2026-03-20"),
      tags: JSON.stringify(["garden-party", "budget", "spring", "outdoor"]),
      dealSlugs: JSON.stringify(["litfad-led-fairy-lights", "etsy-handmade-party-decor", "canva-pro-party-invites", "oriental-trading-free-shipping"]),
      content: `You don't need a Pinterest-perfect estate to throw an enchanted garden party. You need string lights, wildflowers, and a plan.

## The Secret: Lighting Does All the Work

Wrap fairy lights around everything — trees, fences, table legs, umbrellas. At dusk, those lights transform any backyard into something magical. This is the one area where I say invest a bit — good warm-white fairy lights with a timer will last you years of parties.

## Flowers on a Budget

- Grocery store flowers in mason jars beat expensive arrangements every time
- Mix in greenery from your own yard (ferns, ivy, anything leafy)
- Scatter petals on the table for instant elegance
- Wildflower seed packets make great party favors (pennies each!)

## Tablescape Essentials

- Linen or burlap table runner (reusable for years)
- Mix-and-match vintage plates from thrift stores ($1 each!)
- Mason jars as cups with paper straws
- Handmade place cards from Canva (free templates!)

## Food & Drink

Go with a grazing board aesthetic — it looks impressive but it's just arranged snacks:

- Cheese, crackers, and fruit arranged on wooden boards
- Cucumber sandwiches cut into shapes
- Lemonade in a glass dispenser with fresh herbs
- A simple sheet cake decorated with edible flowers

## Entertainment

- Set up a flower crown-making station (wire + fake flowers from the craft store)
- Lawn games: croquet, badminton, bocce ball
- A Bluetooth speaker playing light acoustic or folk music
- A polaroid photo station with a floral frame

The whole party can cost under $100 if you shop smart and use what you already have.`,
      seoTitle: "Enchanted Garden Party on a Budget | Bewitched Bashes",
      seoDescription: "How to throw a magical garden party without breaking the bank — fairy lights, wildflowers, and smart shopping tips.",
    },
    {
      title: "Kids' Birthday Party Playbook: Ages 5-10",
      slug: "kids-birthday-party-playbook",
      excerpt: "Everything you need to throw an epic kids' birthday party — themes, games, food, and crowd control for the 5-10 age group.",
      coverEmoji: "🎂",
      status: "published",
      publishedAt: new Date("2026-03-25"),
      tags: JSON.stringify(["kids", "birthday", "games", "themes"]),
      dealSlugs: JSON.stringify(["amazon-party-supplies-subscribe-save", "party-city-bogo-balloons", "oriental-trading-free-shipping", "instacart-grocery-delivery"]),
      content: `The 5-10 age group is the sweet spot for birthday parties. They're old enough to play games independently but young enough to be absolutely thrilled by a balloon arch. Here's the playbook.

## Pick a Theme (But Keep It Simple)

The best themes for this age group are ones that translate into easy decorations and games:

- Dinosaurs (plastic dinos everywhere, excavation activity)
- Superheroes (capes as party favors, obstacle course)
- Unicorns/Rainbows (pastel everything, rainbow fruit skewers)
- Pirates (treasure hunt, eye patches)
- Space (glow sticks, constellation projector)

## The Timeline That Works

Here's the structure that prevents chaos — 2 hours total:

- 0:00-0:15 — Arrival + free play
- 0:15-0:45 — Organized game 1 + game 2
- 0:45-1:15 — Food, cake, presents
- 1:15-1:45 — Craft activity or free play
- 1:45-2:00 — Party favors + pickup

### Two hours. That's it. Trust me.

## Games That Actually Work

- Musical statues (easier to manage than chairs)
- Scavenger hunt (prepare a simple list + small prizes)
- Freeze dance (just needs a speaker)
- Pin the tail on the [theme animal]
- Relay races (for burning energy before food)

## Food: Keep It Simple

Kids don't care about your charcuterie skills. They want:

- Pizza (order it — don't make it)
- Fruit skewers (the only "healthy" thing they'll eat)
- Juice boxes
- The birthday cake

That's it. Really. Save your elaborate snack spread for the adult parties.

## The Party Favor Hack

Skip the plastic junk bags. Instead, give each kid ONE good thing related to the theme:

- Dinosaur party: a small dino figure
- Art party: a set of markers
- Space party: a glow stick bundle

It costs the same as a bag of junk but kids actually keep and use it.`,
      seoTitle: "Kids Birthday Party Guide Ages 5-10 | Bewitched Bashes",
      seoDescription: "The complete playbook for kids' birthday parties — themes, timed schedules, games, and the food they'll actually eat.",
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({ where: { slug: post.slug }, update: {}, create: post });
  }

  // Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      blogTitle: "Bewitched Bashes",
      tagline: "Spellbinding party planning & curated supplies",
      aboutContent: "We believe every celebration deserves a touch of magic. Bewitched Bashes is your one-stop grimoire for party planning inspiration, themed decoration guides, and hand-picked supply links that make entertaining effortless.\n\nFrom spooky Halloween soirées to enchanted garden parties, we curate the best deals and share step-by-step guides so you can focus on what matters — making memories with the people you love.\n\nEvery referral link on this site is for a product or service we genuinely recommend. When you shop through our links, we earn a small commission at no extra cost to you, which helps us keep the cauldron bubbling with fresh content.",
      operatorName: "The Bewitched Bashes Team",
      operatorEmail: "hello@bewitchedbashes.com",
    },
    create: {
      blogTitle: "Bewitched Bashes",
      tagline: "Spellbinding party planning & curated supplies",
      aboutContent: "We believe every celebration deserves a touch of magic.",
      operatorName: "The Bewitched Bashes Team",
      operatorEmail: "hello@bewitchedbashes.com",
    },
  });

  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
