export const StringUtils = {
  /**
   * 스트링이값이 있는지 확인
   * @param str
   * @returns
   */
  isNotEmpty: (str: string): boolean => {
    if (str === undefined || str === null || str.trim() === '') {
      return false;
    }
    return true;
  },

  /**
   * 널/공백 체크
   * @param str
   * @returns
   */
  isEmpty: (str: string): boolean => {
    return !StringUtils.isNotEmpty(str);
  },

  getRandomString: (length) => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  },
};
