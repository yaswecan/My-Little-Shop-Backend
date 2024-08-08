const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getProducts(input: filterInput): ProductType
        getProduct(id: ID): Product
    }
    extend type Mutation {
        addProducts(input: productInput, images: [imageInput]): successInfo
        updateProducts(input: productInput, images: [imagesUpdateInput], id: ID): successInfo
        deleteProducts(id: ID): successInfo
    }
    input imageInput {
        file: Upload!
        color: String!
    }
    input imagesUpdateInput {
        file: Upload
        color: String
    }
    input productInput {
        name: String
        shortDescription: String
        description: String
        price: Int
        originalPrice: Int
        stock: Int
        sizes: [Size]
        category: String
        subCategory: String
        brand: String
        weight: String
        dimensions: Dimensions
        boxContent: String
        warranty: Warranty
        sku: String
        suitable: [Suitable]
        material: String
        tags: [TagsInput]
        packagingAndDelivery: String
        suggestedUse: String
        otherInformation: String
        warnings: String
        additionalInfo: [AdditionalInfo]
    }
    input Size {
        size: String
    }
    input Dimensions {
        width: String
        height: String
        length: String
    }
    input Warranty {
        type: String
        period: String
        policy: String
    }
    input Suitable {
        name: String
    }
    input TagsInput {
        name: String
    },
    input AdditionalInfo {
        field: String
        value: String
    }
    input filterInput {
        order: String
        sortBy: String
        limit: Int
        page: Int
        filters: Filters
    }
    input Filters {
        name: String
        price: [Int]
        category: String
        subCategory: [FilterArray]
        brand: [FilterArray]
        color: [FilterArray]
        tag: [FilterArray]
        discount: [Int]
    }
    input FilterArray {
        name: String
    }
    type ProductType {
        products: [Product]
        pageInfo: PageInfos
    }
    type PageInfos {
        resultPerPage: String
        count: Int
    }
    type Product {
        id: ID
        name: String
        shortDescription: String
        description: String
        images: [Images]
        price: Int
        originalPrice: Int
        discount: Int
        stock: Int
        sizes: [SizeTypes]
        category: Category
        subCategory: SubCategory
        rating: Int
        reviews: Int
        brand: Brand
        weight: String
        dimensions: DimensionTypes
        boxContent: String
        warranty: WarrantyTypes
        sku: String
        suitable: [SuitableTypes]
        material: String
        tags: [Tag]
        packagingAndDelivery: String
        suggestedUse: String
        otherInformation: String
        warnings: String
        additionalInfo: [AdditionalInfoTypes]
    }
    type Images {
        url: String,
        color: Color
    }
    type SizeTypes {
        size: String
    }
    type DimensionTypes {
        width: String
        height: String
        length: String
    }
    type WarrantyTypes {
        type: String
        period: String
        policy: String
    }
    type SuitableTypes{
        name: String
    }
    type AdditionalInfoTypes {
        field: String
        value: String
    }
`