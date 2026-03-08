import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.reflection.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.flipCard.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.module.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@fli.org",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  // Create demo student
  const studentHash = await bcrypt.hash("student123", 12);
  await prisma.user.create({
    data: {
      name: "Demo Student",
      email: "student@fli.org",
      passwordHash: studentHash,
      role: "STUDENT",
    },
  });

  // ── MODULE 1 ──
  const mod1 = await prisma.module.create({
    data: {
      title: "Understanding the Global Metacrisis",
      description:
        "Explore the interconnected global crises shaping our world — from climate change and biodiversity loss to economic inequality. Learn systems thinking and understand why everything feels connected.",
      order: 1,
    },
  });

  // Unit 1.1
  const u11 = await prisma.unit.create({
    data: {
      moduleId: mod1.id,
      title: "The Metacrisis: Why Everything Feels Connected",
      order: 1,
      intro:
        "Take a moment and think about the challenges we hear about in the news: climate change, biodiversity loss, water scarcity, rising food prices, economic inequality. At first glance these may appear to be separate problems. But scientists and systems thinkers increasingly describe them as part of a single interconnected phenomenon. They call this the Metacrisis.",
      conceptText:
        "The metacrisis refers to the combined impact of multiple global crises that interact and reinforce each other.\n\nInstead of isolated challenges, we are facing a network of interconnected systems under pressure.\n\nExamples include:\n• Climate change → affecting agriculture\n• Agriculture disruption → increasing food prices\n• Food instability → causing political tensions\n\nEach crisis influences others. This interconnected nature makes global challenges harder to solve but also reveals opportunities for systemic solutions.",
      frameworkText:
        "Core Insight: Your challenge is not isolated.\n\nThe problems you see locally are connected to global systems of energy, food, economy, and environment.\n\nUnderstanding these systems is the first step toward creating meaningful solutions.",
      caseStudy:
        "Consider how climate change affects agriculture in developing nations. When droughts reduce crop yields, food prices rise. Rising food prices can trigger political instability and migration. This chain reaction demonstrates how environmental, economic, and social systems are deeply interconnected — the essence of the metacrisis.",
      videoUrl: "https://www.youtube.com/watch?v=pJfLcAsgey4",
      reflectionPrompt:
        "Think about an environmental challenge in your community (waste management, water scarcity, urban pollution, declining crop productivity). What other systems might influence this challenge?",
    },
  });

  await prisma.flipCard.create({
    data: {
      unitId: u11.id,
      front: "What does the term Metacrisis mean?",
      back: "A system of interconnected global crises that reinforce each other.",
    },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u11.id,
        question: "What is the metacrisis?",
        options: JSON.stringify([
          "A single environmental problem",
          "A system of interconnected global crises that reinforce each other",
          "A new type of economic theory",
          "A political movement",
        ]),
        correctAnswer:
          "A system of interconnected global crises that reinforce each other",
      },
      {
        unitId: u11.id,
        question:
          "How does climate change relate to food instability in the metacrisis framework?",
        options: JSON.stringify([
          "They are unrelated issues",
          "Climate change affects agriculture, which increases food prices and can cause political tensions",
          "Food instability causes climate change",
          "Climate change only affects coastal cities",
        ]),
        correctAnswer:
          "Climate change affects agriculture, which increases food prices and can cause political tensions",
      },
    ],
  });

  // Unit 1.2
  const u12 = await prisma.unit.create({
    data: {
      moduleId: mod1.id,
      title: "Living in a VUCA World",
      order: 2,
      intro:
        "The world today is often described using the concept VUCA. VUCA was originally developed by military strategists but is now widely used in leadership and sustainability studies. It describes the nature of complex modern systems.",
      conceptText:
        "VUCA stands for:\n\n• Volatility — Rapid and unpredictable change\n• Uncertainty — Future outcomes are difficult to predict\n• Complexity — Many interconnected variables influence outcomes\n• Ambiguity — Situations where cause and effect relationships are unclear\n\nTraditional problem-solving assumes problems are simple and predictable. But solving climate challenges requires adaptability, interdisciplinary thinking, collaboration, and systems awareness.",
      frameworkText:
        "The VUCA framework helps us understand why environmental and economic challenges are difficult to solve with traditional approaches.\n\nVolatility: Renewable energy technologies evolving rapidly.\nUncertainty: Climate models predict trends but exact regional impacts vary.\nComplexity: Energy policy affects jobs, climate, and geopolitics.\nAmbiguity: Large hydroelectric dams provide clean energy but can damage ecosystems.",
      caseStudy:
        "Consider the rapid evolution of renewable energy technologies. Solar panel costs have dropped over 90% in a decade — an example of volatility. Meanwhile, predicting which regions will adopt green energy fastest remains uncertain. Energy policy simultaneously affects employment, climate, and geopolitics — complexity in action.",
      videoUrl: "https://www.youtube.com/watch?v=SbOhCRqmfxA",
      reflectionPrompt:
        "What is one issue in your region that involves many different stakeholders? For example: water management involving farmers, government, and urban populations.",
    },
  });

  await prisma.flipCard.createMany({
    data: [
      {
        unitId: u12.id,
        front: "What does V stand for in VUCA?",
        back: "Volatility — Rapid and unpredictable change. Example: Renewable energy technologies evolving rapidly.",
      },
      {
        unitId: u12.id,
        front: "What does U stand for in VUCA?",
        back: "Uncertainty — Future outcomes are difficult to predict. Example: Climate models predict trends but exact regional impacts vary.",
      },
      {
        unitId: u12.id,
        front: "What does C stand for in VUCA?",
        back: "Complexity — Many interconnected variables influence outcomes. Example: Energy policy affects jobs, climate, and geopolitics.",
      },
      {
        unitId: u12.id,
        front: "What does A stand for in VUCA?",
        back: "Ambiguity — Situations where cause and effect relationships are unclear. Example: Large hydroelectric dams provide clean energy but can damage ecosystems.",
      },
    ],
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u12.id,
        question: "What does VUCA stand for?",
        options: JSON.stringify([
          "Vision, Unity, Clarity, Action",
          "Volatility, Uncertainty, Complexity, Ambiguity",
          "Value, Understanding, Cooperation, Awareness",
          "Variety, Uniformity, Capacity, Adaptability",
        ]),
        correctAnswer: "Volatility, Uncertainty, Complexity, Ambiguity",
      },
      {
        unitId: u12.id,
        question: "Why do climate challenges require systems thinking?",
        options: JSON.stringify([
          "Because they are simple problems",
          "Because many interconnected variables influence outcomes",
          "Because only governments can solve them",
          "Because technology alone provides all answers",
        ]),
        correctAnswer:
          "Because many interconnected variables influence outcomes",
      },
    ],
  });

  // Unit 1.3
  const u13 = await prisma.unit.create({
    data: {
      moduleId: mod1.id,
      title: "Planetary Boundaries",
      order: 3,
      intro:
        "For centuries, humans assumed Earth's natural resources were effectively limitless. However modern research shows the planet has ecological limits. Scientists call these limits Planetary Boundaries. This framework was developed by researchers at the Stockholm Resilience Centre.",
      conceptText:
        "Scientists identified nine key environmental systems that regulate Earth's stability:\n\n1. Climate change\n2. Biodiversity loss\n3. Land system change\n4. Freshwater use\n5. Nitrogen and phosphorus cycles\n6. Ocean acidification\n7. Atmospheric aerosol loading\n8. Ozone depletion\n9. Chemical pollution\n\nCrossing these boundaries increases the risk of destabilizing planetary systems.",
      frameworkText:
        "The Planetary Boundaries framework provides a scientific basis for understanding Earth's ecological limits. Each boundary represents a threshold — crossing it increases the risk of large-scale, irreversible environmental change.\n\nCurrently, scientists estimate that at least six of the nine boundaries have already been crossed, including climate change, biodiversity loss, and nitrogen/phosphorus cycles.",
      caseStudy:
        "Scientists warn that the Amazon rainforest may be approaching a tipping point. If large areas of the forest disappear, rainfall cycles across South America could change dramatically. This illustrates how environmental systems operate as interconnected networks.",
      videoUrl: "https://www.youtube.com/watch?v=RgqtrlixYR4",
      reflectionPrompt:
        "Which planetary boundary do you think is most relevant to your community? Why?",
    },
  });

  await prisma.flipCard.create({
    data: {
      unitId: u13.id,
      front: "What happens when planetary boundaries are crossed?",
      back: "Earth systems may become unstable and less capable of supporting human civilization.",
    },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u13.id,
        question: "How many planetary boundaries have scientists identified?",
        options: JSON.stringify(["5", "7", "9", "12"]),
        correctAnswer: "9",
      },
      {
        unitId: u13.id,
        question: "What is the risk of crossing planetary boundaries?",
        options: JSON.stringify([
          "Economic growth increases",
          "Earth systems may become unstable",
          "New resources are discovered",
          "Technology advances faster",
        ]),
        correctAnswer: "Earth systems may become unstable",
      },
    ],
  });

  // Unit 1.4
  const u14 = await prisma.unit.create({
    data: {
      moduleId: mod1.id,
      title: "Environmental Awakening: A Timeline",
      order: 4,
      intro:
        "Environmental awareness did not emerge overnight. It evolved through scientific discoveries, environmental disasters, and international cooperation.",
      conceptText:
        "Key Moments in Environmental History:\n\n1962 — Silent Spring: Rachel Carson's book exposed the environmental impact of pesticides.\n\n1972 — Stockholm Conference: The first major international conference on environmental protection.\n\n1987 — Brundtland Report: Introduced the concept of sustainable development.\n\n1997 — Kyoto Protocol: First international treaty focused on reducing greenhouse gas emissions.\n\n2015 — Paris Agreement: Global commitment to limit climate change to well below 2°C.",
      frameworkText:
        "These milestones shaped modern environmental policy and created the framework for global climate action. Each event built upon previous discoveries and agreements, gradually creating the international consensus needed to address climate change at a global scale.",
      caseStudy:
        "The Paris Agreement of 2015 brought together 196 nations in a shared commitment to limit global warming. It represented decades of scientific research, public advocacy, and diplomatic negotiation — showing how environmental progress requires sustained global cooperation.",
      videoUrl: "https://www.youtube.com/watch?v=5cDyzmP4V-0",
      reflectionPrompt:
        "Why do you think global cooperation is necessary for solving environmental challenges?",
    },
  });

  await prisma.flipCard.createMany({
    data: [
      {
        unitId: u14.id,
        front: "What was Silent Spring (1962)?",
        back: "Rachel Carson's book that exposed the environmental impact of pesticides and sparked modern environmentalism.",
      },
      {
        unitId: u14.id,
        front: "What was the Paris Agreement (2015)?",
        back: "A global commitment by 196 nations to limit climate change to well below 2°C above pre-industrial levels.",
      },
    ],
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u14.id,
        question: "Which book launched modern environmental awareness in 1962?",
        options: JSON.stringify([
          "The Limits to Growth",
          "Silent Spring",
          "An Inconvenient Truth",
          "Our Common Future",
        ]),
        correctAnswer: "Silent Spring",
      },
      {
        unitId: u14.id,
        question:
          "What did the Paris Agreement (2015) commit nations to?",
        options: JSON.stringify([
          "Eliminating all fossil fuels by 2020",
          "Limiting climate change to well below 2°C",
          "Banning plastic production",
          "Creating a global carbon tax",
        ]),
        correctAnswer: "Limiting climate change to well below 2°C",
      },
    ],
  });

  // ── MODULE 2 ──
  const mod2 = await prisma.module.create({
    data: {
      title: "Rethinking the Economy",
      description:
        "Understand how economic systems relate to environmental challenges. Explore concepts like externalities, doughnut economics, circular economy, and regenerative thinking.",
      order: 2,
    },
  });

  // Unit 2.1
  const u21 = await prisma.unit.create({
    data: {
      moduleId: mod2.id,
      title: "From Industrial Economy to Green Economy",
      order: 1,
      intro:
        "The modern global economy developed during the Industrial Revolution. It was powered by coal, oil, large-scale manufacturing, and resource extraction. This system created enormous economic growth but also environmental damage.",
      conceptText:
        "Many environmental costs were treated as externalities — costs that are not reflected in market prices.\n\nExamples include:\n• Air pollution\n• Water contamination\n• Climate emissions\n\nA green economy attempts to redesign economic systems to reduce these externalities. Instead of ignoring environmental damage, a green economy accounts for ecological costs in economic decisions.",
      frameworkText:
        "The transition from an industrial to a green economy involves fundamentally rethinking how we measure value. Traditional GDP measurements ignore environmental degradation. Green economic frameworks incorporate natural capital — the value of ecosystems, clean air, and water — into economic planning.",
      caseStudy:
        "Renewable energy produces electricity without the large carbon emissions associated with fossil fuels. Countries like Germany and Denmark have demonstrated that transitioning to renewable energy can create new jobs and industries while reducing environmental damage.",
      videoUrl: "https://www.youtube.com/watch?v=Rhcrbcg8HBw",
      reflectionPrompt:
        "Can you think of an environmental cost in your area that is not reflected in the price of goods or services?",
    },
  });

  await prisma.flipCard.createMany({
    data: [
      {
        unitId: u21.id,
        front: "What are externalities?",
        back: "Costs (like pollution or emissions) that are not reflected in market prices but affect society and the environment.",
      },
      {
        unitId: u21.id,
        front: "What is a green economy?",
        back: "An economic system redesigned to reduce environmental externalities and account for ecological costs in decisions.",
      },
    ],
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u21.id,
        question: "What are externalities in economics?",
        options: JSON.stringify([
          "Profits from international trade",
          "Costs not reflected in market prices",
          "Government subsidies",
          "Foreign investments",
        ]),
        correctAnswer: "Costs not reflected in market prices",
      },
      {
        unitId: u21.id,
        question: "What does a green economy aim to do?",
        options: JSON.stringify([
          "Maximize GDP at all costs",
          "Eliminate all manufacturing",
          "Redesign economic systems to reduce environmental externalities",
          "Return to pre-industrial agriculture",
        ]),
        correctAnswer:
          "Redesign economic systems to reduce environmental externalities",
      },
    ],
  });

  // Unit 2.2
  const u22 = await prisma.unit.create({
    data: {
      moduleId: mod2.id,
      title: "Doughnut Economics",
      order: 2,
      intro:
        "Economist Kate Raworth developed the Doughnut Economics framework. The model visualizes sustainable development as a doughnut-shaped space between social foundations and ecological ceilings.",
      conceptText:
        "The Inner Ring — Social Foundation: Represents minimum conditions for a good life including food, healthcare, education, and housing.\n\nThe Outer Ring — Ecological Ceiling: Represents planetary boundaries that humanity must not exceed.\n\nThe Safe and Just Space: The space between these rings is where humanity should aim to operate — meeting everyone's needs without exceeding Earth's limits.",
      frameworkText:
        "Kate Raworth's Doughnut Economics provides a visual framework for balancing human development with environmental sustainability. Unlike traditional economics focused solely on growth, it defines success as operating within a safe zone — above social minimums and below ecological maximums.",
      caseStudy:
        "The city of Amsterdam adopted Doughnut Economics to guide urban development policies. City planners use the framework to ensure that housing, transport, and infrastructure decisions meet social needs without exceeding environmental limits.",
      videoUrl: "https://www.youtube.com/watch?v=Rhcrbcg8HBw",
      reflectionPrompt:
        "How might economic growth create both opportunities and environmental risks?",
    },
  });

  await prisma.flipCard.createMany({
    data: [
      {
        unitId: u22.id,
        front: "What is the inner ring of the Doughnut?",
        back: "The Social Foundation — minimum conditions for a good life: food, healthcare, education, housing.",
      },
      {
        unitId: u22.id,
        front: "What is the outer ring of the Doughnut?",
        back: "The Ecological Ceiling — planetary boundaries that humanity must not exceed.",
      },
    ],
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u22.id,
        question: "Who developed the Doughnut Economics framework?",
        options: JSON.stringify([
          "Adam Smith",
          "Kate Raworth",
          "Milton Friedman",
          "Joseph Stiglitz",
        ]),
        correctAnswer: "Kate Raworth",
      },
      {
        unitId: u22.id,
        question:
          "What does the 'safe and just space' in Doughnut Economics represent?",
        options: JSON.stringify([
          "Maximum economic growth zone",
          "The space between social foundations and ecological ceilings",
          "A government regulation area",
          "International trade zones",
        ]),
        correctAnswer:
          "The space between social foundations and ecological ceilings",
      },
    ],
  });

  // Unit 2.3
  const u23 = await prisma.unit.create({
    data: {
      moduleId: mod2.id,
      title: "Circular Economy",
      order: 3,
      intro:
        "Traditional economies follow a linear model: Take → Make → Dispose. This model generates large amounts of waste. The circular economy redesigns production systems to keep materials in use for as long as possible.",
      conceptText:
        "Key Principles of the Circular Economy:\n\n• Reduce resource consumption\n• Reuse materials\n• Recycle products\n• Regenerate natural systems\n\nInstead of the linear Take → Make → Dispose model, a circular economy creates closed loops where waste from one process becomes input for another.",
      frameworkText:
        "The circular economy framework challenges the assumption that economic growth requires ever-increasing resource extraction. By designing products for longevity, repairability, and recyclability, businesses can maintain economic value while dramatically reducing waste and environmental impact.",
      caseStudy:
        "Patagonia, the outdoor clothing company, encourages customers to repair clothing instead of buying new items. Their Worn Wear program accepts used Patagonia gear, repairs it, and resells it. This reduces waste and extends product lifecycles while maintaining customer loyalty.",
      videoUrl: "https://www.youtube.com/watch?v=zCRKvDyyHmI",
      reflectionPrompt:
        "Can you identify a product in your daily life that could be redesigned to follow circular economy principles?",
    },
  });

  await prisma.flipCard.createMany({
    data: [
      {
        unitId: u23.id,
        front: "What is the linear economy model?",
        back: "Take → Make → Dispose — a model that generates large amounts of waste by treating resources as disposable.",
      },
      {
        unitId: u23.id,
        front: "What are the 4 principles of circular economy?",
        back: "Reduce resource consumption, Reuse materials, Recycle products, Regenerate natural systems.",
      },
    ],
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u23.id,
        question: "What model does the circular economy replace?",
        options: JSON.stringify([
          "The doughnut model",
          "The linear Take → Make → Dispose model",
          "The renewable energy model",
          "The VUCA model",
        ]),
        correctAnswer: "The linear Take → Make → Dispose model",
      },
      {
        unitId: u23.id,
        question:
          "Which company's Worn Wear program is an example of circular economy?",
        options: JSON.stringify(["Nike", "Patagonia", "H&M", "Zara"]),
        correctAnswer: "Patagonia",
      },
    ],
  });

  // Unit 2.4
  const u24 = await prisma.unit.create({
    data: {
      moduleId: mod2.id,
      title: "Regenerative Economy",
      order: 4,
      intro:
        "Sustainability focuses on reducing harm. Regenerative thinking goes further — it aims to restore ecosystems and improve environmental health.",
      conceptText:
        "While sustainability asks 'How do we do less damage?', regenerative thinking asks 'How do we actively restore and improve natural systems?'\n\nRegeneration means going beyond minimizing negative impact to creating positive outcomes for ecosystems, communities, and economies.",
      frameworkText:
        "The regenerative economy framework represents a paradigm shift from 'doing less bad' to 'doing more good.' It draws inspiration from natural ecosystems where waste from one organism becomes nourishment for another. Everything cycles, nothing is wasted, and the system continuously renews itself.",
      caseStudy:
        "Regenerative agriculture improves soil health while increasing farm productivity. By using practices like cover cropping, crop rotation, and minimal tillage, farmers can rebuild soil organic matter. Healthy soil stores carbon and supports biodiversity, turning farms from emission sources into carbon sinks.",
      videoUrl: "https://www.youtube.com/watch?v=fSEtiixgRJI",
      reflectionPrompt:
        "What is the difference between sustainability and regeneration? Can you think of an example of regenerative practice in your area?",
    },
  });

  await prisma.flipCard.createMany({
    data: [
      {
        unitId: u24.id,
        front: "How does regenerative thinking differ from sustainability?",
        back: "Sustainability focuses on reducing harm. Regenerative thinking aims to actively restore ecosystems and improve environmental health.",
      },
      {
        unitId: u24.id,
        front: "What is regenerative agriculture?",
        back: "Farming practices that improve soil health, store carbon, and support biodiversity — turning farms from emission sources into carbon sinks.",
      },
    ],
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u24.id,
        question: "How does regenerative thinking differ from sustainability?",
        options: JSON.stringify([
          "They are the same thing",
          "Regeneration aims to restore and improve, not just reduce harm",
          "Sustainability is more ambitious than regeneration",
          "Regeneration only applies to agriculture",
        ]),
        correctAnswer:
          "Regeneration aims to restore and improve, not just reduce harm",
      },
      {
        unitId: u24.id,
        question: "How can healthy soil help address climate change?",
        options: JSON.stringify([
          "It cannot",
          "By storing carbon and supporting biodiversity",
          "By increasing fossil fuel production",
          "By reducing rainfall",
        ]),
        correctAnswer: "By storing carbon and supporting biodiversity",
      },
    ],
  });

  // ── MODULE 3 ──
  const mod3 = await prisma.module.create({
    data: {
      title: "Climate Solutions & Green Innovation",
      description:
        "Discover the technologies and innovations driving the transition to a green economy — from renewable energy and climate tech startups to entrepreneurship opportunities.",
      order: 3,
    },
  });

  // Unit 3.1
  const u31 = await prisma.unit.create({
    data: {
      moduleId: mod3.id,
      title: "The Energy Transition",
      order: 1,
      intro:
        "Energy systems are responsible for the majority of global greenhouse gas emissions. Historically, energy came from fossil fuels. The energy transition refers to shifting toward cleaner energy sources.",
      conceptText:
        "The energy transition is the global shift from fossil fuel-based energy systems to renewable and clean energy sources.\n\nFossil fuels (coal, oil, natural gas) have powered economic growth for over 200 years but are the primary driver of climate change.\n\nThe transition involves:\n• Replacing fossil fuels with renewables\n• Improving energy efficiency\n• Electrifying transport and industry\n• Developing energy storage solutions",
      frameworkText:
        "The energy transition framework encompasses three key dimensions:\n\n1. Supply-side: Shifting electricity generation from fossil fuels to renewables\n2. Demand-side: Improving energy efficiency and reducing consumption\n3. System-level: Building smart grids, energy storage, and infrastructure for a decentralized energy system",
      caseStudy:
        "Countries like Iceland generate nearly 100% of their electricity from renewable sources (geothermal and hydropower). This demonstrates that complete energy transitions are technically feasible. The challenge lies in scaling these solutions for larger, more complex economies.",
      videoUrl: "https://www.youtube.com/watch?v=OWPwMmekNLE",
      reflectionPrompt:
        "What energy sources power your community? What would need to change for a transition to cleaner energy?",
    },
  });

  await prisma.flipCard.createMany({
    data: [
      {
        unitId: u31.id,
        front: "What is the energy transition?",
        back: "The global shift from fossil fuel-based energy systems to renewable and clean energy sources.",
      },
      {
        unitId: u31.id,
        front: "Why is the energy transition important?",
        back: "Energy systems are responsible for the majority of global greenhouse gas emissions. Transitioning to renewables is essential for addressing climate change.",
      },
    ],
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u31.id,
        question: "What is the energy transition?",
        options: JSON.stringify([
          "Building more coal power plants",
          "Shifting from fossil fuels to renewable energy sources",
          "Increasing oil production",
          "Reducing all energy consumption to zero",
        ]),
        correctAnswer: "Shifting from fossil fuels to renewable energy sources",
      },
      {
        unitId: u31.id,
        question:
          "Which country generates nearly 100% of electricity from renewables?",
        options: JSON.stringify(["Germany", "China", "Iceland", "Brazil"]),
        correctAnswer: "Iceland",
      },
    ],
  });

  // Unit 3.2
  const u32 = await prisma.unit.create({
    data: {
      moduleId: mod3.id,
      title: "Renewable Energy Revolution",
      order: 2,
      intro:
        "Key renewable technologies include solar power, wind power, geothermal energy, and hydropower. Solar and wind energy have become dramatically cheaper in recent years.",
      conceptText:
        "The renewable energy revolution is driven by rapidly falling costs and improving technology:\n\n• Solar Power: Converts sunlight into electricity. Costs have dropped over 90% since 2010.\n• Wind Power: Uses wind turbines to generate electricity. Both onshore and offshore wind are growing rapidly.\n• Geothermal Energy: Uses Earth's internal heat for power generation and heating.\n• Hydropower: Generates electricity from flowing water. The oldest and most established renewable source.",
      frameworkText:
        "The levelized cost of energy (LCOE) from solar and wind has fallen below fossil fuels in many markets. This economic tipping point means that the transition to renewables is now driven by market forces, not just environmental policy.\n\nKey trends:\n• Solar: Cheapest source of new electricity in history\n• Offshore wind: Growing rapidly in Europe and Asia\n• Battery storage: Enabling renewables to provide 24/7 power",
      caseStudy:
        "The Danish energy company Ørsted transformed itself from a fossil fuel company into one of the world's largest offshore wind developers. This transition demonstrates how industries can adapt to a changing energy landscape — proving that even traditional energy companies can successfully pivot to renewables.",
      videoUrl: "https://www.youtube.com/watch?v=RnvCbquYeIM",
      reflectionPrompt:
        "Which renewable energy source do you think has the most potential in your region? Why?",
    },
  });

  await prisma.flipCard.createMany({
    data: [
      {
        unitId: u32.id,
        front: "How much have solar energy costs dropped since 2010?",
        back: "Over 90% — making solar the cheapest source of new electricity in history in many markets.",
      },
      {
        unitId: u32.id,
        front: "What is Ørsted's significance in the energy transition?",
        back: "Ørsted transformed from a fossil fuel company into one of the world's largest offshore wind developers, showing that industries can successfully adapt.",
      },
    ],
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u32.id,
        question:
          "Which company transformed from fossil fuels to offshore wind energy?",
        options: JSON.stringify(["Shell", "BP", "Ørsted", "ExxonMobil"]),
        correctAnswer: "Ørsted",
      },
      {
        unitId: u32.id,
        question: "By how much have solar energy costs dropped since 2010?",
        options: JSON.stringify(["10%", "30%", "50%", "Over 90%"]),
        correctAnswer: "Over 90%",
      },
    ],
  });

  // Unit 3.3
  const u33 = await prisma.unit.create({
    data: {
      moduleId: mod3.id,
      title: "Climate Tech Startups",
      order: 3,
      intro:
        "A new generation of startups is developing technologies to address climate challenges. These companies demonstrate how innovation can drive climate solutions.",
      conceptText:
        "Climate tech encompasses technologies specifically designed to reduce greenhouse gas emissions or address the effects of climate change.\n\nNotable examples:\n• Climeworks — Develops direct air capture technology that removes CO₂ from the atmosphere\n• Tesla — Pioneered electric vehicles and battery storage, accelerating the transition away from fossil fuel transport\n• Too Good To Go — App connecting consumers with restaurants and stores to rescue surplus food, reducing food waste",
      frameworkText:
        "The climate tech sector spans multiple industries:\n\n• Energy: Renewable generation, storage, and grid management\n• Transport: Electric vehicles, sustainable aviation fuel\n• Food: Alternative proteins, precision agriculture, food waste reduction\n• Industry: Green hydrogen, carbon capture, sustainable materials\n• Built environment: Energy-efficient buildings, green construction",
      caseStudy:
        "Climeworks operates the world's largest direct air capture plant in Iceland, called Orca. The plant captures CO₂ directly from the atmosphere and stores it underground permanently. While currently expensive, the technology represents a potential tool for removing historical emissions.",
      videoUrl: "https://www.youtube.com/watch?v=Y02fFbv2wkk",
      reflectionPrompt:
        "If you could create a climate tech startup, what problem would you solve? What technology would you use?",
    },
  });

  await prisma.flipCard.createMany({
    data: [
      {
        unitId: u33.id,
        front: "What does Climeworks do?",
        back: "Develops direct air capture technology that removes CO₂ directly from the atmosphere and stores it underground.",
      },
      {
        unitId: u33.id,
        front: "What is climate tech?",
        back: "Technologies specifically designed to reduce greenhouse gas emissions or address the effects of climate change.",
      },
    ],
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u33.id,
        question: "What technology does Climeworks develop?",
        options: JSON.stringify([
          "Solar panels",
          "Electric vehicles",
          "Direct air capture of CO₂",
          "Wind turbines",
        ]),
        correctAnswer: "Direct air capture of CO₂",
      },
      {
        unitId: u33.id,
        question: "What problem does Too Good To Go address?",
        options: JSON.stringify([
          "Water pollution",
          "Food waste",
          "Deforestation",
          "Air pollution",
        ]),
        correctAnswer: "Food waste",
      },
    ],
  });

  // Unit 3.4
  const u34 = await prisma.unit.create({
    data: {
      moduleId: mod3.id,
      title: "Climate Entrepreneurship",
      order: 4,
      intro:
        "Climate entrepreneurship focuses on building businesses that solve environmental challenges. Young innovators play an increasingly important role in developing these ideas.",
      conceptText:
        "Climate entrepreneurship combines business innovation with environmental impact. It includes ventures in:\n\n• Renewable energy — solar installations, micro-grids, energy management\n• Sustainable agriculture — organic farming, vertical farms, agritech\n• Circular economy solutions — recycling innovations, repair services, sharing platforms\n• Clean transport — EV infrastructure, bike-sharing, sustainable logistics\n• Green finance — impact investing, carbon credits, sustainable banking",
      frameworkText:
        "Successful climate entrepreneurs identify problems at the intersection of environmental need and market opportunity. The best climate businesses create value by solving real problems — reducing costs, improving efficiency, or creating entirely new markets.\n\nKey skills for climate entrepreneurs:\n• Systems thinking\n• Technical knowledge\n• Business model innovation\n• Stakeholder collaboration",
      caseStudy:
        "Across Africa and South Asia, young entrepreneurs are building solar micro-grid companies that bring affordable, clean electricity to rural communities. These ventures solve both energy access and climate challenges simultaneously, demonstrating that environmental and economic goals can align.",
      videoUrl: "https://www.youtube.com/watch?v=z9bLaw3OKIY",
      reflectionPrompt:
        "What green business opportunity do you see in your community? What skills would you need to pursue it?",
    },
  });

  await prisma.flipCard.createMany({
    data: [
      {
        unitId: u34.id,
        front: "What is climate entrepreneurship?",
        back: "Building businesses that solve environmental challenges while creating economic value — in areas like renewable energy, sustainable agriculture, and circular economy.",
      },
      {
        unitId: u34.id,
        front: "What skills do climate entrepreneurs need?",
        back: "Systems thinking, technical knowledge, business model innovation, and stakeholder collaboration.",
      },
    ],
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        unitId: u34.id,
        question: "What does climate entrepreneurship combine?",
        options: JSON.stringify([
          "Politics and technology",
          "Business innovation with environmental impact",
          "Charity work and volunteering",
          "Government regulation and taxation",
        ]),
        correctAnswer: "Business innovation with environmental impact",
      },
      {
        unitId: u34.id,
        question:
          "Which is an example of climate entrepreneurship in developing regions?",
        options: JSON.stringify([
          "Building luxury hotels",
          "Solar micro-grids for rural communities",
          "Opening fast-food chains",
          "Mining for rare earth minerals",
        ]),
        correctAnswer: "Solar micro-grids for rural communities",
      },
    ],
  });

  console.log("✅ Seeding complete!");
  console.log("📧 Admin: admin@fli.org / admin123");
  console.log("📧 Student: student@fli.org / student123");
  console.log(
    `📚 Created: 3 modules, 12 units, flip cards, quiz questions`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
