import Vendor from 'models/Vendor';

export default {
    authorization: (_parent, _variables, { auth }) => (
        auth.isUser
    ),
    resolve: (_parent, { id }, _context, info) => (
        Vendor.query().findById(id).withGraphqlGraphFetched(info)
    ),
};
