import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Bangladesh districts data
const bangladeshDistricts = [
  // Dhaka Division
  { name: 'Dhaka', delivery_charge: 60 },
  { name: 'Faridpur', delivery_charge: 80 },
  { name: 'Gazipur', delivery_charge: 70 },
  { name: 'Gopalganj', delivery_charge: 90 },
  { name: 'Kishoreganj', delivery_charge: 85 },
  { name: 'Madaripur', delivery_charge: 85 },
  { name: 'Manikganj', delivery_charge: 75 },
  { name: 'Munshiganj', delivery_charge: 70 },
  { name: 'Narayanganj', delivery_charge: 65 },
  { name: 'Narsingdi', delivery_charge: 75 },
  { name: 'Rajbari', delivery_charge: 80 },
  { name: 'Shariatpur', delivery_charge: 85 },
  { name: 'Tangail', delivery_charge: 80 },
  
  // Chittagong Division
  { name: 'Bandarban', delivery_charge: 120 },
  { name: 'Brahmanbaria', delivery_charge: 90 },
  { name: 'Chandpur', delivery_charge: 85 },
  { name: 'Chittagong', delivery_charge: 80 },
  { name: 'Comilla', delivery_charge: 85 },
  { name: 'Cox\'s Bazar', delivery_charge: 100 },
  { name: 'Feni', delivery_charge: 90 },
  { name: 'Khagrachhari', delivery_charge: 110 },
  { name: 'Lakshmipur', delivery_charge: 90 },
  { name: 'Noakhali', delivery_charge: 95 },
  { name: 'Rangamati', delivery_charge: 110 },
  
  // Rajshahi Division
  { name: 'Bogra', delivery_charge: 90 },
  { name: 'Joypurhat', delivery_charge: 95 },
  { name: 'Naogaon', delivery_charge: 100 },
  { name: 'Natore', delivery_charge: 90 },
  { name: 'Chapainawabganj', delivery_charge: 100 },
  { name: 'Pabna', delivery_charge: 85 },
  { name: 'Rajshahi', delivery_charge: 90 },
  { name: 'Sirajganj', delivery_charge: 85 },
  
  // Khulna Division
  { name: 'Bagerhat', delivery_charge: 95 },
  { name: 'Chuadanga', delivery_charge: 90 },
  { name: 'Jessore', delivery_charge: 85 },
  { name: 'Jhenaidah', delivery_charge: 90 },
  { name: 'Khulna', delivery_charge: 85 },
  { name: 'Kushtia', delivery_charge: 85 },
  { name: 'Magura', delivery_charge: 90 },
  { name: 'Meherpur', delivery_charge: 95 },
  { name: 'Narail', delivery_charge: 90 },
  { name: 'Satkhira', delivery_charge: 95 },
  
  // Barisal Division
  { name: 'Barguna', delivery_charge: 100 },
  { name: 'Barisal', delivery_charge: 95 },
  { name: 'Bhola', delivery_charge: 100 },
  { name: 'Jhalokati', delivery_charge: 95 },
  { name: 'Patuakhali', delivery_charge: 100 },
  { name: 'Pirojpur', delivery_charge: 95 },
  
  // Sylhet Division
  { name: 'Habiganj', delivery_charge: 95 },
  { name: 'Moulvibazar', delivery_charge: 100 },
  { name: 'Sunamganj', delivery_charge: 100 },
  { name: 'Sylhet', delivery_charge: 90 },
  
  // Rangpur Division
  { name: 'Dinajpur', delivery_charge: 100 },
  { name: 'Gaibandha', delivery_charge: 95 },
  { name: 'Kurigram', delivery_charge: 105 },
  { name: 'Lalmonirhat', delivery_charge: 100 },
  { name: 'Nilphamari', delivery_charge: 100 },
  { name: 'Panchagarh', delivery_charge: 110 },
  { name: 'Rangpur', delivery_charge: 95 },
  { name: 'Thakurgaon', delivery_charge: 105 },
  
  // Mymensingh Division
  { name: 'Jamalpur', delivery_charge: 90 },
  { name: 'Mymensingh', delivery_charge: 85 },
  { name: 'Netrokona', delivery_charge: 95 },
  { name: 'Sherpur', delivery_charge: 95 }
]

