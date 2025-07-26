const regex = /^[0-9]{4,8}$/;

export const match = (param: string) => {
  return param.match(regex) !== null;
};
