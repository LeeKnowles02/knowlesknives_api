require('dotenv').config();
const { sequelize, Knife, KnifeImage, Service, Enquiry } = require('../models');
const { generateUniqueSlug } = require('../utils/generateSlug');

const knives = [
  {
    name: 'Fieldmaster Hunter',
    category: 'Hunting',
    price: 485,
    availability: 'Available',
    shortDescription: 'A durable hunting knife built for field use.',
    description:
      'The Fieldmaster Hunter is hand-forged from high carbon steel with a walnut handle. Designed for skinning and general field tasks, it includes a custom leather sheath.',
    steelType: 'High carbon steel',
    handleMaterial: 'Walnut',
    bladeLength: '110mm',
    overallLength: '230mm',
    notes: 'Includes leather sheath.',
    featured: true,
    active: true,
    images: [
      { imageUrl: 'assets/images/knife-1.jpg', altText: 'Fieldmaster Hunter main image' },
      { imageUrl: 'assets/images/knife-1-side.jpg', altText: 'Fieldmaster Hunter side view' },
    ],
  },
  {
    name: 'Bushcraft Companion',
    category: 'Bushcraft',
    price: 420,
    availability: 'Available',
    shortDescription: 'Reliable bushcraft knife for outdoor adventures.',
    description:
      'A versatile bushcraft knife with a scandi grind, ideal for carving, fire prep, and camp tasks. Micarta handle for grip in wet conditions.',
    steelType: 'O1 tool steel',
    handleMaterial: 'Micarta',
    bladeLength: '100mm',
    overallLength: '220mm',
    notes: 'Scandi grind.',
    featured: true,
    active: true,
    images: [
      { imageUrl: 'assets/images/knife-2.jpg', altText: 'Bushcraft Companion main image' },
    ],
  },
  {
    name: 'Chef\'s Utility',
    category: 'Kitchen',
    price: 350,
    availability: 'Reserved',
    shortDescription: 'Precision kitchen utility knife for daily prep.',
    description:
      'A balanced kitchen utility knife with a razor-sharp edge and comfortable handle for extended prep work.',
    steelType: 'Stainless steel',
    handleMaterial: 'Stabilized birch',
    bladeLength: '150mm',
    overallLength: '280mm',
    notes: 'Food-safe finish.',
    featured: false,
    active: true,
    images: [
      { imageUrl: 'assets/images/knife-3.jpg', altText: 'Chef\'s Utility main image' },
      { imageUrl: 'assets/images/knife-3-detail.jpg', altText: 'Chef\'s Utility blade detail' },
    ],
  },
  {
    name: 'Heritage Bowie',
    category: 'Collector',
    price: 750,
    availability: 'Sold',
    shortDescription: 'A classic bowie-style collector piece.',
    description:
      'Inspired by traditional bowie designs, this piece features a polished blade, brass guard, and exotic wood handle.',
    steelType: 'Damascus steel',
    handleMaterial: 'Exotic hardwood',
    bladeLength: '180mm',
    overallLength: '310mm',
    notes: 'Display stand available on request.',
    featured: true,
    active: true,
    images: [
      { imageUrl: 'assets/images/knife-4.jpg', altText: 'Heritage Bowie main image' },
    ],
  },
  {
    name: 'Custom EDC Slim',
    category: 'Everyday Carry',
    price: 395,
    availability: 'Made to Order',
    shortDescription: 'Slim everyday carry knife made to your specifications.',
    description:
      'A compact EDC knife available with custom handle materials and blade finishes. Contact us to discuss your build.',
    steelType: 'Customer choice',
    handleMaterial: 'Customer choice',
    bladeLength: '80mm',
    overallLength: '190mm',
    notes: 'Made to order — lead time 4–6 weeks.',
    featured: false,
    active: true,
    images: [
      { imageUrl: 'assets/images/knife-5.jpg', altText: 'Custom EDC Slim main image' },
      { imageUrl: 'assets/images/knife-5-handle.jpg', altText: 'Custom EDC Slim handle' },
      { imageUrl: 'assets/images/knife-5-blade.jpg', altText: 'Custom EDC Slim blade' },
    ],
  },
];

