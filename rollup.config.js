
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;

export default {
  input: 'src/main.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
  },
  plugins: [
    babel({
      plugins: ["transform-react-jsx"],
      babelrc: false,
      exclude: 'node_modules/**'
    }),
    nodeResolve(),
    replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
    commonjs(),

    env === 'production' && uglify(),
  ],
  external: ['react', 'react-dom'],
  globals: {
    react: "React",
    "react-dom": "ReactDOM",
  }
};