// Sample categories
const sampleCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic gadgets and devices',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20electronic%20devices%20icon%20minimalist%20blue&image_size=square',
    banner_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=electronics%20banner%20modern%20tech%20gadgets&image_size=landscape_16_9',
    is_active: true
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20clothing%20icon%20minimalist%20pink&image_size=square',
    banner_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20banner%20trendy%20clothing%20collection&image_size=landscape_16_9',
    is_active: true
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement and garden essentials',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=home%20garden%20icon%20minimalist%20green&image_size=square',
    banner_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=home%20garden%20banner%20cozy%20living%20space&image_size=landscape_16_9',
    is_active: true
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Educational and entertainment books',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=books%20icon%20minimalist%20brown&image_size=square',
    banner_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=books%20banner%20library%20knowledge&image_size=landscape_16_9',
    is_active: true
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Sports equipment and accessories',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20equipment%20icon%20minimalist%20orange&image_size=square',
    banner_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20banner%20athletic%20equipment&image_size=landscape_16_9',
    is_active: true
  }
]

// Sample data for slider items
const sliderData = [
  {
    title: 'Welcome to TechPinik',
    subtitle: 'Your One-Stop Tech Shop',
    description: 'Discover the latest gadgets and electronics at unbeatable prices',
    button_text: 'Shop Now',
    button_link: '/products',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tech%20store%20banner%20electronics%20gadgets%20blue%20gradient&image_size=landscape_16_9',
    sort_order: 1,
    is_active: true
  },
  {
    title: 'Latest Fashion Trends',
    subtitle: 'Style Meets Comfort',
    description: 'Explore our curated collection of trendy clothing and accessories',
    button_text: 'Explore Fashion',
    button_link: '/categories/fashion',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20banner%20trendy%20clothing%20stylish%20models%20elegant&image_size=landscape_16_9',
    sort_order: 2,
    is_active: true
  },
  {
    title: 'Home & Garden Sale',
    subtitle: 'Transform Your Space',
    description: 'Up to 50% off on home decor and garden essentials',
    button_text: 'Shop Sale',
    button_link: '/categories/home-garden',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=home%20garden%20sale%20banner%20furniture%20plants%20cozy%20interior&image_size=landscape_16_9',
    sort_order: 3,
    is_active: true
  }
]

// Sample products data
const productsData = [
  {
    name: 'Samsung Galaxy A54',
    slug: 'samsung-galaxy-a54',
    description: 'Latest Samsung smartphone with advanced camera and long battery life',
    brand: 'Samsung',
    origin: 'South Korea',
    key_features: 'Triple camera, 5000mAh battery, 6.4" display',
    box_contents: 'Phone, Charger, USB Cable, Earphones, Manual',
    regular_price: 45000,
    sale_price: 42000,
    sku: 'SAM-A54-001',
    stock_quantity: 25,
    weight: 0.2,
    dimensions: '15.8 x 7.7 x 0.8 cm',
    warranty: '1 year official warranty',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=samsung%20galaxy%20smartphone%20modern%20sleek%20design&image_size=square',
    is_featured: true,
    is_active: true
  },
  {
    name: 'Apple iPhone 14',
    slug: 'apple-iphone-14',
    description: 'Premium iPhone with A15 Bionic chip and advanced camera system',
    brand: 'Apple',
    origin: 'USA',
    key_features: 'A15 Bionic chip, Dual camera, Face ID',
    box_contents: 'iPhone, Lightning Cable, Manual',
    regular_price: 95000,
    sale_price: 90000,
    sku: 'APL-IP14-001',
    stock_quantity: 15,
    weight: 0.17,
    dimensions: '14.7 x 7.2 x 0.8 cm',
    warranty: '1 year international warranty',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=apple%20iphone%20premium%20smartphone%20elegant&image_size=square',
    is_featured: true,
    is_active: true
  },
  {
    name: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    description: 'Comfortable cotton t-shirt perfect for casual wear',
    brand: 'Fashion Hub',
    origin: 'Bangladesh',
    key_features: '100% cotton, Breathable fabric, Regular fit',
    box_contents: 'T-shirt, Care instructions',
    regular_price: 800,
    sale_price: 650,
    sku: 'FSH-TSH-001',
    stock_quantity: 50,
    weight: 0.2,
    dimensions: '30 x 25 x 2 cm',
    warranty: 'No warranty',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cotton%20t-shirt%20comfortable%20casual%20fashion&image_size=square',
    is_featured: false,
    is_active: true
  },
  {
    name: 'LED Table Lamp',
    slug: 'led-table-lamp',
    description: 'Modern LED table lamp with adjustable brightness',
    brand: 'Home Light',
    origin: 'China',
    key_features: 'LED technology, Adjustable brightness, Touch control',
    box_contents: 'Lamp, Power adapter, Manual',
    regular_price: 3500,
    sale_price: 3000,
    sku: 'HOM-LMP-001',
    stock_quantity: 20,
    weight: 1.2,
    dimensions: '25 x 15 x 40 cm',
    warranty: '6 months warranty',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20LED%20table%20lamp%20adjustable%20home&image_size=square',
    is_featured: false,
    is_active: true
  }
]

