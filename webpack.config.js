import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default (_, args) => {
  const isDev = args.mode === 'development';
  return {
    devtool: 'source-map',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(process.cwd(), 'dist'),
      publicPath: isDev ? '/' : '/e-shop/',
      filename: '[name].[contenthash].js',
      clean: true,
    },
    stats: {
      warnings: true,
      errors: true,
      errorDetails: true,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        src: path.resolve(process.cwd(), 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.build.json',
            },
          },
          exclude: /node_modules|(\.test\.tsx?$|\.spec\.tsx?$|__tests__)/,
        },
        // {
        //   test: /\.css$/,
        //   exclude: /\.module\.css$/,
        //   use: [!isDev ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        // },
        // {
        //   test: /\.module\.css$/,
        //   use: [
        //     !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
        //     {
        //       loader: 'css-loader',
        //       options: {
        //         modules: {
        //           localIdentName: '[name]__[local]__[hash:base64:5]',
        //         },
        //       },
        //     },
        //   ],
        // },
        {
          test: /\.module\.s[ac]ss$/i,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                esModule: false,
                modules: {
                  localIdentName: '[name]_[local]-[hash:base64:5]',
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: ['src/shared/styles'],
                },
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: /\.module\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][contenthash][ext]',
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][contenthash][ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html',
      }),
      new MiniCssExtractPlugin(),
    ],
    devServer: {
      static: path.resolve(process.cwd(), 'dist'),
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
    },
    performance: {
      maxAssetSize: 800000,
      maxEntrypointSize: 1024000,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: 'single',
    },
  };
};
