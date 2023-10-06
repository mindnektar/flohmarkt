import BaseModel from './_base';

export default class Vendor extends BaseModel {
    static get relationMappings() {
        return {
            user: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'User',
                join: {
                    from: 'vendor.userId',
                    to: 'user.id',
                },
            },
            market: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'Market',
                join: {
                    from: 'vendor.marketId',
                    to: 'market.id',
                },
            },
            articles: {
                relation: BaseModel.HasManyRelation,
                modelClass: 'Article',
                join: {
                    from: 'vendor.id',
                    to: 'article.vendorId',
                },
            },
            sales: {
                relation: BaseModel.HasManyRelation,
                modelClass: 'Sale',
                join: {
                    from: 'vendor.id',
                    to: 'sale.vendorId',
                },
            },
        };
    }
}
