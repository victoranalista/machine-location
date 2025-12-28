import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  console.log('🌱 Iniciando seed do banco de dados...');
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.equipmentSpec.deleteMany();
  await prisma.equipmentImage.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.location.deleteMany();
  console.log('✅ Dados antigos removidos');
  const fornecedor = await prisma.user.upsert({
    where: { email: 'fornecedor@example.com' },
    update: {},
    create: {
      email: 'fornecedor@example.com',
      name: 'Fornecedor Demo',
      role: 'FORNECEDOR',
      password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
    }
  });
  console.log('✅ Usuário fornecedor criado');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Escavadeiras',
        slug: 'escavadeiras',
        description: 'Escavadeiras hidráulicas para terraplanagem e escavação',
        imageUrl:
          'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Tratores',
        slug: 'tratores',
        description: 'Tratores agrícolas e de construção',
        imageUrl:
          'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Guindastes',
        slug: 'guindastes',
        description: 'Guindastes para içamento de cargas pesadas',
        imageUrl:
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Retroescavadeiras',
        slug: 'retroescavadeiras',
        description: 'Máquinas versáteis para escavação e carregamento',
        imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Compactadores',
        slug: 'compactadores',
        description: 'Rolos compactadores para pavimentação',
        imageUrl:
          'https://images.unsplash.com/photo-1621905252472-943afaa20e20?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Plataformas Elevatórias',
        slug: 'plataformas-elevatorias',
        description: 'Equipamentos para trabalho em altura',
        imageUrl:
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Geradores',
        slug: 'geradores',
        description: 'Geradores de energia para canteiros de obras',
        imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Caminhões',
        slug: 'caminhoes',
        description: 'Caminhões basculantes e de transporte',
        imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Empilhadeiras',
        slug: 'empilhadeiras',
        description: 'Empilhadeiras elétricas e a combustão',
        imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Minicarregadeiras',
        slug: 'minicarregadeiras',
        description: 'Minicarregadeiras compactas Bobcat e similares',
        imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Pás Carregadeiras',
        slug: 'pas-carregadeiras',
        description: 'Pás carregadeiras para movimentação de materiais',
        imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Motoniveladoras',
        slug: 'motoniveladoras',
        description: 'Motoniveladoras para nivelamento de terrenos',
        imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
      }
    })
  ]);

  console.log(`✅ ${categories.length} categorias criadas`);

  // Criar Marcas
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'Caterpillar',
        slug: 'caterpillar',
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Caterpillar_logo.svg/1200px-Caterpillar_logo.svg.png'
      }
    }),
    prisma.brand.create({ data: { name: 'Komatsu', slug: 'komatsu' } }),
    prisma.brand.create({ data: { name: 'Volvo', slug: 'volvo' } }),
    prisma.brand.create({ data: { name: 'John Deere', slug: 'john-deere' } }),
    prisma.brand.create({ data: { name: 'Case', slug: 'case' } }),
    prisma.brand.create({ data: { name: 'JCB', slug: 'jcb' } }),
    prisma.brand.create({ data: { name: 'Liebherr', slug: 'liebherr' } }),
    prisma.brand.create({ data: { name: 'New Holland', slug: 'new-holland' } }),
    prisma.brand.create({ data: { name: 'Hyundai', slug: 'hyundai' } }),
    prisma.brand.create({ data: { name: 'Doosan', slug: 'doosan' } }),
    prisma.brand.create({ data: { name: 'Hitachi', slug: 'hitachi' } }),
    prisma.brand.create({ data: { name: 'XCMG', slug: 'xcmg' } }),
    prisma.brand.create({ data: { name: 'Sany', slug: 'sany' } }),
    prisma.brand.create({ data: { name: 'LiuGong', slug: 'liugong' } }),
    prisma.brand.create({ data: { name: 'Terex', slug: 'terex' } }),
    prisma.brand.create({ data: { name: 'Bobcat', slug: 'bobcat' } }),
    prisma.brand.create({
      data: { name: 'Massey Ferguson', slug: 'massey-ferguson' }
    }),
    prisma.brand.create({ data: { name: 'Valtra', slug: 'valtra' } }),
    prisma.brand.create({ data: { name: 'Agrale', slug: 'agrale' } }),
    prisma.brand.create({ data: { name: 'Randon', slug: 'randon' } })
  ]);

  console.log(`✅ ${brands.length} marcas criadas`);

  // Criar Localizações
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'São Paulo - SP',
        slug: 'sao-paulo-sp',
        city: 'São Paulo',
        state: 'SP',
        isActive: true
      }
    }),
    prisma.location.create({
      data: {
        name: 'Rio de Janeiro - RJ',
        slug: 'rio-de-janeiro-rj',
        city: 'Rio de Janeiro',
        state: 'RJ',
        isActive: true
      }
    }),
    prisma.location.create({
      data: {
        name: 'Belo Horizonte - MG',
        slug: 'belo-horizonte-mg',
        city: 'Belo Horizonte',
        state: 'MG',
        isActive: true
      }
    }),
    prisma.location.create({
      data: {
        name: 'Curitiba - PR',
        slug: 'curitiba-pr',
        city: 'Curitiba',
        state: 'PR',
        isActive: true
      }
    }),
    prisma.location.create({
      data: {
        name: 'Porto Alegre - RS',
        slug: 'porto-alegre-rs',
        city: 'Porto Alegre',
        state: 'RS',
        isActive: true
      }
    })
  ]);

  console.log(`✅ ${locations.length} localizações criadas`);

  // Criar Equipamentos
  const escavadeirasCategory = categories[0];
  const tratoresCategory = categories[1];
  const guindastesCategory = categories[2];
  const retroCategory = categories[3];
  const compactadoresCategory = categories[4];

  const catBrand = brands[0];
  const komatsuBrand = brands[1];
  const volvoBrand = brands[2];
  const johnDeereBrand = brands[3];
  const caseBrand = brands[4];
  const jcbBrand = brands[5];

  const equipmentData = [
    {
      name: 'Escavadeira Hidráulica CAT 320',
      slug: 'escavadeira-hidraulica-cat-320',
      description:
        'Escavadeira hidráulica de médio porte ideal para obras de terraplanagem, escavações e movimentação de terra. Equipada com tecnologia de última geração para maior produtividade e economia de combustível.',
      categoryId: escavadeirasCategory.id,
      brandId: catBrand.id,
      model: '320D2',
      year: 2022,
      dailyRate: 1500,
      weeklyRate: 9000,
      monthlyRate: 30000,
      mainImageUrl:
        'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800',
      status: 'AVAILABLE',
      featured: true,
      locationId: locations[0].id
    },
    {
      name: 'Escavadeira Komatsu PC200',
      slug: 'escavadeira-komatsu-pc200',
      description:
        'Escavadeira robusta e confiável para operações pesadas. Sistema hidráulico avançado proporciona movimentos precisos e eficientes.',
      categoryId: escavadeirasCategory.id,
      brandId: komatsuBrand.id,
      model: 'PC200-8',
      year: 2021,
      dailyRate: 1400,
      weeklyRate: 8400,
      monthlyRate: 28000,
      mainImageUrl:
        'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800',
      status: 'AVAILABLE',
      featured: true,
      locationId: locations[1].id
    },
    {
      name: 'Trator de Esteira CAT D6',
      slug: 'trator-esteira-cat-d6',
      description:
        'Trator de esteira de alta performance para trabalhos de nivelamento e terraplanagem. Motor potente e sistema de transmissão eficiente.',
      categoryId: tratoresCategory.id,
      brandId: catBrand.id,
      model: 'D6T',
      year: 2023,
      dailyRate: 2000,
      weeklyRate: 12000,
      monthlyRate: 40000,
      mainImageUrl:
        'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=800',
      status: 'AVAILABLE',
      featured: true,
      locationId: locations[0].id
    },
    {
      name: 'Retroescavadeira JCB 3CX',
      slug: 'retroescavadeira-jcb-3cx',
      description:
        'Retroescavadeira versátil para múltiplas aplicações. Ideal para obras urbanas, saneamento e construção civil em geral.',
      categoryId: retroCategory.id,
      brandId: jcbBrand.id,
      model: '3CX',
      year: 2022,
      dailyRate: 800,
      weeklyRate: 4800,
      monthlyRate: 16000,
      mainImageUrl:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      status: 'AVAILABLE',
      featured: false,
      locationId: locations[2].id
    },
    {
      name: 'Retroescavadeira Case 580N',
      slug: 'retroescavadeira-case-580n',
      description:
        'Retroescavadeira compacta e ágil, perfeita para trabalhos em espaços reduzidos. Excelente relação custo-benefício.',
      categoryId: retroCategory.id,
      brandId: caseBrand.id,
      model: '580N',
      year: 2021,
      dailyRate: 750,
      weeklyRate: 4500,
      monthlyRate: 15000,
      mainImageUrl:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      status: 'AVAILABLE',
      featured: false,
      locationId: locations[3].id
    },
    {
      name: 'Guindaste Liebherr LTM 1100',
      slug: 'guindaste-liebherr-ltm-1100',
      description:
        'Guindaste telescópico de alta capacidade para içamento de cargas pesadas. Tecnologia de ponta em segurança e estabilidade.',
      categoryId: guindastesCategory.id,
      brandId: brands[6].id,
      model: 'LTM 1100-5.2',
      year: 2020,
      dailyRate: 5000,
      weeklyRate: 30000,
      monthlyRate: 100000,
      mainImageUrl:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      status: 'AVAILABLE',
      featured: true,
      locationId: locations[0].id
    },
    {
      name: 'Rolo Compactador CAT CS56',
      slug: 'rolo-compactador-cat-cs56',
      description:
        'Rolo compactador vibratório para compactação de solos em obras de pavimentação e terraplanagem.',
      categoryId: compactadoresCategory.id,
      brandId: catBrand.id,
      model: 'CS56B',
      year: 2022,
      dailyRate: 600,
      weeklyRate: 3600,
      monthlyRate: 12000,
      mainImageUrl:
        'https://images.unsplash.com/photo-1621905252472-943afaa20e20?w=800',
      status: 'AVAILABLE',
      featured: false,
      locationId: locations[1].id
    },
    {
      name: 'Escavadeira Volvo EC220',
      slug: 'escavadeira-volvo-ec220',
      description:
        'Escavadeira Volvo com motor eficiente e baixo consumo de combustível. Cabine confortável com ar condicionado.',
      categoryId: escavadeirasCategory.id,
      brandId: volvoBrand.id,
      model: 'EC220E',
      year: 2023,
      dailyRate: 1600,
      weeklyRate: 9600,
      monthlyRate: 32000,
      mainImageUrl:
        'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800',
      status: 'RENTED',
      featured: false,
      locationId: locations[4].id
    },
    {
      name: 'Trator Agrícola John Deere 6130J',
      slug: 'trator-agricola-john-deere-6130j',
      description:
        'Trator agrícola potente e versátil para diversas aplicações no campo. Motor de última geração com baixo consumo.',
      categoryId: tratoresCategory.id,
      brandId: johnDeereBrand.id,
      model: '6130J',
      year: 2022,
      dailyRate: 900,
      weeklyRate: 5400,
      monthlyRate: 18000,
      mainImageUrl:
        'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=800',
      status: 'AVAILABLE',
      featured: false,
      locationId: locations[2].id
    },
    {
      name: 'Mini Escavadeira CAT 305.5',
      slug: 'mini-escavadeira-cat-305-5',
      description:
        'Mini escavadeira compacta para trabalhos em espaços confinados. Ideal para paisagismo, saneamento e pequenas obras.',
      categoryId: escavadeirasCategory.id,
      brandId: catBrand.id,
      model: '305.5E2',
      year: 2023,
      dailyRate: 500,
      weeklyRate: 3000,
      monthlyRate: 10000,
      mainImageUrl:
        'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800',
      status: 'AVAILABLE',
      featured: true,
      locationId: locations[0].id
    }
  ];

  const equipment = await Promise.all(
    equipmentData.map((data) =>
      prisma.equipment.create({
        data: {
          ...data,
          dailyRate: data.dailyRate,
          weeklyRate: data.weeklyRate,
          monthlyRate: data.monthlyRate,
          status: 'AVAILABLE',
          ownerId: fornecedor.id
        }
      })
    )
  );

  console.log(`✅ ${equipment.length} equipamentos criados`);
  if (equipment.length === 0) {
    console.log('⚠️  Nenhum equipamento criado, pulando especificações');
    return;
  }
  const firstEquipment = equipment[0];
  if (!firstEquipment) {
    console.log('⚠️  Primeiro equipamento não encontrado');
    return;
  }
  await prisma.equipmentSpec.createMany({
    data: [
      {
        equipmentId: firstEquipment.id,
        name: 'Peso Operacional',
        value: '22.000 kg'
      },
      {
        equipmentId: firstEquipment.id,
        name: 'Potência do Motor',
        value: '162 hp'
      },
      {
        equipmentId: firstEquipment.id,
        name: 'Capacidade da Caçamba',
        value: '1,2 m³'
      },
      {
        equipmentId: firstEquipment.id,
        name: 'Profundidade Máx. de Escavação',
        value: '6,7 m'
      },
      {
        equipmentId: firstEquipment.id,
        name: 'Alcance Máximo',
        value: '9,9 m'
      },
      {
        equipmentId: firstEquipment.id,
        name: 'Consumo de Combustível',
        value: '15 L/h'
      }
    ]
  });

  console.log('✅ Especificações criadas para o primeiro equipamento');
  await prisma.equipmentImage.createMany({
    data: [
      {
        equipmentId: firstEquipment.id,
        url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800',
        order: 1
      },
      {
        equipmentId: firstEquipment.id,
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        order: 2
      },
      {
        equipmentId: firstEquipment.id,
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
        order: 3
      }
    ]
  });

  console.log('✅ Imagens adicionais criadas');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📊 Resumo:');
  console.log(`   - ${categories.length} categorias`);
  console.log(`   - ${brands.length} marcas`);
  console.log(`   - ${locations.length} localizações`);
  console.log(`   - ${equipment.length} equipamentos`);
};

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
