import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: ['js/**', 'styles/**', 'public/**', 'docs/reference/**'],
  },
];

export default eslintConfig;
