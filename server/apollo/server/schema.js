import path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import loadResolvers from './schema/loadResolvers';

export default makeExecutableSchema({
    typeDefs: mergeTypeDefs(loadFilesSync(path.join(__dirname, '../../typeDefs'))),
    resolvers: mergeResolvers([loadResolvers(path.join(__dirname, '../../resolvers'))]),
});
