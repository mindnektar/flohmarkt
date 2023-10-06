import BaseModel from './_base';

export default class Article extends BaseModel {
    static get relationMappings() {
        return {
            vendor: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'Vendor',
                join: {
                    from: 'article.vendorId',
                    to: 'vendor.id',
                },
            },
            sale: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'Sale',
                join: {
                    from: 'article.saleId',
                    to: 'sale.id',
                },
            },
        };
    }
}
