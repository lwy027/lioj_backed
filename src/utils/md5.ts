import * as crypto from 'crypto';

const md5 = (str: string) => {
  const md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('hex');
};

export default md5;
