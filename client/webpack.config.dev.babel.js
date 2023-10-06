import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import commonConfig from './webpack.config.common.babel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(commonConfig, {
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 4200,
        host: '0.0.0.0',
        compress: false,
        hot: true,
        historyApiFallback: true,
    },

    plugins: [
        new ReactRefreshWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],

    devtool: 'eval-source-map',

    target: 'web',

    mode: 'development',
});