const services = [
  {
    title: 'Custom Knife Commissions',
    shortDescription: 'Bespoke knives designed and built to your requirements.',
    description:
      'Work directly with Knowles Knives to design a one-of-a-kind blade. From steel selection to handle materials, every detail is tailored to you.',
    enquiryType: 'Custom Knife',
    imageUrl: 'assets/images/service-custom.jpg',
    active: true,
    featured: true,
  },
  {
    title: 'Knife Making Courses',
    shortDescription: 'Hands-on courses for beginners and enthusiasts.',
    description:
      'Learn the fundamentals of knife making in a small-group workshop. All tools and materials provided.',
    enquiryType: 'Knife Making Course',
    imageUrl: 'assets/images/service-course.jpg',
    active: true,
    featured: true,
  },
  {
    title: 'Engraving',
    shortDescription: 'Personalised engraving on blades and handles.',
    description:
      'Add initials, logos, or custom artwork to your knife. Engraving is available on new commissions and existing blades.',
    enquiryType: 'Engraving',
    imageUrl: 'assets/images/service-engraving.jpg',
    active: true,
    featured: false,
  },
  {
    title: 'Repairs & Sharpening',
    shortDescription: 'Professional sharpening and knife repair services.',
    description:
      'Restore your favourite blade with expert sharpening, tip repair, handle replacement, and general maintenance.',
    enquiryType: 'Repairs / Sharpening',
    imageUrl: 'assets/images/service-repairs.jpg',
    active: true,
    featured: false,
  },
];

const seedMockData = async () => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.authenticate();

    const existingKnives = await Knife.count();
    if (existingKnives > 0) {
      console.log('Mock data already exists. Skipping seed.');
      await transaction.rollback();
      process.exit(0);
    }

    const createdKnives = [];

    for (const knifeData of knives) {
      const { images, ...fields } = knifeData;
      const slug = await generateUniqueSlug(fields.name, Knife);

      const knife = await Knife.create({ ...fields, slug }, { transaction });
      createdKnives.push(knife);

      const imageRecords = images.map((img, index) => ({
        knifeId: knife.id,
        imageUrl: img.imageUrl,
        altText: img.altText,
        sortOrder: index + 1,
      }));

      await KnifeImage.bulkCreate(imageRecords, { transaction });
    }

    const createdServices = [];

    for (const serviceData of services) {
      const slug = await generateUniqueSlug(serviceData.title, Service);
      const service = await Service.create({ ...serviceData, slug }, { transaction });
      createdServices.push(service);
    }

    await Enquiry.bulkCreate(
      [
        {
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '0821234567',
          enquiryType: 'Knife Enquiry',
          selectedKnifeId: createdKnives[0].id,
          selectedKnifeName: createdKnives[0].name,
          message: 'Is the Fieldmaster Hunter still available? I would like to arrange a viewing.',
          status: 'New',
        },
        {
          name: 'Sarah Jones',
          email: 'sarah.j@example.com',
          phone: '0839876543',
          enquiryType: 'Custom Knife',
          selectedServiceId: createdServices[0].id,
          selectedServiceName: createdServices[0].title,
          message: 'I am interested in a custom bushcraft knife with a burl wood handle.',
          status: 'Contacted',
        },
        {
          name: 'Mike Brown',
          email: 'mike.brown@example.com',
          phone: '0845551234',
          enquiryType: 'Knife Making Course',
          selectedServiceId: createdServices[1].id,
          selectedServiceName: createdServices[1].title,
          message: 'Please send dates for your next knife making course.',
          status: 'New',
        },
        {
          name: 'Lisa Green',
          email: 'lisa.green@example.com',
          phone: '0824447890',
          enquiryType: 'General',
          message: 'Do you ship internationally?',
          status: 'Closed',
        },
        {
          name: 'David White',
          email: 'david.white@example.com',
          phone: '0831112233',
          enquiryType: 'Repairs / Sharpening',
          selectedServiceId: createdServices[3].id,
          selectedServiceName: createdServices[3].title,
          message: 'I have a chef knife that needs sharpening and a small chip repaired.',
          status: 'New',
        },
      ],
      { transaction }
    );

    await transaction.commit();

    console.log('Mock data seeded successfully.');
    console.log(`  Knives: ${knives.length}`);
    console.log(`  Services: ${services.length}`);
    console.log('  Enquiries: 5');
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error('Failed to seed mock data:', error.message);
    process.exit(1);
  }
};

seedMockData();
