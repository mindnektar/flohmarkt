import BaseModel from './_base';

export default class Market extends BaseModel {
    static get relationMappings() {
        return {
            vendors: {
                relation: BaseModel.HasManyRelation,
                modelClass: 'Vendor',
                join: {
                    from: 'market.id',
                    to: 'vendor.marketId',
                },
            },
        };
    }
}
