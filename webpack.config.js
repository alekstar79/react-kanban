import path from 'node:path';
import { fileURLToPath } from 'node:url';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const directory = path.dirname(fileURLToPath(import.meta.url));

export default (_env, argv) => {
  const isProduction = argv.mode === 'production';
  const publicPath = process.env.PUBLIC_PATH ?? '/';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(directory, 'dist'),
      filename: isProduction ? 'assets/js/[name].[contenthash:8].js' : 'assets/js/[name].js',
      assetModuleFilename: 'assets/media/[name].[contenthash:8][ext]',
      publicPath,
      clean: true,
    },
    resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },
    module: {
      rules: [
        { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            { loader: 'sass-loader', options: { api: 'modern' } },
          ],
        },
        {
          test: /\.(?:png|jpe?g|gif|webp|svg|woff2?)$/i,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 4096 } },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(directory, 'public/index.html'),
        favicon: path.resolve(directory, 'public/favicon.png'),
        minify: isProduction
          ? {
              collapseWhitespace: true,
              removeComments: true,
              minifyCSS: true,
              minifyJS: true,
            }
          : false,
      }),
      ...(isProduction
        ? [new MiniCssExtractPlugin({ filename: 'assets/css/[name].[contenthash:8].css' })]
        : []),
    ],
    optimization: isProduction
      ? {
          splitChunks: { chunks: 'all', name: 'vendors' },
          minimizer: ['...', new CssMinimizerPlugin()],
        }
      : {},
    devtool: isProduction ? false : 'cheap-module-source-map',
    devServer: {
      static: { directory: path.resolve(directory, 'public') },
      port: 3000,
      open: true,
    },
  };
};