async function populateDistricts() {
  console.log('Populating districts...')
  
  // Check if districts already exist
  const { data: existingDistricts } = await supabase
    .from('districts')
    .select('name')
  
  if (existingDistricts && existingDistricts.length > 0) {
    console.log(`Districts already exist (${existingDistricts.length} found). Skipping...`)
    return existingDistricts
  }
  
  const { data, error } = await supabase
    .from('districts')
    .insert(bangladeshDistricts)
    .select()
  
  if (error) {
    console.error('Error populating districts:', error)
    throw error
  }
  
  console.log(`Successfully populated ${data.length} districts`)
  return data
}

async function populateCategories() {
  console.log('Populating categories...')
  
  // Check if categories already exist
  const { data: existingCategories } = await supabase
    .from('categories')
    .select('*')
  
  if (existingCategories && existingCategories.length > 0) {
    console.log(`Categories already exist (${existingCategories.length} found). Skipping...`)
    return existingCategories
  }
  
  const { data, error } = await supabase
    .from('categories')
    .insert(sampleCategories)
    .select()
  
  if (error) {
    console.error('Error populating categories:', error)
    throw error
  }
  
  console.log(`Successfully populated ${data.length} categories`)
  return data
}

async function populateSliderItems() {
  console.log('Populating slider items...')
  
  // Check if slider items already exist
  const { data: existingSliders } = await supabase
    .from('slider_items')
    .select('id')
  
  if (existingSliders && existingSliders.length > 0) {
    console.log(`Slider items already exist (${existingSliders.length} found). Skipping...`)
    return existingSliders
  }
  
  const { data, error } = await supabase
    .from('slider_items')
    .insert(sliderData)
    .select()
  
  if (error) {
    console.error('Error populating slider items:', error)
    throw error
  }
  
  console.log(`Successfully populated ${data.length} slider items`)
  return data
}

async function populateProducts(categories: any[]) {
  console.log('Populating products...')
  
  // Check if products already exist
  const { data: existingProducts } = await supabase
    .from('products')
    .select('id')
  
  if (existingProducts && existingProducts.length > 0) {
    console.log(`Products already exist (${existingProducts.length} found). Skipping...`)
    return existingProducts
  }
  
  // Map category names to IDs
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id
    return acc
  }, {} as Record<string, string>)
  
  // Update products with category IDs
  const productsWithCategories = productsData.map((product: any) => {
    let categoryId = null
    
    // Assign category based on product type
    if (product.name.includes('iPhone') || product.name.includes('Samsung')) {
      categoryId = categoryMap['electronics']
    } else if (product.name.includes('T-Shirt')) {
      categoryId = categoryMap['fashion']
    } else if (product.name.includes('Lamp')) {
      categoryId = categoryMap['home-garden']
    }
    
    return {
      ...product,
      category_id: categoryId
    }
  })
  
  const { data, error } = await supabase
    .from('products')
    .insert(productsWithCategories)
    .select()
  
  if (error) {
    console.error('Error populating products:', error)
    throw error
  }
  
  console.log(`Successfully populated ${data.length} products`)
  return data
}

async function main() {
  try {
    console.log('Starting database population...')
    
    // Populate districts
    await populateDistricts()
    
    // Populate categories
    const categories = await populateCategories()
    if (!categories) return
    
    // Populate slider items
    await populateSliderItems()
    
    // Populate products
    await populateProducts(categories)
    
    console.log('Database population completed successfully!')
  } catch (error) {
    console.error('Error during database population:', error)
  }
}

// Run the script
main()