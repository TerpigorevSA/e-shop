import '@testing-library/jest-dom';
import util from 'node:util';

global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder as any;
