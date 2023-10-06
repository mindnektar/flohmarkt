import BaseModel from './_base';

export default class Sale extends BaseModel {
    static get relationMappings() {
        return {
            vendor: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'Vendor',
                join: {
                    from: 'sale.vendorId',
                    to: 'vendor.id',
                },
            },
            articles: {
                relation: BaseModel.HasManyRelation,
                modelClass: 'Article',
                join: {
                    from: 'sale.id',
                    to: 'article.saleId',
                },
            },
        };
    }
}
