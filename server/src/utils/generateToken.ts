import * as crypto from 'crypto';

const generateToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

export default generateToken;
