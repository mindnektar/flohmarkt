import { merge } from 'webpack-merge';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import commonConfig from './webpack.config.common.babel.js';

export default merge(commonConfig, {
    output: {
        filename: 'script/[name][hash].js',
        chunkFilename: 'script/[name][chunkhash].js',
    },

    optimization: {
        moduleIds: 'named',
    },

    plugins: [
        new UglifyJsPlugin({ sourceMap: true }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            hash: true,
            template: 'index.html',
            title: 'Flohmarkt-App',
            chunks: ['app'],
        }),
    ],

    mode: 'production',
});
