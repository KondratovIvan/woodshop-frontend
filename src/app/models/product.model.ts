import {PageInfo, PageSize} from "./common.model";

export interface Product {
  productId:string  ,
  name:string ,
  addingDate:string ,
  description:string ,
  selected:boolean ,
  productImagesBas64: string[],
  category:string ,
  status:string ,
  brand:string ;
  quantity:number
  colors: string[],
  productPrice: ProductPrice ;
  dimension: Dimension ;
  pickedColor : string | null
}
export interface Dimension{
  height : number ,
  width: number,
  larger: number ,
  weight : number
}
export interface ProductsPage{
  products: Product[] ,
  pageInfo : PageInfo ;
}


export interface ProductPrice{
  currency:string ,
  price: number ,
  symbol: string
}

export interface CreatedProduct{
  productId?:string  ,
  name:string ,
  addingDate?:string ,
  description:string ,
  selected:boolean ,
  productImagesBas64: string[],
  category:string ,
  status?:string ,
  brand:string ;
  quantity: number ,
  colors: string[],
  productPrice: ProductPrice ;
  dimension: Dimension ;
  pickedColor? : string
}

export interface ActionPayload<T>{
  pageSize:PageSize;
  data : T;
}
export const ProductsCategory = {
  APPLE: {
    name: 'Apple',
    category: 'APPLE',
    image: 'assets/img/apple.jpg',
    description:
      'A symbol of beauty, charm, and creativity. Apples are known for their attractive nature and sociable personality.',
  },
  FIR: {
    name: 'Fir',
    category: 'FIR',
    image: 'assets/img/fir.jpg',
    description:
      'A symbol of endurance and strength. People associated with Fir trees are known for their calm, reliable, and steady personality.',
  },
  ELM: {
    name: 'Elm',
    category: 'ELM',
    image: 'assets/img/elm.jpg',
    description:
      'Elm individuals are considered compassionate, creative, and always seeking harmony. They are often wise and diplomatic.',
  },
  CYPRESS: {
    name: 'Cypress',
    category: 'CYPRESS',
    image: 'assets/img/cypress.jpg',
    description:
      'Cypress trees represent resilience and determination. Their people are brave, optimistic, and capable of handling challenges.',
  },
  POPLAR: {
    name: 'Poplar',
    category: 'POPLAR',
    image: 'assets/img/poplar.jpg',
    description:
      'Poplar individuals are highly energetic and ambitious. They can be passionate and full of enthusiasm, but also practical.',
  },
  CEDAR: {
    name: 'Cedar',
    category: 'CEDAR',
    image: 'assets/img/cedar.jpg',
    description:
      'Cedar symbolizes wisdom and balance. These people are known for their calm demeanor and ability to bring people together.',
  },
  PINE: {
    name: 'Pine',
    category: 'PINE',
    image: 'assets/img/pine.jpg',
    description:
      'Pine tree people are known for their healing abilities, kindness, and love of nature. They are reliable and deeply caring individuals.',
  },
  WILLOW: {
    name: 'Willow',
    category: 'WILLOW',
    image: 'assets/img/willow.jpg',
    description:
      'Willows are characterized by sensitivity and adaptability. People born under this tree are intuitive, emotionally intelligent, and peaceful.',
  },
  LINDEN: {
    name: 'Linden',
    category: 'LINDEN',
    image: 'assets/img/linden.jpg',
    description:
      'Linden individuals are highly intellectual and value peace and quiet. They are thoughtful, kind, and often engaged in deep contemplation.',
  },
  HAZEL: {
    name: 'Hazel',
    category: 'HAZEL',
    image: 'assets/img/hazel.jpg',
    description:
      'Hazel is the symbol of intelligence and wisdom. Those born under this tree are clever, curious, and enjoy solving problems.',
  },
  ROWAN: {
    name: 'Rowan',
    category: 'ROWAN',
    image: 'assets/img/rowan.jpg',
    description:
      'Rowan people are courageous, resourceful, and determined. They have a strong spirit and are often the protectors of their loved ones.',
  },
  MAPLE: {
    name: 'Maple',
    category: 'MAPLE',
    image: 'assets/img/maple.jpg',
    description:
      'Maple symbolizes balance and harmony. These individuals are creative, graceful, and artistic, always seeking beauty and peace.',
  },
  WALNUT: {
    name: 'Walnut',
    category: 'WALNUT',
    image: 'assets/img/walnut.png',
    description:
      'Walnut individuals are deeply spiritual and philosophical. They have a sharp mind and are capable of great accomplishments in intellectual pursuits.',
  },
  JASMINE: {
    name: 'Jasmine',
    category: 'JASMINE',
    image: 'assets/img/jasmine.jpg',
    description:
      'Jasmine people are known for their charm, elegance, and grace. They bring joy and positivity wherever they go, with a deep love for beauty and creativity.',
  },
} as const;

export type ProductsCategory = keyof typeof ProductsCategory;
