export const getFormString = (form: FormData, name: string) => {
  const v = form.get(name);
  if (typeof v === 'string') {
    return v;
  }
  return;
};

export const getFormNumber = (form: FormData, name: string) => {
  const v = form.get(name);
  if (typeof v === 'string') {
    return +v;
  }
  return;
};

export const getFormFile = (form: FormData, name: string) => {
  const v = form.get(name);
  if (v instanceof File) {
    return v;
  }
  return;
};

export const getFormFileOrString = (form: FormData, name: string) => {
  const v = form.get(name);
  if (v instanceof File) {
    return v;
  }
  if (typeof v === 'string') {
    return v;
  }
  return;
};

export const getFormFiles = (form: FormData, name: string) => {
  const l = form.getAll(name);
  const result: File[] = [];
  for (const v of l) {
    if (v instanceof File) {
      result.push(v);
    } else {
      return;
    }
  }
  return result;
};

export const getFormFilesOrStrings = (form: FormData, name: string) => {
  const l = form.getAll(name);
  if (l.length === 0) {
    return;
  }

  const result = [];
  for (const v of l) {
    if (v instanceof File || typeof v === 'string') {
      result.push(v);
    } else {
      console.warn('Unexpected parameter type');
      return;
    }
  }
  return result;
};
