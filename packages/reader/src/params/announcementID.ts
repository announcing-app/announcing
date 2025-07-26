const regex = /^[-_0-9A-Za-z.]{1,10}$/;

export const match = (param: string) => {
  return param.match(regex) !== null;
};
