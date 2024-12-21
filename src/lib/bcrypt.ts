


export default {
  async verify(passwd: string, hash: string) {
    return passwd == hash;
  },

  async hash(passwd: string) {
    return passwd
  },
};

